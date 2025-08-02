const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db');

// GET Fee Details by Student Code
router.get('/:studentCode', async (req, res) => {
  const { studentCode } = req.params;
  try {
    await sql.connect(config);

    const studentQuery = await sql.query`
      SELECT s.StudentCode, s.Username, s.Department, s.Course, s.YearOfStudy,
             d.DegreeID, f.FieldID, fs.FeeStructureID, fs.FeeStructureCode,
             fs.FirstYearFee, fs.SecondYearFee, fs.ThirdYearFee,
             fs.MandatoryComponentIDs
      FROM Student s
      JOIN Degrees d ON s.Course = d.DegreeName
      JOIN Fields f ON s.Department = f.FieldName AND f.DegreeID = d.DegreeID
      JOIN FeeStructure fs ON fs.DegreeID = d.DegreeID AND fs.FieldID = f.FieldID
      WHERE s.StudentCode = ${studentCode}`;

    const student = studentQuery.recordset[0];
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Determine year fee
    let yearFee = 0;
    if (student.YearOfStudy == 1) yearFee = student.FirstYearFee;
    else if (student.YearOfStudy == 2) yearFee = student.SecondYearFee;
    else if (student.YearOfStudy == 3) yearFee = student.ThirdYearFee;

    // ✅ Fix: Fetch fee components using MandatoryComponentIDs + FeeStructureCode
    const mandatoryIds = student.MandatoryComponentIDs
      ? student.MandatoryComponentIDs.split(',').map(id => parseInt(id.trim()))
      : [];

    let feeComponents = [];

    if (mandatoryIds.length > 0) {
      const idList = mandatoryIds.join(',');

      const componentQuery = await sql.query(`
        SELECT ComponentID, ComponentName, Amount
        FROM FeeComponents
        WHERE ComponentID IN (${idList})
          AND FeeStructureCode = '${student.FeeStructureCode}'
      `);

      feeComponents = componentQuery.recordset;
    }

    const totalComponentFee = feeComponents.reduce((sum, c) => sum + c.Amount, 0);
    const totalFee = yearFee + totalComponentFee;

    // Check payment record
    const paymentQuery = await sql.query`
      SELECT * FROM StudentFeeRecords
      WHERE StudentCode = ${studentCode} 
        AND FeeStructureID = ${student.FeeStructureID} 
        AND YearOfStudy = ${student.YearOfStudy}`;

    const payment = paymentQuery.recordset[0];

    res.json({
      student,
      yearFee,
      feeComponents,
      totalComponentFee,
      totalFee,
      payment
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Make a Payment
router.post('/pay', async (req, res) => {
  const { StudentCode, FeeStructureID, YearOfStudy, TotalAmount, PaidAmount } = req.body;
  try {
    await sql.connect(config);

    const BalanceAmount = TotalAmount - PaidAmount;
    const PaymentStatus = BalanceAmount === 0 ? 'Paid' : 'Partially Paid';
    await sql.query`
  INSERT INTO StudentFeeRecords
  (StudentCode, FeeStructureID, YearOfStudy, TotalAmount, PaidAmount, BalanceAmount, PaymentStatus, LastPaymentDate)
  VALUES
  (${StudentCode}, ${FeeStructureID}, ${YearOfStudy}, ${TotalAmount}, ${PaidAmount}, ${BalanceAmount}, ${PaymentStatus}, GETDATE())`;


    res.json({ message: 'Payment recorded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Payment error' });
  }
});

module.exports = router;
