const express = require('express');
const router = express.Router();
const sql = require('mssql');
const multer = require('multer');
const config = require('../db');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'My_Secret_Key';  // Replace with JWT secret


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/circulars/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized - No token received' });

  try {
    const decoded = require('jsonwebtoken').verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}


// Route: Send Circular
router.post('/send-circular', verifyToken, upload.single('FileAttachment'), async (req, res) => {
  const { Title, Description, TargetRole, TargetDept, ValidTill } = req.body;
  const FileAttachment = req.file ? req.file.filename : null;
  const year = new Date().getFullYear();

  try {
    const pool = await sql.connect(config);

    //Get latest CircularID
    const result = await pool.request()
      .query(`SELECT TOP 1 CircularID FROM Circulars WHERE CircularID LIKE 'CIR${year}%' ORDER BY CircularID DESC`);

    let newIdNumber = 1;
    if (result.recordset.length > 0) {
      const lastId = result.recordset[0].CircularID;
      const lastNumber = parseInt(lastId.slice(7)); // remove "CIR2025"
      newIdNumber = lastNumber + 1;
    }

    // Generate new CircularID
    const paddedNumber = String(newIdNumber).padStart(5, '0');
    const newCircularID = `CIR${year}${paddedNumber}`;

    // Insert into Circulars
    await pool.request()
      .input('CircularID', sql.NVarChar, newCircularID)
      .input('Title', sql.NVarChar, Title)
      .input('Description', sql.NVarChar, Description)
      .input('FileAttachment', sql.NVarChar, FileAttachment)
      .input('SenderID', sql.Int, req.user.id)
      .input('SenderRole', sql.NVarChar, req.user.role)
      .input('SenderSubRole', sql.NVarChar, req.user.subrole || '') // optional
      .input('TargetRole', sql.NVarChar, TargetRole)
      .input('TargetDept', sql.NVarChar, TargetDept)
      .input('CreatedDate', sql.DateTime, new Date())
      .input('ValidTill', sql.DateTime, ValidTill)
      .input('Status', sql.NVarChar, 'Active')
      .query(`
        INSERT INTO Circulars
        (CircularID, Title, Description, FileAttachment, SenderID, SenderRole, SenderSubRole, TargetRole, TargetDept, CreatedDate, ValidTill, Status)
        VALUES
        (@CircularID, @Title, @Description, @FileAttachment, @SenderID, @SenderRole, @SenderSubRole, @TargetRole, @TargetDept, @CreatedDate, @ValidTill, @Status)
      `);

    res.status(200).json({ message: 'Circular sent successfully', CircularID: newCircularID });

  } catch (err) {
    console.error('Error sending circular:', err);
    res.status(500).json({ error: 'Server error sending circular' });
  }
});
// router.get('/my-circulars', verifyToken, async (req, res) => {
//   const userRole = req.user.role?.toLowerCase();

//   try {
//     const pool = await sql.connect(config);
//     const request = pool.request().input('Role', sql.NVarChar, userRole);
    
//     const query = `
//       SELECT * FROM Circulars 
//       WHERE (LOWER(TargetRole) = @Role OR LOWER(TargetRole) = 'All')
//         AND (ValidTill IS NULL OR ValidTill >= DATEADD(DAY, -3, GETDATE()))
//         AND Status = 'Active' AND TargetDept =@TargetDept
//     `;

//     const result = await request.query(query);
//     res.json(result.recordset);

//   } catch (err) {
//     console.error('❌ Error fetching circulars:', err);
//     res.status(500).json({ error: 'Failed to fetch circulars' });
//   }
// });

router.get('/my-circulars', verifyToken, async (req, res) => {
  const userRole = req.user.role?.toLowerCase();
  const department = req.query.department?.toLowerCase();

  if (!department) {
    return res.status(400).json({ error: 'Department is required' });
  }
  try {
    const pool = await sql.connect(config);
    const request = pool.request()
      .input('Role', sql.NVarChar, userRole)
      .input('TargetDept', sql.NVarChar, department);

    const query = `
      SELECT * FROM Circulars 
      WHERE (LOWER(TargetRole) = @Role OR LOWER(TargetRole) = 'all')
        AND (ValidTill IS NULL OR ValidTill >= DATEADD(DAY, -3, GETDATE()))
        AND Status = 'Active' 
        AND (LOWER(TargetDept) = @TargetDept OR LOWER(TargetDept) = 'all')
      ORDER BY CreatedDate DESC
    `;

    const result = await request.query(query);
    res.json(result.recordset);

  } catch (err) {
    console.error(' Error fetching circulars:', err);
    res.status(500).json({ error: 'Failed to fetch circulars' });
  }
});

module.exports = router;
