const express = require('express');
const router = express.Router();
const config = require('../db');
const sql = require('mssql');

// Get all fields with their degree names
router.get('/fieldget', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query(`
      SELECT 
        f.FieldId, 
        f.FieldName AS FieldName, 
        f.DegreeId, 
        d.DegreeName AS DegreeName
      FROM 
        Fields f
      JOIN 
        Degrees d ON f.DegreeId = d.DegreeId
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching fields:', error);
    res.status(500).send('Error fetching fields');
  }
});

// Add a new field
router.post('/fieldpost', async (req, res) => {
  const { name, degreeId } = req.body;

  if (!name || !degreeId || isNaN(parseInt(degreeId))) {
    return res.status(400).json({ error: 'Field name and valid degreeId are required' });
  }

  try {
    await sql.connect(config);
    await sql.query`INSERT INTO Fields (FieldName, DegreeId) VALUES (${name}, ${parseInt(degreeId)})`;
    res.status(201).send('Field added');
  } catch (error) {
    console.error('Error adding field:', error);
    res.status(500).send('Error adding field');
  }
});

// Update field
router.put('/fieldupdate/:id', async (req, res) => {
  const { id } = req.params;
  const { name, degreeId } = req.body;
  if (!id || isNaN(parseInt(id)) || !name || !degreeId || isNaN(parseInt(degreeId))) {
    return res.status(400).json({ error: 'Valid field ID, name, and degreeId are required' });
  }
  try {
    await sql.connect(config);
    await sql.query`UPDATE Fields SET FieldName = ${name}, DegreeID = ${parseInt(degreeId)} WHERE FieldID = ${parseInt(id)}`;
    res.send('Field updated');
  } 
  catch (error) {
    console.error('Error updating field:', error);
    res.status(500).send('Error updating field');
  }
});

// Delete field
router.delete('/fielddelete/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Valid field ID required' });
  }

  try {
    await sql.connect(config);
    await sql.query`DELETE FROM Fields WHERE FieldID = ${parseInt(id)}`;
    res.send('Field deleted');
  } catch (error) {
    console.error('Error deleting field:', error);
    res.status(500).send('Error deleting field');
  }
});

module.exports = router;
