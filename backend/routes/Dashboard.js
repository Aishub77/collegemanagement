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
      .query("SELECT DISTINCT YEAR(CreatedAt) AS ApplicationYear FROM CollegeApplications ORDER BY ApplicationYear DESC");
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

module.exports = router;
