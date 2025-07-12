import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import {Container, Card, Form, Row, Col, Button, Spinner, Image, FloatingLabel} from 'react-bootstrap';

const StudentEdit = () => {
  const { studentCode } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [degrees, setDegrees] = useState([]);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/student/getstudent/${studentCode}`)
      .then(res => {
        setFormData(res.data[0]);
        if (res.data[0].ProfilePicture) {
          setImagePreview(`http://localhost:5000/${res.data[0].ProfilePicture}`);
        }
        // Load degrees
        axios.get('http://localhost:5000/degree/degreeget')
          .then(degreeRes => {
            setDegrees(degreeRes.data);

            // Load related fields if Course exists
            if (res.data[0].Course) {
              axios.get(`http://localhost:5000/degree/fieldbydegreename/${res.data[0].Course}`)
                .then(fieldRes => setFields(fieldRes.data))
                .catch(() => toast.error('Failed to fetch fields'));
            }
          }).catch(() => toast.error('Failed to fetch degrees'));
      })
      .catch(() => toast.error('Failed to load student data.'))
      .finally(() => setLoading(false));
  }, [studentCode]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value }));
   // When course changes
    if (name === 'Course') {
      try {
        const fieldRes = await axios.get(`http://localhost:5000/degree/fieldbydegreename/${value}`);
        setFields(fieldRes.data);
        // reset Department on course change
        setFormData(prev => ({
          ...prev,
          Department: ''
        }));
      } catch (err) {
        toast.error('Failed to fetch departments');
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const validateForm = () => {
    const requiredFields = ['PhoneNumber', 'Gender', 'Department', 'Course', 'YearOfStudy', 'Status'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.warn(`Please fill the "${field}" field.`);
        return false;
      }
    }
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const payload = new FormData();
    for (const key in formData) {
      if (['Username', 'Email', 'StudentCode'].includes(key)) continue;
      payload.append(key, formData[key] || '');
    }
    if (file) {
      payload.append('ProfilePicture', file);
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/student/updatestudent/${studentCode}`,
        payload,
         { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Student details updated successfully.',
          confirmButtonColor: '#4dabf7',
        }).then(() => navigate('/student'));
      }
    } catch (error) {
      toast.error('Update failed!');
    } finally {
      setLoading(false);
    }
  };

  if (loading && Object.keys(formData).length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: '1200px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Card className="border-0" style={{ borderRadius: '10px', backgroundColor: '#f8f9fa' }}>
        <Card.Header className="py-3" style={{ backgroundColor: '#4dabf7', color: 'white' }}>
          <h3 className="mb-0 text-center">
            <i className="fas fa-user-graduate me-2"></i>
            Edit Student - {studentCode}
          </h3>
        </Card.Header>
        <Card.Body className="px-4 py-4">
          <Form onSubmit={handleUpdate}>
            <Row className="g-4">
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                  <Card.Body>
                    <h5 className="mb-4" style={{ color: '#4dabf7', borderBottom: '1px solid #dee2e6', paddingBottom: '8px' }}>
                      Personal Information
                    </h5>
                    <FloatingLabel controlId="studentCode" label="Student Code" className="mb-3">
                      <Form.Control plaintext readOnly defaultValue={formData.StudentCode || ''} className="fw-bold text-dark ps-2.5 pb-1" />
                    </FloatingLabel>

                    <FloatingLabel controlId="username" label="Username" className="mb-3">
                      <Form.Control plaintext readOnly defaultValue={formData.Username || ''} className="fw-bold text-dark ps-2.5 pb-1" />
                    </FloatingLabel>

                    <FloatingLabel controlId="email" label="Email" className="mb-3">
                      <Form.Control plaintext readOnly defaultValue={formData.Email || ''} className="fw-bold text-dark ps-2.5 pb-1" />
                    </FloatingLabel>

                    <FloatingLabel controlId="phoneNumber" label="Phone Number *" className="mb-3">
                      <Form.Control type="text" name="PhoneNumber" value={formData.PhoneNumber || ''} onChange={handleChange} required />
                    </FloatingLabel>

                    <FloatingLabel controlId="gender" label="Gender *" className="mb-3">
                      <Form.Select name="Gender" value={formData.Gender || ''} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="dateOfBirth" label="Date of Birth" className="mb-3">
                      <Form.Control type="date" name="DateOfBirth" value={formData.DateOfBirth?.split('T')[0] || ''} onChange={handleChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="address" label="Address">
                      <Form.Control as="textarea" rows={3} name="Address" value={formData.Address || ''} onChange={handleChange} />
                    </FloatingLabel>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                  <Card.Body>
                    <h5 className="mb-4" style={{ color: '#4dabf7', borderBottom: '1px solid #dee2e6', paddingBottom: '8px' }}>
                      Academic Information
                    </h5>

                    <FloatingLabel controlId="course" label="Course (Degree) *" className="mb-3">
                      <Form.Select
                        name="Course"
                        value={formData.Course || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Course</option>
                        {degrees.map(degree => (
                          <option key={degree.DegreeId} value={degree.DegreeId}>
                            {degree.DegreeName}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>


                    <FloatingLabel controlId="department" label="Department *" className="mb-3">
                      <Form.Select
                        name="Department"
                        value={formData.Department || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {fields.map(field => (
                          <option key={field.FieldId} value={field.FieldName}>
                            {field.FieldName}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>


                    <FloatingLabel controlId="yearOfStudy" label="Year of Study *" className="mb-3">
                      <Form.Select name="YearOfStudy" value={formData.YearOfStudy || ''} onChange={handleChange} required>
                        <option value="">Select Year</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                      </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="enrollmentYear" label="Enrollment Year" className="mb-3">
                      <Form.Control type="number" name="EnrollmentYear" value={formData.EnrollmentYear || ''} onChange={handleChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="rollNumber" label="Roll Number" className="mb-3">
                      <Form.Control type="text" name="RollNumber" value={formData.RollNumber || ''} onChange={handleChange} />
                    </FloatingLabel>

                    <FloatingLabel controlId="status" label="Status *" className="mb-3">
                      <Form.Select name="Status" value={formData.Status || ''} onChange={handleChange} required>
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Suspended">Suspended</option>
                      </Form.Select>
                    </FloatingLabel>

                    <div className="text-center mt-4">
                      <div className="mb-3">
                        {imagePreview ? (
                          <Image src={imagePreview} alt="Preview" roundedCircle style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                        ) : (
                          <div className="d-flex justify-content-center align-items-center bg-light rounded-circle" style={{ width: '150px', height: '150px', border: '2px dashed #adb5bd' }}>
                            <i className="fas fa-user fa-3x text-secondary"></i>
                          </div>
                        )}
                      </div>
                      <Form.Group controlId="profilePicture">
                        <Form.Label className="btn btn-outline-primary rounded-pill">
                          <i className="fas fa-camera me-2"></i>
                          {file ? 'Change Photo' : 'Upload Photo'}
                          <Form.Control type="file" name="ProfilePicture" onChange={handleFileChange} accept="image/*" className="d-none" />
                        </Form.Label>
                      </Form.Group>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button variant="outline-secondary" onClick={() => navigate('/student')} className="px-4 py-2 rounded-pill">
                <i className="fas fa-times me-2"></i> Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading} className="px-4 py-2 rounded-pill">
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Updating...</span>
                  </>
                ) : (
                  <> <i className="fas fa-save me-2"></i> Update </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StudentEdit;
