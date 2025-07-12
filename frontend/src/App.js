import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FacultyList from './components/Faculty/FacultyList';
import FacultyEdit from "./components/Faculty/FacultyEdit";
import LoginPage from './components/Credentials/Login';
import Register from './components/Credentials/Register';
import Degree from './components/DegreeFieldManager';
import Sidebar from './components/Sidebar';
import Studentview from './components/Student Module/Studentview';
import StudentEdit from './components/Student Module/StudentEdit';
import ApplicationForm from './components/Admission/ApplicationForm';
import AppList from '../src/components/Admission/AppList'
import FeeStructureManager from './components/FeeStructureManager';
import Dashboard from './components/Dashboard';
import AdmissionRegister from '../src/components/Admission/AdmisssionRegister';
import AdminCircularForm from './components/Circular/AdminCircularForm';
import MyCirculars from './components/Circular/MyCirculars';
import InstructionsSection from '../src/components/Admission/InstructionsSection';
import Facultyhomepage from './components/Faculty/Facultyhomepage';
import ProfileComponent from './components/ProfileComponent';
import AddSectionForm from './components/AddSectionForm';
import Navbar from './Website/Navbar';
import AdminHomeEdit from './Website/AdminHomeEdit';
import FeeComponentManager from './components/FeeComponentManager';
import AdminFeeSearch from './components/AdminFeeSearch';
import Course from './components/Course';
import Footer from '../src/Website/Footer';
import StudentHomepage from './components/Student Module/StudentHomepage';
import LeaveApplyForm from './components/Leave Module/LeaveApplyForm';
import MyLeaveHistory from './components/Leave Module/MyLeaveHistory';
import AdminLeaveApproval from './components/Leave Module/AdminLeaveApproval';
import StudentLeaveRequests from './components/Leave Module/StudentLeaveRequests';
import RequireRole from './components/Leave Module/RequireRole';
import VisionMission from './Website/VisionMission';
import PlacementStats from './Website/PlacementStats';



// Layout component that shows Sidebar and renders nested routes
const ProtectedLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Navbar />} />


        {/* Protected routes with sidebar */}
        <Route
          path="/*"
          element={
            <ProtectedLayout>
              <Routes>
                <Route path="faculty" element={<FacultyList />} />
                <Route path="edit/:facultyCode" element={<FacultyEdit />} />
                <Route path="degree" element={<Degree />} />
                <Route path="student" element={<Studentview />} />
                <Route path="studentedit/:studentCode" element={<StudentEdit />} />
                <Route path="application" element={<ApplicationForm />} />
                <Route path="Appdetails" element={<AppList />} />
                <Route path="feedetails" element={<FeeStructureManager />} />
                <Route path="dashboard" element={<Dashboard />} />

                <Route path="circular" element={<AdminCircularForm />} />
                <Route path="circularview" element={<MyCirculars />} />
                <Route path="Instruction" element={<InstructionsSection />} />
                <Route path="facultyhomepage" element={<Facultyhomepage />} />
                <Route path="profile" element={<ProfileComponent />} />
                <Route path="Addclass" element={<AddSectionForm />} />
                <Route path="homeadmin" element={<AdminHomeEdit />} />
                <Route path="FeeComponent" element={<FeeComponentManager />} />
                <Route path="adminfeecontrol" element={<AdminFeeSearch />} />
                <Route path="studenthomepage" element={<StudentHomepage />} />
                {/* //Leave Module Access based on Role  */}
                <Route path="leaveform"
                  element={
                    <RequireRole allowedRoles={['Student', 'Faculty']}>
                      <LeaveApplyForm />
                    </RequireRole>
                  }
                />
                <Route
                  path="leavehistory"
                  element={
                    <RequireRole allowedRoles={['Student', 'Faculty']}>
                      <MyLeaveHistory />
                    </RequireRole>
                  }
                />
                <Route
                  path="leaveapproval"
                  element={
                    <RequireRole allowedRoles={['admin']}>
                      <AdminLeaveApproval/>
                    </RequireRole>
                  }
                />
                <Route
                  path="facultyrequests"
                  element={
                    <RequireRole allowedRoles={['Faculty']}>
                      <StudentLeaveRequests/>
                    </RequireRole>
                  }
                />

                {/* Redirect default protected path */}
                <Route path="*" element={<Navigate to="faculty" replace />} />
              </Routes>
            </ProtectedLayout>
          }
        />
        <Route path="course" element={<Course />} />
        <Route path="footer" element={<Footer />} />
        <Route path="About" element={<VisionMission />} />
        <Route path="placement" element={<PlacementStats />} />
        <Route path="admission" element={<AdmissionRegister />} />
        {/* Redirect root to login */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
        <Route path="/" element={<Navigate to="/Home" replace />} />
      </Routes>
    </Router>

  );
}

export default App;
