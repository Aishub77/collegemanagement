const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db');


//post/add-section
router.post('/add-section', async (req, res) => {
  const { DegreeID, FieldID, Academicyear, Yearofstudy, SectionRoman } = req.body
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input("DegreeID", sql.Int, DegreeID)
      .input("FieldID", sql.Int, FieldID)
      .input("Academicyear", sql.VarChar, Academicyear ? Academicyear.trim() : null)
      .input("Yearofstudy", sql.Int, Yearofstudy)
      .input("SectionRoman", sql.VarChar, SectionRoman ? SectionRoman.trim() : null)
      .query(`Insert into ClassSections
      (DegreeID,FieldID,Academicyear,Yearofstudy,SectionRoman)
      values(@DegreeID,@FieldID,@AcademicYear,@Yearofstudy,@SectionRoman)`)
    res.status(200).json({ message: 'class section inserted successfully' })

  }
  catch (err) {
    console.error('insert Class Section Error', err);
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
});

//get/section history
router.get('/getsection', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(` select * from ClassSections`)
    res.json(result.recordset);
  }
  catch (err) {
    console.error('Failed to insert', err);
    res.status(500).json({ mesaage: 'Internal server error', error: err.meassage })
  }
})

// PUT update section
router.put('/update-section/:id', async (req, res) => {
  const { id } = req.params;
  let { DegreeID, FieldID, AcademicYear, Yearofstudy, SectionRoman } = req.body;

  try {
    AcademicYear = AcademicYear?.toString() || '';
    Yearofstudy = Yearofstudy?.toString() || '';
    SectionRoman = SectionRoman?.toString() || '';

    const pool = await sql.connect(config);
    await pool.request()
      .input('SectionID', sql.Int, id)
      .input('DegreeID', sql.Int, DegreeID)
      .input('FieldID', sql.Int, FieldID)
      .input('AcademicYear', sql.VarChar(50), AcademicYear)
      .input('Yearofstudy', sql.NVarChar, Yearofstudy)
      .input('SectionRoman', sql.NVarChar, SectionRoman)
      .query(`
        UPDATE ClassSections
        SET DegreeID = @DegreeID,
            FieldID = @FieldID,
            AcademicYear = @AcademicYear,
            Yearofstudy = @Yearofstudy,
            SectionRoman = @SectionRoman
        WHERE SectionID = @SectionID
      `);

    res.status(200).json({ message: 'Section updated successfully' });
  } catch (err) {
    console.error('Error updating section:', err);
    res.status(500).json({ error: 'Failed to update section' });
  }
});

// DELETE a section
router.delete('/delete-section/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('SectionID', sql.Int, id)
      .query(`DELETE FROM ClassSections WHERE SectionID = @SectionID`);
    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (err) {
    console.error('Error deleting section:', err);
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

//get all sectionRoman
router.get('/getallsections', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result= await pool.request().query(`select SectionRoman  FROM ClassSections`);
    res.json(result.recordset);
  }
   catch (err) {
    console.error('Failed to insert', err);
    res.status(500).json({ mesaage: 'Internal server error', error: err.message })
  }
})

module.exports = router;
