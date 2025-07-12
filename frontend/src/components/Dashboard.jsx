// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#0088FE', '#d0ed57', '#a4de6c'];

const Dashboard = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [applicationCount, setApplicationCount] = useState(0);
  const [activeStudentCount, setActiveStudentCount] = useState(0);
  const [activeFacultyCount, setActiveFacultyCount] = useState(0);
  
  // ✅ NEW - Department Chart Data
  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    fetchYears();
    fetchActiveStudents();
    fetchActiveFaculty();
    fetchStudentCountByDepartment(); // ✅
  }, []);

  const fetchYears = async () => {
    try {
      const res = await axios.get('http://localhost:5000/dashboard/summary/application-years');
      if (Array.isArray(res.data)) {
        setYears(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch years:', err);
    }
  };

  const fetchActiveStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/dashboard/summary/total-activestudents');
      setActiveStudentCount(res.data.TotalActiveStudents);
    } catch (err) {
      console.error('Error fetching active students:', err);
    }
  };

  const fetchActiveFaculty = async () => {
    try {
      const res = await axios.get('http://localhost:5000/dashboard/summary/total-activefaculty');
      setActiveFacultyCount(res.data.TotalActiveFaculty);
    } catch (err) {
      console.error('Error fetching active faculty:', err);
    }
  };

  const handleYearChange = async (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    try {
      const res = await axios.get(`http://localhost:5000/dashboard/summary/applications-by-year/${year}`);
      setApplicationCount(res.data.TotalApplications);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  // ✅ NEW FUNCTION
  const fetchStudentCountByDepartment = async () => {
    try {
      const res = await axios.get('http://localhost:5000/dashboard/summary/department-wise-count');
      setDepartmentData(res.data);
    } catch (err) {
      console.error('Error fetching department data:', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Active Students</h5>
              <p className="card-text fs-4">{activeStudentCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Active Faculty</h5>
              <p className="card-text fs-4">{activeFacultyCount}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5 className="card-title">Total Applications</h5>
              <p className="card-text fs-4">{selectedYear ? applicationCount : 'Select Year'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-group mt-4">
        <label htmlFor="yearSelect">Select Application Year:</label>
        <select
          id="yearSelect"
          className="form-control"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="">-- Select Year --</option>
          {years.map((y) => (
            <option key={y.ApplicationYear} value={y.ApplicationYear}>
              {y.ApplicationYear}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ DEPARTMENT PIE CHART SECTION */}
      <div className="mt-5">
        <h5 className="mb-4 text-center">📊 Student Count by Department</h5>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={departmentData}
              dataKey="Count"
              nameKey="Department"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
            >
              {departmentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
