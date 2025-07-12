import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const RequireRole = ({ allowedRoles, children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get('http://localhost:5000/register/me', {
          withCredentials: true,
        });
        setUserRole(res.data.role); // set user role like 'Admin' | 'Faculty' | 'Student'
      } catch (err) {
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return <div>Loading...</div>;

  return allowedRoles.includes(userRole) ? children : <Navigate to="/unauthorized" />;
};

export default RequireRole;
