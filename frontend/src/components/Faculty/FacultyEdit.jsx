import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { Container, Card, Form, Row, Col, Button, Spinner, Image, FloatingLabel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getfieldpending } from '../../Redux/DegreeFieldslice';

const FacultyEdit = () => {
  const { facultyCode } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [sectionroman, setsectionroman] = useState([]);


  const dispatch = useDispatch();
  const { Field } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(getfieldpending());

  })

 useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/faculty/getfaculty/${facultyCode}`)
      .then(res => {
        setFormData(res.data[0]);
        if (res.data[0].ProfilePicture) {
          setImagePreview(`http://localhost:5000/${res.data[0].ProfilePicture}`);
        }
      })
      .catch(() => toast.error('Failed to load faculty data.'))
      .finally(() => setLoading(false));
  }, [facultyCode]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //get faculty roles
   useEffect(() => {
    axios.get('http://localhost:5000/faculty/getroles')
      .then(res => {
        console.log('Roles:', res.data); 
        setRoles(res.data);
      })
      .catch(err => toast.error('Failed to load roles'));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/allocation/getallsections') 
      .then(res => setsectionroman(res.data))
      .catch(err => console.error('Error fetching sections:', err));
  }, []);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const validateForm = () => {
    const requiredFields = ['PhoneNumber', 'Gender', 'Department', 'Status'];
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
      if (['Username', 'Email', 'FacultyCode'].includes(key)) continue;
      payload.append(key, formData[key] || '');
    }
    if (file) {
      payload.append('ProfilePicture', file);
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/faculty/updatefaculty/${facultyCode}`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Faculty details updated successfully.',
          confirmButtonColor: '#4dabf7', // Lighter blue
        }).then(() => navigate('/faculty'));
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
            <i className="fas fa-chalkboard-teacher me-2"></i>
            Edit Faculty - {facultyCode}
          </h3>
        </Card.Header>
        <Card.Body className="px-4 py-4">
          <Form onSubmit={handleUpdate}>
            <Row className="g-4">
              {/* Left Column - Personal Info */}
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                  <Card.Body>
                    <h5 className="mb-4" style={{ color: '#4dabf7', borderBottom: '1px solid #dee2e6', paddingBottom: '8px' }}>
                      Personal Information
                    </h5>

                    <FloatingLabel controlId="facultyCode" label="Faculty Code" className="mb-3 ">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={formData.FacultyCode || ''}
                        className="fw-bold text-dark ps-2.5 pb-1"
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="username" label="Username" className="mb-3">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={formData.Username || ''}
                        className="fw-bold text-dark ps-2.5 pb-1"
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="email" label="Email" className="mb-3">
                      <Form.Control
                        plaintext
                        readOnly
                        defaultValue={formData.Email || ''}
                        className="fw-bold text-dark ps-2.5 pb-1"
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="phoneNumber" label="Phone Number *" className="mb-3">
                      <Form.Control
                        type="text"
                        name="PhoneNumber"
                        value={formData.PhoneNumber || ''}
                        onChange={handleChange}
                        required
                        style={{ borderColor: '#ced4da' }}
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="gender" label="Gender *" className="mb-3">
                      <Form.Select
                        name="Gender"
                        value={formData.Gender || ''}
                        onChange={handleChange}
                        required
                        style={{ borderColor: '#ced4da' }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="dateOfBirth" label="Date of Birth" className="mb-3">
                      <Form.Control
                        type="date"
                        name="DateOfBirth"
                        value={formData.DateOfBirth?.split('T')[0] || ''}
                        onChange={handleChange}
                        style={{ borderColor: '#ced4da' }}
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="address" label="Address">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="Address"
                        value={formData.Address || ''}
                        onChange={handleChange}
                        style={{ borderColor: '#ced4da' }}
                      />
                    </FloatingLabel>
                  </Card.Body>
                </Card>
              </Col>

              {/* Right Column - Professional Info */}
              <Col md={6}>
                <Card className="h-100 border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                  <Card.Body>
                    <h5 className="mb-4" style={{ color: '#4dabf7', borderBottom: '1px solid #dee2e6', paddingBottom: '8px' }}>
                      Professional Information
                    </h5>

                    <FloatingLabel controlId="department" label="Department *" className="mb-3">
                      <Form.Select
                        type="text"
                        name="Department"
                        value={formData.Department || ''}
                        onChange={handleChange}
                        required
                        style={{ borderColor: '#ced4da' }}
                      >
                        <option value="">Select Department</option>
                        {
                          Field.map(f => (
                            <option key={f.FieldID} value={f.FieldName}>{f.FieldName}</option>
                          ))
                        }
                      </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel controlId="qualification" label="Qualification" className="mb-3">
                      <Form.Control
                        type="text"
                        name="Qualification"
                        value={formData.Qualification || ''}
                        onChange={handleChange}
                        style={{ borderColor: '#ced4da' }}
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="experience" label="Experience (Years)" className="mb-3">
                      <Form.Control
                        type="number"
                        name="ExperienceYears"
                        value={formData.ExperienceYears || ''}
                        onChange={handleChange}
                        style={{ borderColor: '#ced4da' }}
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="dateOfJoining" label="Date of Joining" className="mb-3">
                      <Form.Control
                        type="date"
                        name="DateOfJoining"
                        value={formData.DateOfJoining?.split('T')[0] || ''}
                        onChange={handleChange}
                        style={{ borderColor: '#ced4da' }}
                      />
                    </FloatingLabel>

                    <FloatingLabel controlId="status" label="Status *" className="mb-3">
                      <Form.Select
                        name="Status"
                        value={formData.Status || ''}
                        onChange={handleChange}
                        required
                        style={{ borderColor: '#ced4da' }}
                      >
                        <option value="">Select Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </Form.Select>
                    </FloatingLabel>
                    {/* select Faculty Role */}
                    <FloatingLabel controlId="roleID" label="Select Role *" className="mb-3">
                      <Form.Select
                        name="RoleID"
                        value={formData.RoleID || ''}
                        onChange={handleChange}
                        required
                        style={{ borderColor: '#ced4da' }}
                      >
                        <option value=""></option>
                        {roles.map((role) => (
                          <option key={role.RoleID} value={role.RoleID}>
                            {role.RoleName}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel controlId="section" label="Class Section *" className="mb-3">
                      <Form.Select
                        name="InchargeSectionRoman"
                        value={formData.InchargeSectionRoman|| ''}
                        onChange={handleChange}
                        required
                        style={{ borderColor: '#ced4da' }}
                      >
                        <option value=''>Select a Class Section</option>
                        {sectionroman.map((sec, index) => (
                          <option key={index} value={sec.SectionRoman}>{sec.SectionRoman}</option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                    <div className="text-center mt-4">
                      <div className="mb-3">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            roundedCircle
                            style={{
                              width: '150px',
                              height: '150px',
                              objectFit: 'cover',
                              border: '2px solid #dee2e6'
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex justify-content-center align-items-center bg-light rounded-circle"
                            style={{
                              width: '150px',
                              height: '150px',
                              margin: '0 auto',
                              border: '2px dashed #adb5bd'
                            }}
                          >
                            <i className="fas fa-user-tie fa-3x text-secondary"></i>
                          </div>
                        )}
                      </div>
                      <Form.Group controlId="profilePicture">
                        <Form.Label className="btn btn-outline-primary rounded-pill" style={{ borderColor: '#4dabf7', color: '#4dabf7' }}>
                          <i className="fas fa-camera me-2"></i>
                          {file ? 'Change Photo' : 'Upload Photo'}
                          <Form.Control
                            type="file"
                            name="ProfilePicture"
                            onChange={handleFileChange}
                            accept="image/*"
                            className="d-none"
                          />
                        </Form.Label>
                      </Form.Group>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/faculty')}
                className="px-4 py-2 rounded-pill"
                style={{ minWidth: '120px' }}
              >
                <i className="fas fa-times me-2"></i> Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-pill"
                style={{ minWidth: '120px', backgroundColor: '#4dabf7', borderColor: '#4dabf7' }}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Updating...</span>
                  </>
                ) : (<> <i className="fas fa-save me-2"></i> Update </>)}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FacultyEdit;