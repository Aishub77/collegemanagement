const express = require('express');
const cors = require('cors');
const registerRoute = require('./routes/register');
const facultyRoutes = require('./routes/faculty');
const degreeRoutes = require('./routes/degreeRoutes');
const FieldsRoutes = require('./routes/fieldRoutes');
const studentRoutes = require('./routes/Student');
const AdmissionRoutes = require('./routes/ApplicationRoutes');
const feeRoutes=require('./routes/Feestructure');
const dashboard=require('./routes/Dashboard');
const Applicant=require('./routes/Appregister');
const circular=require('./routes/circulars')
const path=require('path');
const fs = require('fs');
const allocation=require('./routes/FacultyAllocation')
const marquee=require('./routes/Marquee')
const homeRoute=require('./routes/home')



const cookieParser = require('cookie-parser');
const app = express();
const port = 5000;
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));




const circularFolder = path.join(__dirname, 'uploads/circulars');
if (!fs.existsSync(circularFolder)) {
  fs.mkdirSync(circularFolder, { recursive: true });
  console.log('✅ Created uploads/circulars folder');
}


app.use('/uploads', express.static('uploads'));
app.use('/uploads/circulars', express.static(path.join(__dirname, 'uploads/circulars')));

// API routes

// Routes
app.use('/register', registerRoute);
app.use('/faculty', facultyRoutes);
app.use('/degree', degreeRoutes);
app.use('/Field', FieldsRoutes);
app.use('/student', studentRoutes);
app.use('/applist', AdmissionRoutes);
app.use('/fee',feeRoutes);
app.use('/dashboard',dashboard);
app.use('/applicantregister',Applicant);
app.use('/circular',circular);
app.use('/allocation',allocation);
app.use('/marquee',marquee)
app.use('/home',homeRoute)


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
