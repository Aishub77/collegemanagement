import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../assest/whitelogo.png';
import { useNavigate } from 'react-router-dom';

const FacultyHomepage = () => {
  const [username, setUsername] = useState('');
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
    { name: 'Profile', icon: '👤', path: '/profile' },
    {
      name: 'Circular',
      icon: '📢',
      subModules: [
        { name: 'View', path: '/circularview' },
        { name: 'Form', path: '/circular' }
      ]
    },
    { name: 'Attendance', icon: '📅', path: '/attendance' },
    { name: 'Leave Request', icon: '📝', path: '/leave-request' },
    { name: 'Timetable', icon: '📚', path: '/timetable' },
    { name: 'Exam Reports', icon: '📈', path: '/exam-reports' }
  ];

  return (
    <div>
      {/* Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'whitesmoke',
        padding: 0,
        color: 'black',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="College Logo"
            style={{ height: '150px', width: '160px' }}
          />
          <h3 style={{
            margin: 0,
            fontFamily: '"Georgia", serif',
            fontWeight: 'bold',
            fontSize: '1.6rem'
          }}>
            <span style={{ fontSize: '2rem' }}>C</span>rownRidge Arts & Science College
          </h3>
        </div>
      </nav>

      {/* Welcome Message */}
      <div style={{ textAlign: 'left', marginTop: '40px', padding: '0 30px' }}>
        <h3 style={{
          fontSize: '1.6rem',
          fontWeight: 'bold',
          color: '#333',
          fontFamily: 'Arial, sans-serif'
        }}>
          👋 Welcome, {username}
        </h3>
      </div>

      {/* Modules Section */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '50px',
        padding: '0 20px',
        gap: '20px'
      }}>
        {modules.map((mod, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <div
              style={{
                flex: '1 1 200px',
                maxWidth: '220px',
                backgroundColor: '#f5f5f5',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: mod.path ? 'pointer' : 'default',
                transition: 'transform 0.2s',
              }}
              onClick={() => {
                if (mod.path) {
                  navigate(mod.path);
                }
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ fontSize: '2rem' }}>{mod.icon}</div>
              <div style={{
                marginTop: '10px',
                fontWeight: '600',
                fontSize: '1.1rem',
                color: '#333'
              }}>
                {mod.name}
              </div>
            </div>

            {/* Sub Modules (for Circular) */}
            {mod.subModules && (
              <div style={{ marginTop: '10px' }}>
                {mod.subModules.map((sub, subIndex) => (
                  <div
                    key={subIndex}
                    style={{
                      marginTop: '6px',
                      background: '#e0e0e0',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'background 0.2s',
                    }}
                    onClick={() => navigate(sub.path)}
                    onMouseEnter={e => e.currentTarget.style.background = '#d1d1d1'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e0e0e0'}
                  >
                    ➤ {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyHomepage;
