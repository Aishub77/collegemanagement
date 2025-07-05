const express = require('express');
const router = express.Router();
const config = require('../db');
const sql = require('mssql');


let marqueeMessage = "Welcome to CrownRidge Arts & Science College!";


router.get('/api/marquee', (req, res) => {
  res.json({ message: marqueeMessage });
});

router.post('/api/marquee', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });
  marqueeMessage = message;
  res.json({ success: true });
});


module.exports=router;