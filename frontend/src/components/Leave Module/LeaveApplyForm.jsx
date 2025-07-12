import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaveApplyForm = () => {
  const [userInfo, setUserInfo] = useState({});
  const [leaveType, setLeaveType] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState({});
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Calculate date ranges
    const today = new Date();
    const firstDayCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    
    // Format dates to YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];
    
    setMinDate(formatDate(firstDayCurrentMonth));
    setMaxDate(formatDate(lastDayNextMonth));

    // Fetch user details
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/register/me', { withCredentials: true });
        setUserInfo(res.data);
      } catch (err) {
        console.error('Not logged in', err);
      }
    };
    fetchUser();
  }, []);

  const validateDates = () => {
    const newErrors = {};
    
    if (!fromDate) {
      newErrors.fromDate = 'From Date is required';
    } else if (new Date(fromDate) > new Date(toDate)) {
      newErrors.dates = 'To Date cannot be before From Date';
    }
    
    if (!toDate) newErrors.toDate = 'To Date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDates()) return;
    
    setIsSubmitting(true);
    
    try {
      await axios.post('http://localhost:5000/leave/apply', {
        leaveType,
        fromDate,
        toDate,
        reason
      }, { withCredentials: true });

      alert('Leave request submitted successfully!');
      // Reset form
      setLeaveType('');
      setFromDate('');
      setToDate('');
      setReason('');
    } catch (err) {
      alert('Error submitting leave: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold" style={{ color: '#2c3e50' }}>Leave Application</h1>
        <p className="lead" style={{ color: '#7f8c8d' }}>Submit your leave request for approval</p>
      </div>
      
      <div className="card border-0 shadow-lg overflow-hidden">
        <div 
          className="card-header py-4 text-white" 
          style={{ 
            background: 'linear-gradient(120deg, #3498db, #2c3e50)',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <h2 className="h4 mb-0 fw-bold">Apply for Leave</h2>
        </div>
        
        <div className="card-body p-4">
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            <div className="mb-4">
              <label className="form-label fw-bold mb-2" style={{ color: '#2c3e50' }}>Applicant Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-person-fill text-primary"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control bg-light border-start-0" 
                  value={userInfo.username || ''} 
                  readOnly 
                  style={{ borderLeft: 'none' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold mb-2" style={{ color: '#2c3e50' }}>Leave Type</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-calendar-event text-primary"></i>
                </span>
                <select 
                  className={`form-select ${errors.leaveType ? 'is-invalid' : ''}`}
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                  style={{ borderLeft: 'none' }}
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Vacation">Casual Leave</option>
                  <option value="Personal">Personal</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Other">Other</option>
                </select>
                {errors.leaveType && 
                  <div className="invalid-feedback">{errors.leaveType}</div>}
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label fw-bold mb-2" style={{ color: '#2c3e50' }}>From Date</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-calendar-date text-primary"></i>
                  </span>
                  <input 
                    type="date" 
                    className={`form-control ${errors.fromDate || errors.dates ? 'is-invalid' : ''}`}
                    value={fromDate}
                    min={minDate}
                    max={maxDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                    style={{ borderLeft: 'none' }}
                  />
                  {errors.fromDate && 
                    <div className="invalid-feedback">{errors.fromDate}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold mb-2" style={{ color: '#2c3e50' }}>To Date</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <i className="bi bi-calendar-date text-primary"></i>
                  </span>
                  <input 
                    type="date" 
                    className={`form-control ${errors.toDate || errors.dates ? 'is-invalid' : ''}`}
                    value={toDate}
                    min={fromDate || minDate}
                    max={maxDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                    style={{ borderLeft: 'none' }}
                  />
                  {errors.toDate && 
                    <div className="invalid-feedback">{errors.toDate}</div>}
                </div>
              </div>
              
              {errors.dates && 
                <div className="text-danger small mt-2">{errors.dates}</div>}
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold mb-2" style={{ color: '#2c3e50' }}>Reason</label>
              <div className="input-group">
                <span className="input-group-text bg-light align-items-start pt-2">
                  <i className="bi bi-chat-left-text text-primary"></i>
                </span>
                <textarea 
                  rows={4}
                  className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Please provide details for your leave request..."
                  style={{ borderLeft: 'none' }}
                />
                {errors.reason && 
                  <div className="invalid-feedback">{errors.reason}</div>}
              </div>
            </div>

            <div className="d-grid mt-5">
              <button 
                type="submit" 
                className="btn btn-lg fw-bold text-white"
                disabled={isSubmitting}
                style={{
                  background: 'linear-gradient(120deg, #3498db, #2c3e50)',
                  border: 'none',
                  padding: '12px',
                  transition: 'all 0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => e.target.style.background = 'linear-gradient(120deg, #2c3e50, #3498db)'}
                onMouseOut={(e) => e.target.style.background = 'linear-gradient(120deg, #3498db, #2c3e50)'}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Leave Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-4 text-center text-muted small">
        <p>Leave requests must be submitted at least 24 hours in advance. 
          For urgent requests, please contact Admin directly.</p>
      </div>
    </div>
  );
};

export default LeaveApplyForm;