const express = require('express');
const router = express.Router();
const sql = require('mssql');
const multer = require('multer');
const path = require('path');

// Multer configuration 
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// GET all students
router.get('/getstudent', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT StudentCode, Username, Email,Department FROM Student
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching student list:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//GET student by code
router.get('/getstudent/:getsid', async (req, res) => {
  const getsid = req.params.getsid;
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT * FROM Student WHERE StudentCode = '${getsid}'
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching student details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update student
router.put('/updatestudent/:studentcode', upload.single('ProfilePicture'), async (req, res) => {
  const data = req.body;
  const file = req.file;
  const studentCode = req.params.studentcode;

  console.log('Incoming file:', file);

  const yearOfStudy = isNaN(parseInt(data.YearOfStudy)) ? 0 : parseInt(data.YearOfStudy);
  const enrollmentYear = isNaN(parseInt(data.EnrollmentYear)) ? 0 : parseInt(data.EnrollmentYear);
  const imagePath = file ? `uploads/${file.filename}` : null;

  let updateFields = `
    PhoneNumber = '${data.PhoneNumber || ''}',
    Gender = '${data.Gender || ''}',
    DateOfBirth = ${data.DateOfBirth ? `'${data.DateOfBirth}'` : 'NULL'},
    Department = '${data.Department || ''}',
    Course = '${data.Course || ''}',
    YearOfStudy = ${yearOfStudy},
    EnrollmentYear = ${enrollmentYear},
    RollNumber = '${data.RollNumber || ''}',
    Status = '${data.Status || 'Active'}',
    Address = '${data.Address || ''}' `;
  if (imagePath) {
    updateFields += `, ProfilePicture = '${imagePath}'`;
  }

  const query = `UPDATE Student SET ${updateFields} WHERE StudentCode = '${studentCode}' `;
  try {
    const pool = await sql.connect();
    const result = await pool.query(query);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: 'Student updated successfully' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } 
  catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
