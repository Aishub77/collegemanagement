const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db');

// Get all fee structures
router.get('/getfeestructure', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`SELECT * FROM FeeStructure ORDER BY CreatedDate DESC`);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching fee structures', error: err.message });
  }
});

// Add Fee Structure (POST)
router.post('/feestructure', async (req, res) => {
  const {
    DegreeID,
    FieldID,
    YearOfStudy,
    FirstYearFee = 0,
    SecondYearFee = 0,
    ThirdYearFee = 0,
    IsActive = true,
    MandatoryComponentIDs // String like "1,2,3"
  } = req.body;

  // console.log("⏱️ Payload received:", req.body);

  try {
    const pool = await sql.connect(config);
    console.log("✅ Connected to DB");

    // Fetch DegreeName and FieldName for code generation
    const degreeQuery = await pool.request()
      .input('DegreeID', sql.Int, DegreeID)
      .query('SELECT DegreeName FROM Degrees WHERE DegreeID = @DegreeID');

    const fieldQuery = await pool.request()
      .input('FieldID', sql.Int, FieldID)
      .query('SELECT FieldName FROM Fields WHERE FieldID = @FieldID');

    if (degreeQuery.recordset.length === 0 || fieldQuery.recordset.length === 0) {
      return res.status(400).json({ message: 'Invalid degree or field ID' });
    }

    const DegreeName = degreeQuery.recordset[0].DegreeName.replace(/\s/g, '').toUpperCase();
    const FieldName = fieldQuery.recordset[0].FieldName.replace(/\s/g, '').toUpperCase();
    const FeeStructureCode = `FS-${DegreeName}-${FieldName}-${YearOfStudy}`;

    // console.log("🎯 Generated FeeStructureCode:", FeeStructureCode);

    // Insert into DB without TotalAnnualFee (since it's a computed column)
    await pool.request()
      .input('FeeStructureCode', sql.NVarChar(100), FeeStructureCode)
      .input('DegreeID', sql.Int, DegreeID)
      .input('FieldID', sql.Int, FieldID)
      .input('YearOfStudy', sql.VarChar(50), YearOfStudy)
      .input('FirstYearFee', sql.Decimal(10, 2), FirstYearFee)
      .input('SecondYearFee', sql.Decimal(10, 2), SecondYearFee)
      .input('ThirdYearFee', sql.Decimal(10, 2), ThirdYearFee)
      .input('IsActive', sql.Bit, IsActive)
      .input('MandatoryComponentIDs', sql.NVarChar(255), MandatoryComponentIDs || null)
      .query(`
        INSERT INTO FeeStructure 
        (FeeStructureCode, DegreeID, FieldID, YearOfStudy, FirstYearFee, SecondYearFee, ThirdYearFee, IsActive, MandatoryComponentIDs, CreatedDate, LastModified)
        VALUES 
        (@FeeStructureCode, @DegreeID, @FieldID, @YearOfStudy, @FirstYearFee, @SecondYearFee, @ThirdYearFee, @IsActive, @MandatoryComponentIDs, GETDATE(), GETDATE())
      `);

    console.log("✅ Fee structure inserted!");
    res.status(201).json({ message: 'Fee structure added successfully', FeeStructureCode });

  } catch (err) {
    console.error("🔥 Error inserting fee structure:", err);
    res.status(500).json({ message: 'Error adding fee structure', error: err.message });
  }
});


//  GET /feestructure/:code — Fetch FeeStructure with Component Names
router.get('/feestructure/:code', async (req, res) => {
  const code = req.params.code;

  try {
    const pool = await sql.connect(config);

    const fsResult = await pool.request()
      .input('Code', sql.NVarChar(100), code)
      .query('SELECT * FROM FeeStructure WHERE FeeStructureCode = @Code');

    if (fsResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Fee structure not found' });
    }

    const feeStructure = fsResult.recordset[0];

    const compResult = await pool.request().query(`
      SELECT ComponentID, ComponentName, Amount FROM FeeComponents
    `);

    const selectedIds = feeStructure.MandatoryComponentIDs
      ? feeStructure.MandatoryComponentIDs.split(',').map(id => parseInt(id))
      : [];

    const selectedComponents = compResult.recordset.filter(comp =>
      selectedIds.includes(comp.ComponentID)
    );

    res.json({ ...feeStructure, MandatoryComponents: selectedComponents });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving data', error: err.message });
  }
});



// router.put('/feestructure/:id', async (req, res) => {
//   const { id } = req.params;
//   const {
//     DegreeID,
//     FieldID,
//     YearOfStudy,
//     FirstYearFee = 0,
//     SecondYearFee = 0,
//     ThirdYearFee = 0,
//     IsActive
//   } = req.body;

//   try {
//     await sql.connect(config);
//     const request = new sql.Request();

