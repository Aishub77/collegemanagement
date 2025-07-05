const express = require('express');
const router = express.Router();
const config = require('../db');
const sql=require('mssql')

// GET all degrees
router.get('/degreeget', async (req, res) => {
  try {
    await sql.connect(config);  // ✅ Add await
    const result = await sql.query('SELECT * FROM Degrees');
    res.json(result.recordset);
  } catch (error) {
    console.error(error); // ✅ Log actual error
    res.status(500).send('Error fetching degrees');
  }
});

//post the Degree
router.post('/degreepost', async (req, res) => {
  const { name } = req.body;
  try {
    await sql.connect(config);  // ✅ Add await
    await sql.query`INSERT INTO Degrees (DegreeName) VALUES (${name})`;
    res.status(201).send('Degree added');
  } catch (error) {
    console.error(error); // ✅ Log actual error
    res.status(500).send('Error adding degree');
  }
});


// UPDATE Degree
router.put('/degreeupdate/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await sql.connect(config);
    await sql.query`UPDATE Degrees SET DegreeName = ${name} WHERE DegreeID = ${id}`;
    res.send('Degree updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating degree');
  }
});

// DELETE Degree
router.delete('/degreedelete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.connect(config);
    await sql.query`DELETE FROM Degrees WHERE DegreeID = ${id}`;
    res.send('Degree deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting degree');
  }
});

// GET fields by degree
router.get('/fieldbydegree/:degreeId', async (req, res) => {
  const { degreeId } = req.params;

  if (!degreeId || isNaN(parseInt(degreeId))) {
    return res.status(400).json({ error: 'Invalid degreeId parameter' });
  }

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Fields WHERE DegreeId = ${parseInt(degreeId)}`;
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching fields by degree:', error);
    res.status(500).send('Error fetching fields by degree');
  }
});


// GET fields by DegreeName (e.g., "B.A", "B.Sc")
router.get('/fieldbydegreename/:degreeName', async (req, res) => {
  const { degreeName } = req.params;

  if (!degreeName || degreeName.trim() === '') {
    return res.status(400).json({ error: 'Degree name is required' });
  }

  try {
    await sql.connect(config);
    const degreeResult = await sql.query `SELECT DegreeId FROM Degrees WHERE DegreeName = ${degreeName}`;
    if (degreeResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Degree not found' });
    }

    const degreeId = degreeResult.recordset[0].DegreeId;
    // Now get Fields for that DegreeId
    const fieldsResult = await sql.query`
      SELECT FieldId, FieldName, DegreeId FROM Fields WHERE DegreeId = ${degreeId} `;
    res.status(200).json(fieldsResult.recordset);
  }
   catch (error) {
    console.error('Error fetching fields by degree name:', error);
    res.status(500).json({ error: 'Error fetching fields by degree name' });
  }
});

module.exports = router;
