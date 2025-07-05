const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});
const upload = multer({ storage });

//post code
router.post('/update-home', upload.single('banner'), async (req, res) => {
  const {
    Motto,
    Description,
    TextAlign,
    FontColor,
    BackgroundColor
  } = req.body;

  const BannerImageURL = req.file?.filename;

  try {
    await sql.connect(config);
    // Always only one row
    await sql.query`DELETE FROM HomeContent`;

    await sql.query`
      INSERT INTO HomeContent 
        (BannerImageURL, Motto, Description, TextAlign, FontColor, BackgroundColor)
      VALUES 
        (${BannerImageURL}, ${Motto}, ${Description}, ${TextAlign}, ${FontColor}, ${BackgroundColor})
    `;

    res.send('Home content updated successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// GET Home Content
router.get('/get-home', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT TOP 1 * FROM HomeContent ORDER BY ID DESC `;
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No home content found." });
    }
    res.json(result.recordset[0]);
  } 
  catch (err) {
    console.error('Error fetching home content:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;
