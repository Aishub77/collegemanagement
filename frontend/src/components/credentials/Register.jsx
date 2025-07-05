import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope, FaUserTag } from 'react-icons/fa';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    Email: '',
    Role: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/register/users', formData);
      setMessage(res.data.message || 'Registration successful!');
      setFormData({
        Username: '',
        Password: '',
        Email: '',
        Role: '',
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '450px', width: '100%', borderRadius: '20px' }}>
        <h3 className="text-center mb-4">Register Form</h3>

        {message && <div className="alert alert-success text-center">{message}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label">Username:</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input
                type="text"
                name="Username"
                className="form-control"
                placeholder="Enter username"
                value={formData.Username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password:</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                name="Password"
                className="form-control"
                placeholder="Enter password"
                value={formData.Password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                name="Email"
                className="form-control"
                placeholder="Enter email"
                value={formData.Email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="form-label">Role:</label>
            <div className="input-group">
              <span className="input-group-text"><FaUserTag /></span>
              <select
                name="Role"
                className="form-select"
                value={formData.Role}
                onChange={handleChange}
                required
              >
                <option value="">Select a Role</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
