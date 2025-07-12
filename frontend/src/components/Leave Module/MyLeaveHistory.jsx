import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyLeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchMyLeaves = async () => {
      try {
        const res = await axios.get('http://localhost:5000/leave/history', {
          withCredentials: true,
        });
        setLeaves(res.data);
      } catch (err) {
        console.error('Error fetching leave history', err);
      }
    };

    fetchMyLeaves();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Leave History</h2>
      {leaves.length === 0 ? (
        <p>No leave records found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Applied Date</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.LeaveID}>
                <td>{leave.LeaveType}</td>
                <td>{new Date(leave.FromDate).toLocaleDateString()}</td>
                <td>{new Date(leave.ToDate).toLocaleDateString()}</td>
                <td>{leave.Reason}</td>
                <td style={{ fontWeight: 'bold', color: leave.Status === 'Approved' ? 'green' : leave.Status === 'Rejected' ? 'red' : 'orange' }}>
                  {leave.Status}
                </td>
                <td>{new Date(leave.AppliedDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyLeaveHistory;
