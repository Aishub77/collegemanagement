import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminFeeSearch = () => {
  const [studentCode, setStudentCode] = useState('');
  const [feeDetails, setFeeDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const code = studentCode.trim().toUpperCase();

    if (!/^STU\d{8}$/.test(code)) {
      toast.warning("Invalid student code format. Example: STU20250001");
      return;
    }

    setLoading(true);
    setFeeDetails(null);

    try {
      const res = await axios.get(`http://localhost:5000/admin/student/${code}/fee-details`);
      setFeeDetails(res.data);
      toast.success("Fee details fetched successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch fee details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>🔍 Admin - Search Student Fee Details</h3>

      <div className="input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Student Code"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {feeDetails && (
        <div className="card p-4">
          <h5>🎓 Student Info</h5>
          <p><strong>Student Code:</strong> {feeDetails.StudentCode}</p>
          <p><strong>Name:</strong> {feeDetails.StudentName}</p>
          <p><strong>Year of Study:</strong> {feeDetails.YearOfStudy}</p>
          <p><strong>Fee Structure Code:</strong> {feeDetails.FeeStructureCode}</p>
          <p><strong>Total Annual Fee:</strong> ₹{feeDetails.TotalAnnualFee}</p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminFeeSearch;
