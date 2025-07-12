import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../assest/whitelogo.png';
import { useNavigate } from 'react-router-dom';

const StudentHomepage = () => {
  const [username, setUsername] = useState('');
  const [activeModule, setActiveModule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/register/me', {
          withCredentials: true,
        });
        setUsername(res.data.username);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUsername('Guest');
      }
    };
    fetchUser();
  }, []);

  const modules = [
    {
      name: 'Circular',
      icon: '📢',
      subModules: [
        { name: 'View Circulars', path: '/circularview' }
      ]
    },
    { 
      name: 'Leave', 
      icon: '📝', 
      subModules: [
        { name: 'Request Leave', path: '/leaveform' },
        { name: 'Leave History', path: '/leavehistory' }
      ]
    }
  ];

  const toggleSubModules = (index) => {
    if (activeModule === index) {
      setActiveModule(null);
    } else {
      setActiveModule(index);
    }
  };

  return (
    <div style={{ 
      fontFamily: "'Poppins', 'Segoe UI', sans-serif", 
      backgroundColor: '#f5f7fa', 
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)'
    }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #002147 0%, #004a7c 100%)',
        padding: '0 30px',
        color: '#fff',
        height: '75px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="College Logo" style={{ 
            height: '50px', 
            marginRight: '15px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }} />
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}>
            CrownRidge Arts & Science College
          </h2>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '6px 15px',
            borderRadius: '20px',
            fontWeight: 500
          }}>
            Welcome, <span style={{ fontWeight: 600 }}>{username}</span>
          </div>
          <button style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '8px 20px',
            borderRadius: '20px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            ':hover': {
              background: 'rgba(255,255,255,0.3)'
            }
          }} onClick={() => navigate('/profile')}>
            My Profile
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Welcome Section */}
        <div style={{ 
          textAlign: 'center', 
          margin: '40px 0 60px',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, #4361ee, #3a0ca3)',
            borderRadius: '2px'
          }}></div>
          <h1 style={{ 
            color: '#2d3748', 
            fontSize: '2.2rem',
            fontWeight: 600,
            marginBottom: '10px'
          }}>
            Student Portal
          </h1>
          <p style={{ 
            color: '#718096', 
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Access your academic information and college services
          </p>
        </div>

        {/* Modules Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '30px',
          padding: '0 10px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {modules.map((mod, index) => (
            <div key={index} style={{ 
              position: 'relative',
              perspective: '1000px'
            }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
                  cursor: mod.path ? 'pointer' : 'default',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  padding: '30px 25px',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid #edf2f7',
                  ':hover': {
                    transform: mod.path ? 'translateY(-10px)' : 'none',
                    boxShadow: mod.path ? '0 12px 25px rgba(0,0,0,0.1)' : '0 8px 20px rgba(0,0,0,0.05)'
                  }
                }}
                onClick={() => mod.path ? navigate(mod.path) : toggleSubModules(index)}
              >
                {/* Module Icon */}
                <div style={{ 
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '28px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(67, 97, 238, 0.3)'
                }}>
                  {mod.icon}
                </div>
                
                {/* Module Name */}
                <div style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '1.2rem',
                  color: '#2d3748',
                  marginBottom: mod.subModules ? '15px' : '0'
                }}>
                  {mod.name}
                </div>
                
                {/* Sub Module Indicator */}
                {mod.subModules && (
                  <div style={{
                    textAlign: 'center',
                    marginTop: '15px',
                    color: '#4a5568',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}>
                    {mod.subModules.length} options
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9L12 16L5 9" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                
                {/* Floating Corner */}
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(58, 12, 163, 0.1) 100%)',
                  borderRadius: '0 0 0 100%',
                  transform: 'rotate(180deg)'
                }}></div>
              </div>

              {/* Sub Modules - Animated Dropdown */}
              {mod.subModules && activeModule === index && (
                <div style={{
                  marginTop: '15px',
                  background: 'white',
                  borderRadius: '14px',
                  padding: '20px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                  animation: 'slideDown 0.4s ease-out',
                  border: '1px solid #e2e8f0'
                }}>
                  {mod.subModules.map((sub, subIndex) => (
                    <div
                      key={subIndex}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        fontSize: '0.95rem',
                        color: '#4a5568',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: subIndex === mod.subModules.length - 1 ? '0' : '10px',
                        background: '#f8fafc',
                        ':hover': {
                          background: '#edf2f7',
                          color: '#4361ee'
                        }
                      }}
                      onClick={() => navigate(sub.path)}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(58, 12, 163, 0.1) 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px'
                      }}>
                        {subIndex + 1}
                      </div>
                      <span>{sub.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '30px 0',
        marginTop: '70px',
        color: '#718096',
        fontSize: '0.9rem',
        borderTop: '1px solid #e2e8f0',
        background: 'rgba(255,255,255,0.7)'
      }}>
        © {new Date().getFullYear()} CrownRidge Arts & Science College. All rights reserved.
      </div>
      
      {/* Inline CSS for animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default StudentHomepage;