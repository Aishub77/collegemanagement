const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db');

router.get('/student/:studentCode/fee-details', async (req, res) => {
  const { studentCode } = req.params;
  console.log('✅ Hit fee-details API for student:', studentCode);

  try {
    const pool = await sql.connect(config);

    // 1. Get student details
    const studentResult = await pool.request()
      .input('StudentCode', sql.VarChar, studentCode)
      .query(`
        SELECT StudentCode, Username, Department, Course, YearOfStudy
        FROM Student
        WHERE StudentCode = @StudentCode
      `);

    if (studentResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const student = studentResult.recordset[0];
    const { Department, Course, YearOfStudy } = student;

    // 2. Get DegreeID from Degrees
    const degreeResult = await pool.request()
      .input('DegreeName', sql.NVarChar, Course)
      .query(`SELECT TOP 1 DegreeID FROM Degrees WHERE DegreeName = @DegreeName`);

    if (degreeResult.recordset.length === 0) {
      return res.status(404).json({ message: `Degree not found for: ${Course}` });
    }

    const DegreeID = degreeResult.recordset[0].DegreeID;

    // 3. Get FieldID from Fields
    const fieldResult = await pool.request()
      .input('FieldName', sql.NVarChar, Department)
      .query(`SELECT TOP 1 FieldID FROM Fields WHERE FieldName = @FieldName`);

    if (fieldResult.recordset.length === 0) {
      return res.status(404).json({ message: `Field not found for: ${Department}` });
    }

    const FieldID = fieldResult.recordset[0].FieldID;

    // 4. Get FeeStructure from FeeStructure
    const feeStructureResult = await pool.request()
      .input('DegreeID', sql.Int, DegreeID)
      .input('FieldID', sql.Int, FieldID)
      .input('YearOfStudy', sql.VarChar, YearOfStudy.toString())
      .query(`
        SELECT TOP 1 FeeStructureCode, TotalAnnualFee
        FROM FeeStructure
        WHERE DegreeID = @DegreeID AND FieldID = @FieldID AND YearOfStudy = @YearOfStudy
      `);

    if (feeStructureResult.recordset.length === 0) {
      return res.status(404).json({
        message: `No FeeStructure found for DegreeID: ${DegreeID}, FieldID: ${FieldID}, YearOfStudy: ${YearOfStudy}`
      });
    }

    const { FeeStructureCode, TotalAnnualFee } = feeStructureResult.recordset[0];

    // 5. Send Final Response
    return res.json({
      StudentCode: student.StudentCode,
      StudentName: student.Username,
      DegreeID,
      FieldID,
      YearOfStudy,
      FeeStructureCode,
      TotalAnnualFee
    });

  } catch (error) {
    console.error('❌ INTERNAL SERVER ERROR:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


module.exports = router;
