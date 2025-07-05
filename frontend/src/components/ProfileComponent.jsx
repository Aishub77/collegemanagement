import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProfileComponent = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/register/me', { withCredentials: true });
        setUser({ id: res.data.userId, username: res.data.username, role: res.data.role });
      } catch (err) {
        console.error('User not logged in');
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.id) return;
      
      try {
        const url = user.role === 'Faculty'
          ? `http://localhost:5000/register/faculty/profile/${user.id}`
          : `http://localhost:5000/register/student/profile/${user.id}`;
          
        const res = await axios.get(url);
        setProfile(res.data);
      } catch (err) {
        console.error('Profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const exportToPDF = () => {
    const input = pdfRef.current;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    html2canvas(input, { 
      scale: 2, 
      useCORS: true,
      logging: false,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      position -= pdf.internal.pageSize.getHeight();
      
      // Add additional pages if needed
      while (position > -imgHeight) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        position -= pdf.internal.pageSize.getHeight();
      }  
      pdf.save(`${user?.username || 'profile'}_${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center my-5">Profile not available</div>;

  // Format keys for display
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  // Format date values to show only date part
  const formatValue = (key, value) => {
    if (!value) return '-';
    
    // Handle date fields (case-insensitive)
    if (key.toLowerCase().includes('date') || key.toLowerCase().includes('dob')) {
      try {
        return new Date(value).toISOString().split('T')[0];
      } catch (e) {
        return value;
      }
    }
    
    return value;
  };

  return (
    <div className="container my-5" ref={pdfRef}>
      <div className="card border-0 shadow-lg overflow-hidden">
        <div 
          className="card-header text-white py-4" 
          style={{ 
            background: 'linear-gradient(135deg, #3a7bd5, #00d2ff)'
          }}
        >
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0">
              {profile.ProfilePicture ? (
                <img 
                  src={`http://localhost:5000/${profile.ProfilePicture}`}
                  alt="Profile"
                  className="rounded-circle border border-3 border-white"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="bg-light rounded-circle d-flex justify-content-center align-items-center border border-3 border-white" 
                  style={{ width: '100px', height: '100px' }}>
                  <i className="fas fa-user text-muted fs-1"></i>
                </div>
              )}
            </div>
            <div className="flex-grow-1 ms-4">
              <h2 className="mb-0">{profile.Name || profile.Username || 'My Profile'}</h2>
              {/* <p className="mb-0 opacity-75">{user.role} Account</p> */}
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="row g-0">
            <div className="col-lg-4 bg-light p-4 border-end">
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                  <i className="fas fa-id-card text-primary fs-4"></i>
                </div>
                <h5 className="mb-0">Personal Information</h5>
              </div>
              
              <ul className="list-unstyled">
                {Object.entries(profile)
                  .filter(([key]) => !['ProfilePicture', 'Address', 'Bio', 'ResearchInterests', 'Courses'].includes(key))
                  .slice(0, 4)
                  .map(([key, value]) => (
                    <li key={key} className="mb-3">
                      <small className="text-uppercase text-muted d-block">{formatKey(key)}</small>
                      <span className="d-block fw-medium">{formatValue(key, value)}</span>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="col-lg-8 p-4">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h5 className="d-flex align-items-center mb-3">
                    <i className="fas fa-info-circle me-2 text-primary"></i> Details
                  </h5>
                  <div className="list-group list-group-flush">
                    {profile.Address && (
                      <div className="list-group-item border-0 px-0 py-2">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Address</span>
                          <span className="fw-medium">{profile.Address}</span>
                        </div>
                      </div>
                    )}
                    
                    {Object.entries(profile)
                      .filter(([key]) => ![
                        'ProfilePicture', 
                        'Name', 
                        'Email', 
                        'Phone', 
                        'Address', 
                        'Bio', 
                        'ResearchInterests', 
                        'Courses',
                        'Username',
                        'FacultyCode'
                      ].includes(key))
                      .map(([key, value]) => (
                        <div key={key} className="list-group-item border-0 px-0 py-2">
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">{formatKey(key)}</span>
                            <span className="fw-medium">{formatValue(key, value)}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="col-md-6">
                  {(profile.ResearchInterests || profile.Courses) && (
                    <div>
                      <h5 className="d-flex align-items-center mb-3">
                        <i className="fas fa-flask me-2 text-primary"></i> Specialization
                      </h5>
                      {profile.ResearchInterests && (
                        <div className="mb-2">
                          <small className="text-muted d-block">Research Interests</small>
                          <span>{profile.ResearchInterests}</span>
                        </div>
                      )}
                      {profile.Courses && (
                        <div>
                          <small className="text-muted d-block">Courses</small>
                          <span>{profile.Courses}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-light py-3">
          <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={exportToPDF}>
              <i className="fas fa-download me-1"></i> Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;




