const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db');

// Register Applicant
router.post('/register', async (req, res) => {
  const { ApplicantName, DOB, Email, Phone } = req.body;
  try {
    let pool = await sql.connect(config);
    const checkEmail = await pool
      .request()
      .input('Email', sql.VarChar, Email)
      .query('SELECT * FROM Applicants WHERE Email = @Email');

    if (checkEmail.recordset.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    await pool.request()
      .input('ApplicantName', sql.NVarChar, ApplicantName)
      .input('DOB', sql.Date, DOB)
      .input('Email', sql.VarChar, Email)
      .input('Phone', sql.VarChar, Phone)
      .query(
        'INSERT INTO Applicants (ApplicantName, DOB, Email, Phone) VALUES (@ApplicantName, @DOB, @Email, @Phone)'
      );

    res.status(200).json({ message: 'Registered Successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { Email, DOB } = req.body;
  try {
    let pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('Email', sql.VarChar, Email)
      .input('DOB', sql.Date, DOB)
      .query('SELECT * FROM Applicants WHERE Email = @Email AND DOB = @DOB');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login Successful', data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
