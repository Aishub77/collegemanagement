// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [applicationCount, setApplicationCount] = useState(0);
  const [activeStudentCount, setActiveStudentCount] = useState(0);
  const [activeFacultyCount, setActiveFacultyCount] = useState(0);

  useEffect(() => {
    fetchYears();
    fetchActiveStudents();
    fetchActiveFaculty();
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
    </div>
  );
};

export default Dashboard;