//     await request
//       .input('FeeStructureID', sql.Int, parseInt(id))
//       .input('DegreeID', sql.Int, parseInt(DegreeID))
//       .input('FieldID', sql.Int, parseInt(FieldID))
//       .input('YearOfStudy', sql.VarChar(10), YearOfStudy)
//       .input('FirstYearFee', sql.Decimal(10, 2), parseFloat(FirstYearFee))
//       .input('SecondYearFee', sql.Decimal(10, 2), parseFloat(SecondYearFee))
//       .input('ThirdYearFee', sql.Decimal(10, 2), parseFloat(ThirdYearFee))
//       .input('IsActive', sql.Bit, IsActive === true || IsActive === 'true')
//       .query(`
//         UPDATE FeeStructure
//         SET 
//           DegreeID = @DegreeID,
//           FieldID = @FieldID,
//           YearOfStudy = @YearOfStudy,
//           FirstYearFee = @FirstYearFee,
//           SecondYearFee = @SecondYearFee,
//           ThirdYearFee = @ThirdYearFee,
//           IsActive = @IsActive,
//           LastModified = GETDATE()
//         WHERE FeeStructureID = @FeeStructureID
//       `);

//     res.json({ message: 'Fee structure updated successfully' });
//   } catch (err) {
//     console.error('Error updating fee structure:', err);
//     res.status(500).json({ message: 'Error updating fee structure', error: err.message });
//   }
// });


router.put('/feestructure/:id', async (req, res) => {
  const { id } = req.params;
  const {
    DegreeID,
    FieldID,
    YearOfStudy,
    FirstYearFee = 0,
    SecondYearFee = 0,
    ThirdYearFee = 0,
    IsActive,
    MandatoryComponentIDs = ''
  } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();

    await request
      .input('FeeStructureID', sql.Int, parseInt(id))
      .input('DegreeID', sql.Int, parseInt(DegreeID))
      .input('FieldID', sql.Int, parseInt(FieldID))
      .input('YearOfStudy', sql.VarChar(50), YearOfStudy)
      .input('FirstYearFee', sql.Decimal(10, 2), parseFloat(FirstYearFee))
      .input('SecondYearFee', sql.Decimal(10, 2), parseFloat(SecondYearFee))
      .input('ThirdYearFee', sql.Decimal(10, 2), parseFloat(ThirdYearFee))
      .input('MandatoryComponentIDs', sql.NVarChar(255), MandatoryComponentIDs)
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
          MandatoryComponentIDs = @MandatoryComponentIDs,
          IsActive = @IsActive,
          LastModified = GETDATE()
        WHERE FeeStructureID = @FeeStructureID
      `);

    res.json({ message: '✅ Fee structure updated successfully' });
  } catch (err) {
    console.error('❌ Error updating fee structure:', err);
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


// GET all component IDs and names
router.get('/components', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT ComponentID, ComponentName, Amount,FeeStructureCode,IsMandatory,CreatedDate
      FROM FeeComponents
      ORDER BY ComponentName
    `);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching components:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Backend: Express Router (routes/fee.js)

router.post('/component', async (req, res) => {
  const { FeeStructureCode, ComponentName, Amount, IsMandatory, Description } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('FeeStructureCode', sql.NVarChar(100), FeeStructureCode)
      .input('ComponentName', sql.NVarChar(100), ComponentName)
      .input('Amount', sql.Decimal(10, 2), Amount)
      .input('IsMandatory', sql.Bit, IsMandatory)
      .input('Description', sql.NVarChar(255), Description)
      .query(`
        INSERT INTO FeeComponents 
        (FeeStructureCode, ComponentName, Amount, IsMandatory, Description, CreatedDate) 
        VALUES (@FeeStructureCode, @ComponentName, @Amount, @IsMandatory, @Description, GETDATE())
      `);
    res.status(201).json({ message: 'Component added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed', details: err.message });
  }
});


// PUT update component
router.put('/component/:id', async (req, res) => {
  const { id } = req.params;
  const { FeeStructureCode, ComponentName, Amount, IsMandatory, Description } = req.body;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('ComponentID', sql.Int, id)
      .input('FeeStructureCode', sql.VarChar, FeeStructureCode)
      .input('ComponentName', sql.VarChar, ComponentName)
      .input('Amount', sql.Decimal(10, 2), Amount)
      .input('IsMandatory', sql.Bit, IsMandatory)
      .input('Description', sql.VarChar, Description)
      .query(`
        UPDATE FeeComponents
        SET FeeStructureCode=@FeeStructureCode, ComponentName=@ComponentName, Amount=@Amount,
            IsMandatory=@IsMandatory, Description=@Description
        WHERE ComponentID=@ComponentID
      `);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// DELETE component
router.delete('/component/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    await pool.request().input('ComponentID', sql.Int, id)
      .query('DELETE FROM FeeComponents WHERE ComponentID = @ComponentID');
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});


module.exports = router;
