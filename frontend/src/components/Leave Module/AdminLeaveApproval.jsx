import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminLeaveApproval = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await axios.get('http://localhost:5000/leave/all', {
          withCredentials: true,
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Error loading leave requests', err);
      }
    };

    fetchAll();
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
      alert('Failed to update status: ' + err.response?.data?.error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Leave Requests (Admin View)</h2>
      {requests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
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
                <td>{leave.ApplicantRole}</td>
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

export default AdminLeaveApproval;
