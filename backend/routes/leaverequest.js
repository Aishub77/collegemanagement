const express = require('express');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const router = express.Router();
const config = require('../db'); // your SQL config file

const JWT_SECRET = 'My_Secret_Key'; // Or load from .env

// 🔐 Middleware: verify token using cookie
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user details to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// 📩 POST: Apply for Leave
router.post('/apply', verifyToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized - Token missing' });

  const { username, role } = req.user;
  const { leaveType, fromDate, toDate, reason } = req.body;

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('ApplicantName', username)
      .input('ApplicantRole', role)
      .input('LeaveType', leaveType)
      .input('FromDate', fromDate)
      .input('ToDate', toDate)
      .input('Reason', reason)
      .query(`
        INSERT INTO LeaveRequests 
        (ApplicantName, ApplicantRole, LeaveType, FromDate, ToDate, Reason, Status, AppliedDate)
        VALUES (@ApplicantName, @ApplicantRole, @LeaveType, @FromDate, @ToDate, @Reason, 'Pending', GETDATE())
      `);
    res.json({ message: 'Leave request submitted successfully' });
  } catch (err) {
    console.error('Leave apply error:', err.message);
    res.status(500).json({ error: 'Internal Server Error: ' + err.message });
  }
});

// 📜 GET: User's Leave History
router.get('/history', verifyToken, async (req, res) => {
  const { username, role } = req.user;

  try {
    const pool = await sql.connect(config);

    let query = `
      SELECT LeaveID, ApplicantName, ApplicantRole, LeaveType, FromDate, ToDate, Reason, Status, AppliedDate
      FROM LeaveRequests
    `;

    if (role === 'Student' || role === 'Faculty') {
      query += ` WHERE ApplicantName = @ApplicantName ORDER BY AppliedDate DESC`;
    } else {
      query += ` ORDER BY AppliedDate DESC`; // Admin can view all
    }

    const result = await pool.request()
      .input('ApplicantName', username)
      .query(query);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/student-requests', verifyToken, async (req, res) => {
  const { role } = req.user;

  if (role !== 'Faculty') return res.status(403).json({ error: 'Access denied' });

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query(`
        SELECT * FROM LeaveRequests 
        WHERE ApplicantRole = 'Student' 
        ORDER BY AppliedDate DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🛡️ GET: Admin - All Leave Requests
router.get('/all', verifyToken, async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query(`SELECT * FROM LeaveRequests ORDER BY AppliedDate DESC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ PUT: Admin - Update Leave Status
// PUT: Admin or Faculty - Update Leave Status
router.put('/status/:leaveId', verifyToken, async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin' && role !== 'Faculty') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { leaveId } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('LeaveID', leaveId)
      .input('Status', status)
      .query(`
        UPDATE LeaveRequests 
        SET Status = @Status 
        WHERE LeaveID = @LeaveID
      `);
    res.json({ message: 'Leave status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
