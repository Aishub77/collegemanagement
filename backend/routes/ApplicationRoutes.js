const express = require('express');
const router = express.Router();
const multer = require('multer');
const sql = require('mssql');
const config = require('../db');
const { sendShortlistEmail } = require('../routes/emailService');


// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'Photo', maxCount: 1 },
  { name: 'Marksheet', maxCount: 1 },
  { name: 'SportsQuotaDoc', maxCount: 1 },
  { name: 'PhysicallyChallengedDoc', maxCount: 1 },
  { name: 'ExServicemanDoc', maxCount: 1 }
]);

// Utility function to clean decimals
function cleanDecimal(value) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

async function generateApplicationID() {
  const year = new Date().getFullYear();
  const prefix = `APP${year}`;

  const pool = await sql.connect(config);
  const result = await pool.request().query(`
    SELECT MAX(CAST(SUBSTRING(ApplicationID, ${prefix.length + 1}, 5) AS INT)) AS MaxNum
    FROM CollegeApplications
    WHERE ApplicationID LIKE '${prefix}%'
  `);

  const maxNum = result.recordset[0].MaxNum || 0;
  const nextNumber = maxNum + 1;

  return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
}


//POST: /applist/apply
router.post('/apply', upload, async (req, res) => {
  try {
    const formData = req.body;
    const files = req.files;

    const photoPath = files?.Photo?.[0]?.filename || null;
    const marksheetPath = files?.MarksheetPath?.[0]?.filename || null;
    const sportsDocPath = files?.SportsQuotaDocPath?.[0]?.filename || null;
    const physicallyDocPath = files?.PhysicallyChallengedDocPath?.[0]?.filename || null;
    const exServiceDocPath = files?.ExServicemanDocPath?.[0]?.filename || null;

    const applicationID = await generateApplicationID();

    const pool = await sql.connect(config);

    const insertQuery = `
      INSERT INTO CollegeApplications (
        ApplicationID, FirstName, LastName, DOB, Gender, Email, Phone, Address,
        City, State, Pin, School, Board, PassingYear, Percentage, Subjects,
        Degree, Field, EntranceExam, ExamScore, ParentName, ParentPhone,
        ParentOccupation, IncomeRange, Category, PhotoPath, MarksheetPath,
        CreatedAt, ApplicationStatus, SportsQuota, SportsQuotaDocPath,
        PhysicallyChallenged, PhysicallyChallengedDocPath,
        ExServiceman, ExServicemanDocPath
      ) VALUES (
        @ApplicationID, @FirstName, @LastName, @DOB, @Gender, @Email, @Phone, @Address,
        @City, @State, @Pin, @School, @Board, @PassingYear, @Percentage, @Subjects,
        @Degree, @Field, @EntranceExam, @ExamScore, @ParentName, @ParentPhone,
        @ParentOccupation, @IncomeRange, @Category, @PhotoPath, @MarksheetPath,
        @CreatedAt, @ApplicationStatus, @SportsQuota, @SportsQuotaDocPath,
        @PhysicallyChallenged, @PhysicallyChallengedDocPath,
        @ExServiceman, @ExServicemanDocPath
      )
    `;

    await pool.request()
      .input('ApplicationID', sql.VarChar(20), applicationID)
      .input('FirstName', sql.NVarChar(50), formData.FirstName)
      .input('LastName', sql.NVarChar(50), formData.LastName)
      .input('DOB', sql.Date, formData.DOB)
      .input('Gender', sql.NVarChar(10), formData.Gender)
      .input('Email', sql.NVarChar(100), formData.Email)
      .input('Phone', sql.NVarChar(20), formData.Phone)
      .input('Address', sql.NVarChar(255), formData.Address)
      .input('City', sql.NVarChar(50), formData.City)
      .input('State', sql.NVarChar(50), formData.State)
      .input('Pin', sql.NVarChar(10), formData.Pin || null)
      .input('School', sql.NVarChar(100), formData.School)
      .input('Board', sql.NVarChar(50), formData.Board)
      .input('PassingYear', sql.Int, parseInt(formData.PassingYear))
      .input('Percentage', sql.Decimal(5, 2), cleanDecimal(formData.Percentage))
      .input('Subjects', sql.NVarChar(255), formData.Subjects || null)
      .input('Degree', sql.NVarChar(100), formData.Degree)
      .input('Field', sql.NVarChar(100), formData.Field)
      .input('EntranceExam', sql.NVarChar(100), formData.EntranceExam || null)
      .input('ExamScore', sql.NVarChar(50), formData.ExamScore || null)
      .input('ParentName', sql.NVarChar(100), formData.ParentName || null)
      .input('ParentPhone', sql.NVarChar(20), formData.ParentPhone || null)
      .input('ParentOccupation', sql.NVarChar(100), formData.ParentOccupation || null)
      .input('IncomeRange', sql.NVarChar(50), formData.IncomeRange || null)
      .input('Category', sql.NVarChar(50), formData.Category || null)
      .input('PhotoPath', sql.NVarChar(255), photoPath)
      .input('MarksheetPath', sql.NVarChar(255), marksheetPath)
      .input('CreatedAt', sql.DateTime, new Date())
      .input('ApplicationStatus', sql.VarChar(20), 'Pending')
      .input('SportsQuota', sql.Bit, formData.SportsQuota === 'Yes')
      .input('SportsQuotaDocPath', sql.NVarChar(255), sportsDocPath)
      .input('PhysicallyChallenged', sql.Bit, formData.PhysicallyChallenged === 'Yes')
      .input('PhysicallyChallengedDocPath', sql.NVarChar(255), physicallyDocPath)
      .input('ExServiceman', sql.Bit, formData.ExServiceman === 'Yes')
      .input('ExServicemanDocPath', sql.NVarChar(255), exServiceDocPath)
      .query(insertQuery);

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      applicationID
    });

  } catch (error) {
    console.error('Error in /apply route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    });
  }
});

// GET:/applications/summary?filter=SportsQuota
router.get('/applications/summary', async (req, res) => {
  try {
    const { filter } = req.query;
    await sql.connect(config);

    let query = `
      SELECT ApplicationID, FirstName + ' ' + LastName AS FullName,
             Email, Degree, Field, Board, PassingYear, Percentage, ApplicationStatus
      FROM CollegeApplications 
    `;

    if (filter === 'SportsQuota') {
      query += ' WHERE SportsQuota = 1';
    } else if (filter === 'PhysicallyChallenged') {
      query += ' WHERE PhysicallyChallenged = 1';
    } else if (filter === 'ExServiceman') {
      query += ' WHERE ExServiceman = 1';
    }

    const result = await sql.query(query);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/applications/status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await sql.connect(config);

    // Get student details for email
    const result = await sql.query(`
      SELECT FirstName, LastName, Email, Degree FROM CollegeApplications
      WHERE ApplicationID = '${id}'
    `);
    const student = result.recordset[0];

    await sql.query(`UPDATE CollegeApplications SET ApplicationStatus = '${status}' WHERE ApplicationID = '${id}'`);

    // Send Email if shortlisted
    if (status === 'Shortlisted' && student?.Email) {
      await sendShortlistEmail(
        student.Email,
        `${student.FirstName} ${student.LastName}`,
        student.Degree
      );
    }

    res.json({ message: `Status updated to ${status}` });
  } catch (err) {
    console.error('Status Update Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// get the applications list by ID
router.get('/applications/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(config);

    const result = await sql.query(`
      SELECT *
      FROM CollegeApplications
      WHERE ApplicationID = '${id}'
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(result.recordset[0]); 
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
