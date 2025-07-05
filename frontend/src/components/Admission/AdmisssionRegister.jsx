import React, { useState } from 'react';
import axios from 'axios';
import { 
  Button, 
  Form, 
  ToggleButtonGroup, 
  ToggleButton, 
  Card, 
  Container,
  Alert,
  FloatingLabel,
  Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdmissionRegister = () => {
  const [mode, setMode] = useState('register');
  const [form, setForm] = useState({
    ApplicantName: '',
    DOB: '',
    Email: '',
    Phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const navigate=useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.Email || !form.DOB) {
      setAlert({ show: true, message: 'Email and Date of Birth are required', variant: 'danger' });
      return;
    }
    
    if (mode === 'register' && (!form.ApplicantName || !form.Phone)) {
      setAlert({ show: true, message: 'All fields are required for registration', variant: 'danger' });
      return;
    }

    setLoading(true);
    const url = mode === 'register' ? 'applicantregister/register' : 'applicantregister/login';
    const payload = mode === 'login' 
      ? { Email: form.Email, DOB: form.DOB } 
      : form;

    try {
      const res = await axios.post(`http://localhost:5000/${url}`, payload);
      setAlert({ show: true, message: res.data.message, variant: 'success' });
      navigate('/Instruction');
    } catch (err) {
      setAlert({ 
        show: true, 
        message: err.response?.data?.message || 'Error occurred', 
        variant: 'danger' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="shadow-lg rounded-3" style={{ width: '100%', maxWidth: '500px' }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h3 className="fw-bold text-primary">ADMISSIONS PORTAL</h3>
            <p className="text-muted">
              {mode === 'register' 
                ? 'Create your application account' 
                : 'Access your application dashboard'}
            </p>
          </div>

          {alert.show && (
            <Alert 
              variant={alert.variant} 
              onClose={() => setAlert({...alert, show: false})} 
              dismissible
              className="mt-3"
            >
              {alert.message}
            </Alert>
          )}

          <ToggleButtonGroup 
            type="radio" 
            name="mode" 
            value={mode} 
            onChange={val => setMode(val)}
            className="mb-4 w-100"
          >
            <ToggleButton 
              id="tbg-radio-1" 
              value="register" 
              variant={mode === 'register' ? 'primary' : 'outline-primary'}
              className="fw-semibold"
            >
              Register
            </ToggleButton>
            <ToggleButton 
              id="tbg-radio-2" 
              value="login" 
              variant={mode === 'login' ? 'primary' : 'outline-primary'}
              className="fw-semibold"
            >
              Login
            </ToggleButton>
          </ToggleButtonGroup>

          {mode === 'register' && (
            <FloatingLabel controlId="floatingName" label="Applicant Name" className="mb-3">
              <Form.Control 
                type="text" 
                placeholder="Applicant Name" 
                name="ApplicantName" 
                value={form.ApplicantName} 
                onChange={handleChange} 
                required 
              />
            </FloatingLabel>
          )}

          <FloatingLabel controlId="floatingDOB" label="Date of Birth" className="mb-3">
            <Form.Control 
              type="date" 
              placeholder="Date of Birth" 
              name="DOB" 
              value={form.DOB} 
              onChange={handleChange} 
              required 
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingEmail" label="Email address" className="mb-3">
            <Form.Control 
              type="email" 
              placeholder="Email" 
              name="Email" 
              value={form.Email} 
              onChange={handleChange} 
              required 
            />
          </FloatingLabel>

          {mode === 'register' && (
            <FloatingLabel controlId="floatingPhone" label="Phone Number" className="mb-4">
              <Form.Control 
                type="tel" 
                placeholder="Phone Number" 
                name="Phone" 
                value={form.Phone} 
                onChange={handleChange} 
                required 
              />
            </FloatingLabel>
          )}

          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleSubmit}
            disabled={loading}
            className="w-100 py-2 fw-bold"
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Processing...</span>
              </>
            ) : (
              mode === 'register' ? 'Register Now' : 'Login to Account'
            )}
          </Button>

          <div className="text-center mt-3">
            <small className="text-muted">
              {mode === 'register' 
                ? 'Already have an account? ' 
                : "Don't have an account? "}
              <Button 
                variant="link" 
                size="sm" 
                onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                className="p-0"
              >
                {mode === 'register' ? 'Login here' : 'Register here'}
              </Button>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdmissionRegister;