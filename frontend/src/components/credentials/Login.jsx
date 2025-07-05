import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaUserTag, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginpending } from '../../Redux/Loginslice';
import '../../css/Login.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    Role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/register/login', formData, {
        withCredentials: true,
      });

      const userRole = formData.Role.toLowerCase();
      localStorage.setItem('userRole', userRole);
      
      setIsLoading(false);
      
      if (userRole === 'admin') {
        navigate('/faculty');
      } else if (userRole === 'faculty') {
        navigate('/facultyhomepage');
      } else if (userRole === 'student') {
        navigate('/faculty');
      } else {
        setError('Invalid role detected');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(loginpending());
  }, [dispatch]);

  return (
    <div className="login-container">
      <div className="login-header">
        <div className="college-logo1">
          <div className="crown-icon">👑</div>
          <div className="college-name">
            <h1>CrownRidge</h1>
            <p>Arts & Science College</p>
          </div>
        </div>
        <div className="college-motto">
          <p>Empowering Minds, Enriching Futures</p>
        </div>
      </div>
      
      <div className="login-card">
        <div className="login-illustration">
          <div className="gradient-circle"></div>
          <div className="academic-icon">🎓</div>
          <div className="book-icon">📚</div>
        </div>
        
        <div className="login-form-container">
          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Sign in to continue to your account</p>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                type="text"
                name="Username"
                placeholder="Username"
                value={formData.Username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="Password"
                placeholder="Password"
                value={formData.Password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <div className="input-group">
              <FaUserTag className="input-icon" />
              <select
                name="Role"
                value={formData.Role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                'Login'
              )}
            </button>
          </form>
          
          <div className="signup-link">
            <p>Don't have an account? <a href="#">Sign Up</a></p>
          </div>
        </div>
      </div>
      
      <div className="login-footer">
        <p>© 2023 CrownRidge Arts & Science College. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;