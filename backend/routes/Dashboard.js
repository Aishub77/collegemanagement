const express = require('express');
const router = express.Router();
const config = require('../db');
const sql = require('mssql');

// Get total active students
router.get('/summary/total-activestudents', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query("SELECT COUNT(*) AS TotalActiveStudents FROM Student WHERE Status = 'Active'");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get total active faculty
router.get('/summary/total-activefaculty', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query("SELECT COUNT(*) AS TotalActiveFaculty FROM Faculty WHERE Status = 'Active'");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get distinct application years
router.get('/summary/application-years', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query("SELECT DISTINCT YEAR(CreatedAt) AS ApplicationYear FROM CollegeApplications ORDER BY ApplicationYear DESC  ");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get total applications for selected year
router.get('/summary/applications-by-year/:year', async (req, res) => {
  const { year } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('year', sql.Int, year)
      .query("SELECT COUNT(*) AS TotalApplications FROM CollegeApplications WHERE YEAR(CreatedAt) = @year");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Student count by department
router.get('/summary/student-count-by-department', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    
    const result = await pool.request().query(`
      SELECT Department, COUNT(*) AS Count
      FROM Student
      WHERE Status = 'Active' -- optional filter
      GROUP BY Department
      ORDER BY Department;
    `);

    res.json(result.recordset); // send to frontend
  } catch (err) {
    console.error('Error fetching student count by department:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/summary/department-wise-count', async (req, res) => {
  try {
    const pool = await sql.connect(/* your DB config */);
    const result = await pool.request().query(`
      SELECT 
        COALESCE(S.Department, F.Department) AS Department,
        COUNT(DISTINCT S.StudentCode) AS StudentCount,
        COUNT(DISTINCT F.FacultyCode) AS FacultyCount
      FROM Student S
      FULL JOIN Faculty F ON S.Department = F.Department
      GROUP BY COALESCE(S.Department, F.Department)
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching department-wise counts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
