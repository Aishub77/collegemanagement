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
  HouseDoorFill
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

  // Only show navigation menus for admin users
  const isAdmin = userData.role.toLowerCase() === 'admin';

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: '280px', minHeight: '100vh' }}>
      {/* University Logo/Title */}
      <div className="d-flex align-items-center justify-content-center mb-4 mt-2">
        <HouseDoorFill className="fs-3 me-2 text-primary" />
        <span className="fs-4 fw-bold text-white">College</span>
      </div>
      <hr className="border-light opacity-50" />

      {/* User Profile Section */}
      <div className="text-center mb-4">
        <div className="d-flex justify-content-center mb-3">
          <div className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center shadow"
            style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
            {userData.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <h5 className="mb-2 fw-normal">{userData.username}</h5>
        <span className={`badge rounded-pill ${getRoleBadgeClass()} px-3 py-1 fw-medium`} style={{ fontSize: '0.85rem' }}>
          {userData.role}
        </span>
      </div>
      <hr className="border-light opacity-50" />

      {/* Main Navigation - Only visible to admin */}
      {isAdmin && (
        <ul className="nav nav-pills flex-column mb-auto">
          {[
            {
              id: 'credentials',
              title: 'Manage Credentials',
              icon: <GearFill className="me-3 fs-5" />,
              items: [
                { path: '/register', label: 'Create Register', icon: <PersonPlusFill className="me-2" /> },    
                { path: '/profile', label: 'profile', icon: <PersonPlusFill className="me-2" /> },
                { path: '/Addclass', label: 'sectioncreation', icon: <PersonPlusFill className="me-2" /> }
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
                { path: '/admission', label: 'Admission Register', icon: <CardChecklist className="me-2 text-" /> },
                { path: '/Instruction', label: 'Application Handling', icon: <CardChecklist className="me-2 text-" /> }
              ]
            },
            {
              id: 'AppList',
              title: 'Application Details',
              icon: <CardChecklist className="me-3 fs-5"/>,
              items: [
                { path: '/Appdetails', label: 'Applied List', icon: <CardChecklist className="me-2" /> },
                { path: '/feedetails', label: 'Fee structure List', icon: <CardChecklist className="me-2" /> },
                { path: '/circular', label: 'circular', icon: <CardChecklist className="me-2" /> },
                { path: '/circularview', label: 'circularview', icon: <CardChecklist className="me-2" /> }
              ]
            }
          ].map((menu) => (
            <li className="nav-item mb-1" key={menu.id}>
              <button
                className={`nav-link text-white d-flex justify-content-between align-items-center w-100 ${openMenu === menu.id ? 'active bg-opacity-10' : ''
                  }`}
                onClick={() => toggleMenu(menu.id)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s'
                }}
              >
                <span className="d-flex align-items-center">
                  {menu.icon}
                  <span className="fs-6">{menu.title}</span>
                </span>
                {openMenu === menu.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {openMenu === menu.id && (
                <ul className="nav flex-column ps-4 mt-1" style={{ borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                  {menu.items.map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="nav-link text-white-50 d-flex align-items-center py-2 ps-3"
                        style={{
                          fontSize: '0.85rem',
                          borderRadius: '0.375rem',
                          transition: 'all 0.2s'
                        }}
                        activeClassName="active text-white bg-opacity-10" >
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

      <hr className="border-light opacity-50 mt-auto mb-3" />

      {/* Logout Section */}
      <div className="d-flex align-items-center justify-content-between px-2">
        <button
          className="btn btn-outline-light btn-sm d-flex align-items-center"
          onClick={handleLogout}
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '0.375rem'
          }}
        >
          <BoxArrowRight className="me-2" />
          <span>Sign Out</span>
        </button>
        <small className="text-muted">v1.0.0</small>
      </div>
    </div>
  );
};

export default Sidebar;