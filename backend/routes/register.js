const express = require('express');
const sql = require('mssql');
const config = require('../db');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const JWT_SECRET = 'My_Secret_Key';

// Use cookie-parser middleware
router.use(cookieParser());

// REGISTER 
router.post('/users', async (req, res) => {
    const {
        Username, Password, Email, Role,
        PhoneNumber, Gender, DateOfBirth, Department,
        Qualification, ExperienceYears, DateOfJoining, Address,
        ProfilePicture, Status, Course, YearOfStudy,
        EnrollmentYear, RollNumber
    } = req.body;

    try {
        const year = new Date().getFullYear();
        let code; 
        const userQuery = `
            INSERT INTO Register_Users (Username, Password, Email, Role)
            OUTPUT INSERTED.Id
            VALUES ('${Username}', '${Password}', '${Email}', '${Role}') `;
        const userResult = await sql.connect(config).then(conn => conn.request().query(userQuery));
        const UserID = userResult.recordset[0].Id;
        if (Role === 'Faculty') {
            const countResult = await sql.connect(config).then(conn =>
            conn.request().query(`SELECT COUNT(*) AS total FROM Faculty WHERE FacultyCode LIKE 'FAC${year}%'`)
            );
            const serial = String(countResult.recordset[0].total + 1).padStart(4, '0');
            code = `FAC${year}${serial}`;

            const insertFaculty = `
                INSERT INTO Faculty (
                    FacultyCode, Id, Username, Email, PhoneNumber, Gender, DateOfBirth,
                    Department, Qualification, ExperienceYears, DateOfJoining,
                    Address, ProfilePicture, Status
                ) VALUES (
                    '${code}', ${UserID}, '${Username}', '${Email}', '${PhoneNumber || ''}', '${Gender || ''}',
                    ${DateOfBirth ? `'${DateOfBirth}'` : 'NULL'},
                    '${Department || ''}', '${Qualification || ''}', ${ExperienceYears || 0},
                    ${DateOfJoining ? `'${DateOfJoining}'` : 'NULL'},
                    '${Address || ''}', '${ProfilePicture || ''}', '${Status || 'Active'}'
                )
            `;
            await sql.connect(config).then(conn => conn.request().query(insertFaculty));

        } else if (Role === 'Student') {
            const countResult = await sql.connect(config).then(conn =>
                conn.request().query(`SELECT COUNT(*) AS total FROM Student WHERE StudentCode LIKE 'STU${year}%'`)
            );
            const serial = String(countResult.recordset[0].total + 1).padStart(4, '0');
            code = `STU${year}${serial}`;

            const insertStudent = `
                INSERT INTO Student (
                    StudentCode, Id, Username, Email, PhoneNumber, Gender, DateOfBirth,
                    Department, Course, YearOfStudy, EnrollmentYear, RollNumber,
                    Address, ProfilePicture, Status
                ) VALUES (
                    '${code}', ${UserID}, '${Username}', '${Email}', '${PhoneNumber || ''}', '${Gender || ''}',
                    ${DateOfBirth ? `'${DateOfBirth}'` : 'NULL'},
                    '${Department || ''}', '${Course || ''}', ${YearOfStudy || 1},
                    ${EnrollmentYear || year}, '${RollNumber || ''}', '${Address || ''}',
                    '${ProfilePicture || ''}', '${Status || ''}'
                )
            `;
            await sql.connect(config).then(conn => conn.request().query(insertStudent));
        }
        res.status(200).json({
            message: 'User registered and role-based details inserted successfully',
            role: Role,
            code
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({ error: 'Registration failed' });
    }
});



//LOGIN  
router.post('/login', async (req, res) => {
    const { Username, Password, Role } = req.body;
    const query = `SELECT Id, Username, Email, Role FROM Register_Users 
                   WHERE Username='${Username}' AND Password='${Password}' AND Role='${Role}'`;

    try {
        await sql.connect(config);
        const result = await sql.query(query);
        const user = result.recordset[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.Id, username: user.Username, role: user.Role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );
        // Set JWT in cookie
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: false    
        });

        res.json({ message: 'Login Successful', token, user });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});


//LOGOUT
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    });
    res.json({ message: 'Logged out successfully' });
});


//VERIFY TOKEN
router.get('/me', (req, res) => {

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ userId: decoded.id, username: decoded.username, role: decoded.role });
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
});

//GET faculty profile by Id
router.get('/faculty/profile/:id', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Id', sql.Int, req.params.id)
      .query(`SELECT  FacultyCode,Username ,Email,PhoneNumber,Gender,DateOfBirth,Department,Qualification,ExperienceYears,DateOfJoining
      ,Address,ProfilePicture,Status FROM Faculty WHERE Id = @Id`);

    if (result.recordset.length === 0)
      return res.status(404).json({ error: 'Faculty not found' });

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Faculty profile fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//GET student profile by Id
router.get('/student/profile/:id', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('Id', sql.Int, req.params.id)
      .query(`SELECT StudentCode ,Username,Email,PhoneNumber,Gender,DateOfBirth,Department,
        Course,YearOfStudy,EnrollmentYear,RollNumber,Address ,ProfilePicture FROM Student WHERE Id = @Id`);
    if (result.recordset.length === 0)
      return res.status(404).json({ error: 'Student not found' });

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Student profile fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;