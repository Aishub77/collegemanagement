const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db');

// Get all fee structures
router.get('/feestructure', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`SELECT * FROM FeeStructure ORDER BY CreatedDate DESC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching fee structures', error: err.message });
  }
});

// Add new fee structure
router.post('/feestructure', async (req, res) => {
  const {
    DegreeID,
    FieldID,
    YearOfStudy,
    FirstYearFee = 0,
    SecondYearFee = 0,
    ThirdYearFee = 0,
    IsActive = true
  } = req.body;

  try {
    const pool = await sql.connect(config);

    const degreeResult = await pool.request()
      .input('DegreeID', sql.Int, DegreeID)
      .query('SELECT DegreeName FROM Degrees WHERE DegreeID = @DegreeID');

    const fieldResult = await pool.request()
      .input('FieldID', sql.Int, FieldID)
      .query('SELECT FieldName FROM Fields WHERE FieldID = @FieldID');

    // Validate existence
    if (degreeResult.recordset.length === 0 || fieldResult.recordset.length === 0) {
      return res.status(400).json({ message: 'Invalid DegreeID or FieldID' });
    }

    // Generate FeeStructureCode
    const DegreeName = degreeResult.recordset[0].DegreeName.toUpperCase().replace(/\s/g, '');
    const FieldName = fieldResult.recordset[0].FieldName.toUpperCase().replace(/\s/g, '');
    const FeeStructureCode = `FS-${DegreeName}-${FieldName}-${YearOfStudy}`;


    await pool.request()
      .input('DegreeID', sql.Int, DegreeID)
      .input('FieldID', sql.Int, FieldID)
      .input('YearOfStudy', sql.VarChar(50), YearOfStudy)
      .input('FirstYearFee', sql.Decimal(10, 2), FirstYearFee)
      .input('SecondYearFee', sql.Decimal(10, 2), SecondYearFee)
      .input('ThirdYearFee', sql.Decimal(10, 2), ThirdYearFee)
      .input('IsActive', sql.Bit, IsActive)
      .input('FeeStructureCode', sql.NVarChar(100), FeeStructureCode)
      .query(`
        INSERT INTO FeeStructure 
        (DegreeID, FieldID, YearOfStudy, FirstYearFee, SecondYearFee, ThirdYearFee, IsActive, FeeStructureCode, CreatedDate, LastModified)
        VALUES 
        (@DegreeID, @FieldID, @YearOfStudy, @FirstYearFee, @SecondYearFee, @ThirdYearFee, @IsActive, @FeeStructureCode, GETDATE(), GETDATE())
      `);

    res.status(201).json({
      message: 'Fee structure added successfully!',
      FeeStructureCode
    });

  } catch (err) {
    console.error('Error inserting fee structure:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/feestructure/:id', async (req, res) => {
  const { id } = req.params;
  const {
    DegreeID,
    FieldID,
    YearOfStudy,
    FirstYearFee = 0,
    SecondYearFee = 0,
    ThirdYearFee = 0,
    IsActive
  } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();

    await request
      .input('FeeStructureID', sql.Int, parseInt(id))
      .input('DegreeID', sql.Int, parseInt(DegreeID))
      .input('FieldID', sql.Int, parseInt(FieldID))
      .input('YearOfStudy', sql.VarChar(10), YearOfStudy)
      .input('FirstYearFee', sql.Decimal(10, 2), parseFloat(FirstYearFee))
      .input('SecondYearFee', sql.Decimal(10, 2), parseFloat(SecondYearFee))
      .input('ThirdYearFee', sql.Decimal(10, 2), parseFloat(ThirdYearFee))
      .input('IsActive', sql.Bit, IsActive === true || IsActive === 'true')
      .query(`
        UPDATE FeeStructure
        SET 
          DegreeID = @DegreeID,
          FieldID = @FieldID,
          YearOfStudy = @YearOfStudy,
          FirstYearFee = @FirstYearFee,
          SecondYearFee = @SecondYearFee,
          ThirdYearFee = @ThirdYearFee,
          IsActive = @IsActive,
          LastModified = GETDATE()
        WHERE FeeStructureID = @FeeStructureID
      `);

    res.json({ message: 'Fee structure updated successfully' });
  } catch (err) {
    console.error('Error updating fee structure:', err);
    res.status(500).json({ message: 'Error updating fee structure', error: err.message });
  }
});


// Delete fee structure
router.delete('/deletefeestructure/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sql.connect(config);
    await sql.query(`DELETE FROM FeeStructure WHERE FeeStructureID = ${id}`);
    res.json({ message: 'Fee structure deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting fee structure', error: err.message });
  }
});

module.exports = router;
