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
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#F97316'  // Orange
];

const Dashboard = () => {
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [applicationCount, setApplicationCount] = useState(0);
  const [activeStudentCount, setActiveStudentCount] = useState(0);
  const [activeFacultyCount, setActiveFacultyCount] = useState(0);
  const [departmentData, setDepartmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('charts');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [yearsRes, studentsRes, facultyRes, deptRes] = await Promise.all([
          axios.get('http://localhost:5000/dashboard/summary/application-years'),
          axios.get('http://localhost:5000/dashboard/summary/total-activestudents'),
          axios.get('http://localhost:5000/dashboard/summary/total-activefaculty'),
          axios.get('http://localhost:5000/dashboard/summary/department-wise-count')
        ]);

        setYears(Array.isArray(yearsRes.data) ? yearsRes.data : []);
        setActiveStudentCount(studentsRes.data.TotalActiveStudents || 0);
        setActiveFacultyCount(facultyRes.data.TotalActiveFaculty || 0);

        const cleaned = deptRes.data.map(item => ({
          Department: item.Department,
          StudentCount: Number(item.StudentCount) || 0,
          FacultyCount: Number(item.FacultyCount) || 0
        }));
        setDepartmentData(cleaned);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = async (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    if (!year) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/dashboard/summary/applications-by-year/${year}`
      );
      setApplicationCount(res.data.TotalApplications || 0);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  // Updated card section only (rest of the component remains the same)
  const renderCards = () => (
    <div className="row g-4 mb-5">
      <div className="col-md-4">
        <div className="card border-0 shadow-lg h-100" style={{
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div className="card-body text-white p-4 position-relative">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-people-fill fs-1 text-white text-opacity-80"></i>
              </div>
              <div>
                <h5 className="card-title mb-1">Active Students</h5>
                <p className="card-text fs-2 fw-bold mb-0">{activeStudentCount}</p>
              </div>
            </div>
            <div className="position-absolute bottom-0 end-0 me-3 mb-2 opacity-25">
              <i className="bi bi-people-fill fs-1"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-0 shadow-lg h-100" style={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div className="card-body text-white p-4 position-relative">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-person-badge-fill fs-1 text-white text-opacity-80"></i>
              </div>
              <div>
                <h5 className="card-title mb-1">Active Faculty</h5>
                <p className="card-text fs-2 fw-bold mb-0">{activeFacultyCount}</p>
              </div>
            </div>
            <div className="position-absolute bottom-0 end-0 me-3 mb-2 opacity-25">
              <i className="bi bi-person-badge-fill fs-1"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-0 shadow-lg h-100" style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}>
          <div className="card-body text-white p-4 position-relative">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-files fs-1 text-white text-opacity-80"></i>
              </div>
              <div>
                <h5 className="card-title mb-1">Total Applications</h5>
                <p className="card-text fs-2 fw-bold mb-0">
                  {selectedYear ? applicationCount : 'Select Year'}
                </p>
              </div>
            </div>
            <div className="position-absolute bottom-0 end-0 me-3 mb-2 opacity-25">
              <i className="bi bi-files fs-1"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderCharts = () => (
    <div className="mt-4">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-3">
              <h5 className="mb-0 text-center fw-bold">
                <i className="bi bi-graph-up me-2 text-primary"></i>
                Active Students by Department
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    dataKey="StudentCount"
                    nameKey="Department"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    label={({ Department, percent }) =>
                      percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                    }
                    labelStyle={{ fontSize: '12px', fontWeight: 'bold', fill: 'white' }}
                    stroke="#fff"
                    strokeWidth={1}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`student-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'Students']}
                    contentStyle={{ borderRadius: '8px', border: 'none' }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: '13px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-3">
              <h5 className="mb-0 text-center fw-bold">
                <i className="bi bi-bar-chart-line me-2 text-success"></i>
                Active Faculty by Department
              </h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={departmentData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="Department" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: '#e2e8f0' }}
                    contentStyle={{ borderRadius: '8px', border: 'none' }}
                  />
                  <Bar
                    dataKey="FacultyCount"
                    name="Faculty"
                    radius={[4, 4, 0, 0]}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`faculty-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataTable = () => (
    <div className="card border-0 shadow-sm mt-4">
      <div className="card-header bg-white border-0 pt-3">
        <h5 className="mb-0 text-center fw-bold">
          <i className="bi bi-table me-2 text-info"></i>
          Department Statistics
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Department</th>
                <th className="text-end">Students</th>
                <th className="text-end">Faculty</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {departmentData.map((dept, index) => (
                <tr key={index}>
                  <td>
                    <span className="badge me-2" style={{
                      backgroundColor: COLORS[index % COLORS.length],
                      width: '12px',
                      height: '12px',
                      display: 'inline-block'
                    }}></span>
                    {dept.Department}
                  </td>
                  <td className="text-end">{dept.StudentCount}</td>
                  <td className="text-end">{dept.FacultyCount}</td>
                  <td className="text-end fw-bold">
                    {dept.StudentCount + dept.FacultyCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex justify-content-center">
          <div className="text-center">
            <h2 className="fw-bold mb-0">Admin Dashboard</h2>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <div className="me-3">
            <label htmlFor="yearSelect" className="form-label mb-0 text-muted">Application Year:</label>
          </div>
          <div style={{ width: '150px' }}>
            <select
              id="yearSelect"
              className="form-select shadow-sm"
              value={selectedYear}
              onChange={handleYearChange}
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y.ApplicationYear} value={y.ApplicationYear}>
                  {y.ApplicationYear}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {renderCards()}

      {isLoading ? (
        <div className="d-flex justify-content-center my-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <ul className="nav nav-tabs nav-fill mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'charts' ? 'active' : ''}`}
                onClick={() => setActiveTab('charts')}
              >
                <i className="bi bi-pie-chart me-2"></i>
                Visual Charts
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'table' ? 'active' : ''}`}
                onClick={() => setActiveTab('table')}
              >
                <i className="bi bi-table me-2"></i>
                Data Table
              </button>
            </li>
          </ul>

          {activeTab === 'charts' ? renderCharts() : renderDataTable()}
        </>
      )}

      <div className="mt-5 pt-3 border-top text-center text-muted small">
        <p className="mb-0">
          Data updated at: {new Date().toLocaleString()} |
          <span className="text-primary mx-2">Admin Portal v2.1</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;