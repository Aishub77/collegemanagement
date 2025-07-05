const express = require('express');
const router = express.Router();
const sql = require('mssql');
const multer = require('multer');
const path = require('path');

// Multer configuration (NO fs, assumes 'uploads/' folder exists)
const storage = multer.diskStorage({
  destination: 'uploads/', 
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
 
// Update Faculty Details
router.put('/updatefaculty/:facultycode', upload.single('ProfilePicture'), async (req, res) => {
  const data = req.body;
  const file = req.file;
  const facultyCode = req.params.facultycode;
  const experienceYears = isNaN(parseInt(data.ExperienceYears)) ? 0 : parseInt(data.ExperienceYears);

  try {
    const imagePath = file ? `uploads/${file.filename}` : null;

    const query = `
      UPDATE Faculty SET
        PhoneNumber = '${data.PhoneNumber || ''}',
        Gender = '${data.Gender || ''}',
        DateOfBirth = ${data.DateOfBirth ? `'${data.DateOfBirth}'` : 'NULL'},
        Department = '${data.Department || ''}',
        Qualification = '${data.Qualification || ''}',
        ExperienceYears = ${experienceYears},
        DateOfJoining = ${data.DateOfJoining ? `'${data.DateOfJoining}'` : 'NULL'},
        Address = '${data.Address || ''}',
        Status = '${data.Status || 'Active'}',
        RoleID = ${data.RoleID || 'NULL'},
        InchargeSectionRoman='${data.InchargeSectionRoman || ''}'
        ${imagePath ? `, ProfilePicture = '${imagePath}'` : ''}
      WHERE FacultyCode = '${facultyCode}'
    `;
    const pool = await sql.connect();
    const result = await pool.query(query);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: 'Faculty updated successfully' });
    } else {
      res.status(404).json({ message: 'Faculty not found' });
    }

  } catch (err) {
    console.error('Error updating faculty:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


//Get details based on Faculty code
router.get('/getfaculty/:getfid', async (req, res) => {
 const getid = req.params.getfid;
  try {
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT * FROM Faculty where FacultyCode='${getid}'
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching faculty list:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET all faculty users
router.get('/getfaculty', async (req, res) => {
  try { 
    const pool = await sql.connect();
    const result = await pool.request().query(`
      SELECT FacultyCode, Username,ProfilePicture,Email,Department,Status FROM Faculty 
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching faculty list:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Get all the Faculty Roles
router.get('/getroles',async(req,res)=>{
  try{
    const pool=await sql.connect();
    const result =await pool.request().query(`Select * from FacultyRoles`);
    res.json(result.recordset);
  }
  catch(err){
    console.error('Error Fetching Roles',err);
    res.status(500).json({ message: 'Server error'});
  }
})

module.exports=router;