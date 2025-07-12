// components/StudentLeaveRequests.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentLeaveRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchStudentLeaves = async () => {
      try {
        const res = await axios.get('http://localhost:5000/leave/student-requests', {
          withCredentials: true,
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching student leave requests', err);
      }
    };

    fetchStudentLeaves();
  }, []);

  const updateStatus = async (leaveId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/leave/status/${leaveId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setRequests((prev) =>
        prev.map((req) =>
          req.LeaveID === leaveId ? { ...req, Status: newStatus } : req
        )
      );
    } catch (err) {
      alert('Error updating status: ' + err.response?.data?.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Leave Requests (Faculty View)</h2>
      {requests.length === 0 ? (
        <p>No student leave requests found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((leave) => (
              <tr key={leave.LeaveID}>
                <td>{leave.ApplicantName}</td>
                <td>{leave.LeaveType}</td>
                <td>{new Date(leave.FromDate).toLocaleDateString()}</td>
                <td>{new Date(leave.ToDate).toLocaleDateString()}</td>
                <td>{leave.Reason}</td>
                <td style={{ fontWeight: 'bold' }}>{leave.Status}</td>
                <td>{new Date(leave.AppliedDate).toLocaleDateString()}</td>
                <td>
                  {leave.Status === 'Pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(leave.LeaveID, 'Approved')}
                        style={{ marginRight: 5, color: 'green' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(leave.LeaveID, 'Rejected')}
                        style={{ color: 'red' }}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentLeaveRequests;
