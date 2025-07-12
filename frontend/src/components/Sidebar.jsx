import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  PersonFill,
  PeopleFill,
  JournalBookmark,
  PersonPlusFill,
  CardChecklist,
  GearFill,
  ChevronDown,
  ChevronUp,
  BoxArrowRight,
} from 'react-bootstrap-icons';

const Sidebar = () => {
  const [userData, setUserData] = useState({ username: '', role: '' });
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/register/me', { withCredentials: true })
      .then((res) => {
        setUserData({
          username: res.data.username,
          role: res.data.role,
        });
      })
      .catch((err) => {
        console.error('User not authenticated:', err);
        navigate('/');
      });
  }, [navigate]);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLogout = () => {
    axios.post('http://localhost:5000/register/logout', {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem('userRole');
        navigate('/');
      })
      .catch(err => {
        console.error('Logout failed:', err);
      });
  };

  const getRoleBadgeClass = () => {
    switch (userData.role.toLowerCase()) {
      case 'admin': return 'bg-danger';
      case 'faculty': return 'bg-primary';
      case 'staff': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  };

  const isAdmin = userData.role.toLowerCase() === 'admin';

  return (
    <div
      className="d-flex flex-column flex-shrink-0 text-white shadow"
      style={{
        width: '280px',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1f1c2c, #928dab)',
        padding: '1.5rem 1rem',
        borderTopRightRadius: '1rem',
        borderBottomRightRadius: '1rem'
      }}
    >
      <div className="text-center mb-4">
        <h4 className="fw-bold mb-0" style={{ letterSpacing: '0.5px' }}>
          CrownRidge Arts & Science
        </h4>
      </div>

      <div className="text-center mb-4">
        <div
          className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center shadow"
          style={{
            width: '80px',
            height: '80px',
            fontSize: '2rem',
            margin: '0 auto'
          }}
        >
          {userData.username.charAt(0).toUpperCase()}
        </div>
        <h6 className="mt-3 mb-1 text-capitalize">{userData.username}</h6>
        <span
          className={`badge rounded-pill ${getRoleBadgeClass()} px-3 py-1`}
          style={{ fontSize: '0.8rem' }}
        >
          {userData.role}
        </span>
      </div>

      {isAdmin && (
        <ul className="nav flex-column mb-auto">
          {[
            {
              id: 'credentials',
              title: 'Manage Credentials',
              icon: <GearFill className="me-3 fs-5" />,
              items: [
                { path: '/register', label: 'Create Register', icon: <PersonPlusFill className="me-2" /> },
                { path: '/profile', label: 'Profile', icon: <PersonPlusFill className="me-2" /> },
                { path: '/Addclass', label: 'Section Creation', icon: <PersonPlusFill className="me-2" /> }
              ]
            },
            {
              id: 'faculty',
              title: 'Manage Faculty',
              icon: <PersonFill className="me-3 fs-5" />,
              items: [
                { path: '/faculty', label: 'Faculty Details', icon: <PeopleFill className="me-2" /> },
                { path: '/homeadmin', label: 'Home', icon: <PeopleFill className="me-2" /> }
              ]
            },
            {
              id: 'students',
              title: 'Manage Students',
              icon: <PeopleFill className="me-3 fs-5" />,
              items: [
                { path: '/student', label: 'Student Details', icon: <PersonFill className="me-2" /> }
              ]
            },
            {
              id: 'courses',
              title: 'Manage Courses',
              icon: <JournalBookmark className="me-3 fs-5" />,
              items: [
                { path: '/degree', label: 'Create & Manage Courses', icon: <JournalBookmark className="me-2" /> }
              ]
            },
            {
              id: 'enrollment',
              title: 'Enrollment & Onboarding',
              icon: <CardChecklist className="me-3 fs-5" />,
              items: [
                { path: '/admission', label: 'Admission Register', icon: <CardChecklist className="me-2" /> },
                { path: '/Instruction', label: 'Application Handling', icon: <CardChecklist className="me-2" /> }
              ]
            },
            {
              id: 'AppList',
              title: 'Application Details',
              icon: <CardChecklist className="me-3 fs-5" />,
              items: [
                { path: '/Appdetails', label: 'Applied List', icon: <CardChecklist className="me-2" /> },
                { path: '/feedetails', label: 'Fee Structure List', icon: <CardChecklist className="me-2" /> },
                { path: '/circular', label: 'Circular', icon: <CardChecklist className="me-2" /> },
                { path: '/circularview', label: 'Circular View', icon: <CardChecklist className="me-2" /> }
              ]
            }
          ].map((menu) => (
            <li key={menu.id} className="mb-1">
              <button
                className={`nav-link text-white d-flex justify-content-between align-items-center w-100 ${openMenu === menu.id ? 'bg-white bg-opacity-10' : 'bg-transparent'
                  }`}
                onClick={() => toggleMenu(menu.id)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
              >
                <span className="d-flex align-items-center">
                  {menu.icon}
                  {menu.title}
                </span>
                {openMenu === menu.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openMenu === menu.id && (
                <ul className="nav flex-column ps-4 mt-1">
                  {menu.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="nav-link text-white d-flex align-items-center py-2 ps-3"
                        style={{
                          fontSize: '0.85rem',
                          borderRadius: '0.375rem',
                          transition: 'all 0.2s',
                          fontWeight: '400'
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-3 d-flex align-items-center justify-content-between">
        <button
          className="btn btn-outline-light btn-sm d-flex align-items-center"
          onClick={handleLogout}
          style={{
            padding: '0.4rem 0.75rem',
            borderRadius: '0.375rem',
            fontWeight: '500',
            fontSize: '0.85rem'
          }}
        >
          <BoxArrowRight className="me-2" />
          Sign Out
        </button>
        <small className="text-white-50">v1.0.0</small>
      </div>
    </div>
  );
};

export default Sidebar;
