import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPaperclip, FaPaperPlane, FaTimes } from 'react-icons/fa';

const AdminCircularForm = () => {
  const [formData, setFormData] = useState({
    Title: '',
    Description: '',
    TargetRole: '',
    TargetSubRole: '',
    TargetDept: 'All',
    ValidTill: '',
    FileAttachment: null,
  });

  const [userRole, setUserRole] = useState('');
  const [departments, setDepartments] = useState([]);
  const [facultySubRoles, setFacultySubRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  // Gradient colors for UI elements
  const headerGradient = {
    background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
  };

  const buttonGradient = {
    background: 'linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)',
    border: 'none',
    fontWeight: 600,
  };

  const buttonHover = {
    background: 'linear-gradient(135deg, #3e44b8 0%, #7f84eb 100%)',
    border: 'none',
  };

  // Fetch user role, departments, and subroles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/register/me', { withCredentials: true });
        setUserRole(userRes.data.role);
        
        const deptRes = await axios.get('http://localhost:5000/Field/fieldget');
        setDepartments(deptRes.data);
        
        const rolesRes = await axios.get('http://localhost:5000/faculty/getroles');
        setFacultySubRoles(rolesRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'FileAttachment') {
      setFormData({ ...formData, FileAttachment: files[0] });
      setFilePreview(files[0] ? files[0].name : null);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.Title || !formData.Description || !formData.TargetRole || !formData.ValidTill) {
      toast.error("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value);
      });

      await axios.post('http://localhost:5000/circular/send-circular', data, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success("Circular sent successfully!");
      setFormData({
        Title: '',
        Description: '',
        TargetRole: '',
        TargetSubRole: '',
        TargetDept: 'All',
        ValidTill: '',
        FileAttachment: null,
      });
      setFilePreview(null);
    } catch (error) {
      console.error("Error sending circular:", error);
      toast.error("Failed to send circular");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      Title: '',
      Description: '',
      TargetRole: '',
      TargetSubRole: '',
      TargetDept: 'All',
      ValidTill: '',
      FileAttachment: null,
    });
    setFilePreview(null);
  };

  const removeFile = () => {
    setFormData({ ...formData, FileAttachment: null });
    setFilePreview(null);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (userRole === 'Student') {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Card className="text-center p-4 shadow" style={{ borderRadius: '12px' }}>
          <Card.Body>
            <Card.Title className="text-danger mb-4">Access Denied</Card.Title>
            <Card.Text>
              You are not authorized to access this feature. Please contact your administrator.
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <Card className="border-0 shadow-lg" style={{ borderRadius: '15px', overflow: 'hidden' }}>
        <Card.Header style={{ ...headerGradient, color: 'white', padding: '1.5rem' }}>
          <div className="d-flex align-items-center">
            <div>
              <h3 className="mb-1">Send Circular</h3>
              <p className="mb-0 opacity-75">Create and distribute important announcements</p>
            </div>
            <FaPaperPlane className="ms-auto" size={28} />
          </div>
        </Card.Header>
        
        <Card.Body style={{ padding: '2rem' }}>
          <Form onSubmit={handleSubmit}>
            <Row className="g-4 mb-4">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-bold text-primary">Title<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="Title"
                    value={formData.Title}
                    onChange={handleChange}
                    placeholder="Enter circular title"
                    required
                    className="py-2"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold text-primary">Valid Till<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="ValidTill"
                    value={formData.ValidTill}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="py-2"
                    style={{ borderRadius: '10px' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-primary">Description<span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                name="Description"
                rows={5}
                value={formData.Description}
                onChange={handleChange}
                placeholder="Provide detailed information about the circular"
                required
                className="py-2"
                style={{ borderRadius: '10px' }}
              />
            </Form.Group>

            <div className="bg-light p-4 rounded mb-4">
              <h5 className="mb-4 text-primary">Target Audience</h5>
              <Row className="g-4">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Target Role<span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="TargetRole"
                      value={formData.TargetRole}
                      onChange={handleChange}
                      required
                      className="py-2"
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="">Select Target Role</option>
                      {userRole === 'admin' && (
                        <>
                          <option value="All">All Users</option>
                          <option value="Faculty">Faculty Only</option>
                          <option value="Student">Students Only</option>
                        </>
                      )}
                      {userRole === 'Faculty' && (
                        <>
                          <option value="Faculty">Faculty Only</option>
                          <option value="Student">Students Only</option>
                        </>
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {formData.TargetRole === 'Faculty' && (
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-bold">Faculty Sub Role</Form.Label>
                      <Form.Select
                        name="TargetSubRole"
                        value={formData.TargetSubRole}
                        onChange={handleChange}
                        className="py-2"
                        style={{ borderRadius: '10px' }}
                      >
                        <option value="">All Sub Roles</option>
                        {facultySubRoles.map(role => (
                          <option key={role.RoleID} value={role.RoleName}>
                            {role.RoleName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                )}

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-bold">Target Department</Form.Label>
                    <Form.Select
                      name="TargetDept"
                      value={formData.TargetDept}
                      onChange={handleChange}
                      className="py-2"
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="All">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.FieldId} value={dept.FieldName}>
                          {dept.FieldName} ({dept.DegreeName})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <div className="mb-4">
              <h5 className="mb-3 text-primary">
                <FaPaperclip className="me-2" /> Attach File
              </h5>
              
              {filePreview ? (
                <Card className="border" style={{ borderRadius: '10px' }}>
                  <Card.Body className="p-3 d-flex align-items-center">
                    <div className="d-flex align-items-center flex-grow-1">
                      <FaPaperclip className="me-3 text-primary" size={20} />
                      <span className="text-truncate">{filePreview}</span>
                    </div>
                    <Button 
                      variant="link" 
                      className="text-danger p-0"
                      onClick={removeFile}
                    >
                      <FaTimes size={18} />
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <div className="border rounded p-3" style={{ borderRadius: '10px' }}>
                  <Form.Control
                    type="file"
                    name="FileAttachment"
                    onChange={handleChange}
                    className="py-2"
                  />
                </div>
              )}
              
              <Form.Text muted className="d-block mt-2">
                Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
              </Form.Text>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-5">
              <Button 
                variant="outline-secondary" 
                onClick={handleReset}
                disabled={isSubmitting}
                style={{ 
                  borderRadius: '8px', 
                  padding: '10px 25px',
                  fontWeight: 600,
                }}>
                Reset Form
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
                style={buttonGradient}
                onMouseEnter={(e) => e.target.style.background = buttonHover.background}
                onMouseLeave={(e) => e.target.style.background = buttonGradient.background}
                className="px-4 py-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" />
                    Send Circular
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminCircularForm;