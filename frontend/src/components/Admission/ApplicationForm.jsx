import React, { useState, useEffect } from 'react';
import { Form, Button, Col, Row, Modal, Card, ProgressBar, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import {
  FaUser, FaBook, FaUsers, FaFileUpload, FaAward,
  FaArrowRight, FaArrowLeft, FaEye, FaCheck, FaPencilAlt,
  FaInfoCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaSchool,
  FaGraduationCap, FaChalkboardTeacher, FaFileAlt, FaCertificate,
  FaUserShield, FaMoneyBillWave, FaIdCard, FaPercentage,
  FaCalendarAlt, FaHome, FaCity, FaFlag, FaMailBulk,
  FaUserTie, FaRunning, FaWheelchair, FaUserNinja
} from 'react-icons/fa';
import { GiDiploma, GiAchievement } from 'react-icons/gi';
import { IoMdCalendar } from 'react-icons/io';
import { BsGenderAmbiguous, BsPinMap } from 'react-icons/bs';
import { MdSubject, MdScore } from 'react-icons/md';

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    DOB: '',
    Gender: '',
    Email: '',
    Phone: '',
    Address: '',
    City: '',
    State: '',
    Pin: '',
    School: '',
    Board: '',
    PassingYear: '',
    Percentage: '',
    Subjects: '',
    Degree: '',
    Field: '',
    EntranceExam: '',
    ExamScore: '',
    ParentName: '',
    ParentPhone: '',
    ParentOccupation: '',
    IncomeRange: '',
    Category: '',
    SportsQuota: 'No',
    PhysicallyChallenged: 'No',
    ExServiceman: 'No',
  });

  const [files, setFiles] = useState({
    Photo: null,
    Marksheet: null,
    SportsQuotaDoc: null,
    PhysicallyChallengedDoc: null,
    ExServicemanDoc: null,
  });
  const [showPreview, setShowPreview] = useState(false);
  const [degrees, setDegrees] = useState([]);
  const [fields, setFields] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [validated, setValidated] = useState(false);

  const steps = [
    { id: 1, title: 'Personal Info', icon: <FaUser />, description: 'Basic details' },
    { id: 2, title: 'Academic Info', icon: <FaBook />, description: 'Education background' },
    { id: 3, title: 'Parental Info', icon: <FaUsers />, description: 'Family details' },
    { id: 4, title: 'Documents', icon: <FaFileUpload />, description: 'Upload files' },
    { id: 5, title: 'Reservations', icon: <FaAward />, description: 'Special categories' }
  ];

  useEffect(() => {
    fetchDegrees();
  }, []);

  const fetchDegrees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/degree/degreeget');
      setDegrees(res.data);
    } catch (err) {
      console.error('Error fetching degrees', err);
    }
  };

  const fetchFieldsByDegree = async (degreeId) => {
    try {
      const res = await axios.get(`http://localhost:5000/degree/fieldbydegree/${degreeId}`);
      setFields(res.data);
    } catch (err) {
      console.error('Error fetching fields', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Degree') {
      const selectedDegree = degrees.find((d) => d.DegreeName === value);
      if (selectedDegree) {
        fetchFieldsByDegree(selectedDegree.DegreeID);
      }
      setFormData({ ...formData, Degree: value, Field: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    setFiles(prev => ({ ...prev, [name]: fileList[0] }));
  };

  const handleSubmit = async () => {
    if (formData.SportsQuota === 'Yes' && !files.SportsQuotaDoc) {
      toast.error('Please upload Sports Quota Document');
      return;
    }
    if (formData.PhysicallyChallenged === 'Yes' && !files.PhysicallyChallengedDoc) {
      toast.error('Please upload Physically Challenged Document');
      return;
    }
    if (formData.ExServiceman === 'Yes' && !files.ExServicemanDoc) {
      toast.error('Please upload Ex-Serviceman Document');
      return;
    }

    const finalData = new FormData();
    Object.entries(formData).forEach(([key, value]) => finalData.append(key, value));
    Object.entries(files).forEach(([key, file]) => {
      if (file) finalData.append(key, file);
    });

    try {
      await axios.post('http://localhost:5000/applist/apply', finalData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Submitted!',
        text: 'Your application has been submitted successfully.',
        confirmButtonColor: '#3085d6',
      });

      setShowPreview(false);
    } catch (err) {
      console.error(err);
      toast.error('Submission Failed');
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(false);
    setActiveStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrev = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const calculateProgress = () => {
    return (activeStep / steps.length) * 100;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="step-content">
            <h4 className="mb-4 text-primary" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              <FaUser className="me-2" /> Personal Information
            </h4>
            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="firstName">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaUser className="me-2" /> First Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="lastName">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaUser className="me-2" /> Last Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3 g-3">
              <Col md={4}>
                <Form.Group controlId="dob">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <IoMdCalendar className="me-2" /> Date of Birth <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="gender">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <BsGenderAmbiguous className="me-2" /> Gender <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="phone">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaPhone className="me-2" /> Phone <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="Phone"
                    value={formData.Phone}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaEnvelope className="me-2" /> Email <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="address">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaMapMarkerAlt className="me-2" /> Address <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="Address"
                    value={formData.Address}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3 g-3">
              <Col md={4}>
                <Form.Group controlId="city">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaCity className="me-2" /> City <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="City"
                    value={formData.City}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="state">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaFlag className="me-2" /> State <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="State"
                    value={formData.State}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="pin">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <BsPinMap className="me-2" /> Pin Code <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="Pin"
                    value={formData.Pin}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h4 className="mb-4 text-primary" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              <FaBook className="me-2" /> Academic Information
            </h4>
            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="school">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaSchool className="me-2" /> School <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="School"
                    value={formData.School}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="board">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaChalkboardTeacher className="me-2" /> Board <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="Board"
                    value={formData.Board}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3 g-3">
              <Col md={4}>
                <Form.Group controlId="passingYear">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaCalendarAlt className="me-2" /> Passing Year <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="PassingYear"
                    value={formData.PassingYear}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="percentage">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaPercentage className="me-2" /> Percentage <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="Percentage"
                    value={formData.Percentage}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="subjects">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <MdSubject className="me-2" /> Subjects <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="Subjects"
                    value={formData.Subjects}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="degree">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <GiDiploma className="me-2" /> Degree <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="Degree"
                    value={formData.Degree}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    <option value="">-- Select Degree --</option>
                    {degrees.map(deg => (
                      <option key={deg.DegreeID} value={deg.DegreeName}>{deg.DegreeName}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="field">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaGraduationCap className="me-2" /> Field <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="Field"
                    value={formData.Field}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  >
                    <option value="">-- Select Field --</option>
                    {fields.map(f => (
                      <option key={f.FieldID} value={f.FieldName}>{f.FieldName}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="entranceExam">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaFileAlt className="me-2" /> Entrance Exam <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="EntranceExam"
                    value={formData.EntranceExam}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="examScore">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <MdScore className="me-2" /> Exam Score <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="ExamScore"
                    value={formData.ExamScore}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h4 className="mb-4 text-primary" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              <FaUsers className="me-2" /> Parental Information
            </h4>
            <Row className="mb-3 g-3">
              <Col md={4}>
                <Form.Group controlId="parentName">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaUserTie className="me-2" /> Parent Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="ParentName"
                    value={formData.ParentName}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="parentPhone">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaPhone className="me-2" /> Parent Phone <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="ParentPhone"
                    value={formData.ParentPhone}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="parentOccupation">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaUserTie className="me-2" /> Occupation <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="ParentOccupation"
                    value={formData.ParentOccupation}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="incomeRange">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaMoneyBillWave className="me-2" /> Income Range <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="IncomeRange"
                    value={formData.IncomeRange}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaIdCard className="me-2" /> Category <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="Category"
                    value={formData.Category}
                    onChange={handleInputChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h4 className="mb-4 text-primary" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              <FaFileUpload className="me-2" /> Documents Upload
            </h4>
            <Row className="mb-3 g-3">
              <Col md={6}>
                <Form.Group controlId="photo">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaUser className="me-2" /> Passport Photo <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="Photo"
                    onChange={handleFileChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                  <Form.Text className="text-muted small" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    Recent passport size photo (max 2MB, JPG/PNG)
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="marksheet">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaFileAlt className="me-2" /> Marksheet <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="Marksheet"
                    onChange={handleFileChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                  <Form.Text className="text-muted small" style={{ fontFamily: "'Open Sans', sans-serif" }}>
                    Scanned copy of your marksheet (PDF/JPEG, max 5MB)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </div>
        );
      case 5:
        return (
          <div className="step-content">
            <h4 className="mb-4 text-primary" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
              <FaAward className="me-2" /> Special Reservations
            </h4>
            <Form.Group controlId="sportsQuota" className="mb-4">
              <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                <FaRunning className="me-2" /> Sports Quota
              </Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  name="SportsQuota"
                  value="Yes"
                  label="Yes"
                  checked={formData.SportsQuota === 'Yes'}
                  onChange={handleInputChange}
                  id="sportsYes"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                />
                <Form.Check
                  type="radio"
                  name="SportsQuota"
                  value="No"
                  label="No"
                  checked={formData.SportsQuota === 'No'}
                  onChange={handleInputChange}
                  id="sportsNo"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                />
              </div>
              {formData.SportsQuota === 'Yes' && (
                <div className="mt-2">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <GiAchievement className="me-2" /> Sports Certificate <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="SportsQuotaDoc"
                    onChange={handleFileChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="physicallyChallenged" className="mb-4">
              <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                <FaWheelchair className="me-2" /> Physically Challenged
              </Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  name="PhysicallyChallenged"
                  value="Yes"
                  label="Yes"
                  checked={formData.PhysicallyChallenged === 'Yes'}
                  onChange={handleInputChange}
                  id="physicallyYes"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                />
                <Form.Check
                  type="radio"
                  name="PhysicallyChallenged"
                  value="No"
                  label="No"
                  checked={formData.PhysicallyChallenged === 'No'}
                  onChange={handleInputChange}
                  id="physicallyNo"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                />
              </div>
              {formData.PhysicallyChallenged === 'Yes' && (
                <div className="mt-2">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaCertificate className="me-2" /> Disability Certificate <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="PhysicallyChallengedDoc"
                    onChange={handleFileChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="exServiceman" className="mb-3">
              <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                <FaUserNinja className="me-2" /> Ex-Serviceman
              </Form.Label>
              <div className="d-flex gap-3">
                <Form.Check
                  type="radio"
                  name="ExServiceman"
                  value="Yes"
                  label="Yes"
                  checked={formData.ExServiceman === 'Yes'}
                  onChange={handleInputChange}
                  id="exServicemanYes"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                />
                <Form.Check
                  type="radio"
                  name="ExServiceman"
                  value="No"
                  label="No"
                  checked={formData.ExServiceman === 'No'}
                  onChange={handleInputChange}
                  id="exServicemanNo"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                />
              </div>
              {formData.ExServiceman === 'Yes' && (
                <div className="mt-2">
                  <Form.Label style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}>
                    <FaUserShield className="me-2" /> Service Certificate <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="ExServicemanDoc"
                    onChange={handleFileChange}
                    required
                    className="border-2"
                    style={{ fontFamily: "'Open Sans', sans-serif" }}
                  />
                </div>
              )}
            </Form.Group>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap');
          
          body {
            font-family: 'Open Sans', sans-serif;
            background-color: #f8f9fa;
          }
          
          .bg-gradient-blue {
            background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
          }
    
  
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Quicksand:wght@500;600&display=swap');
    
    
 

          .stepper-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            transition: all 0.3s ease;
          }
          
          .stepper-step.active .stepper-circle {
            background-color: #3a7bd5;
            color: white;
          }
          
          .stepper-step.current .stepper-circle {
            background-color: white;
            color: #3a7bd5;
            border: 2px solid #3a7bd5;
            transform: scale(1.1);
          }
          
          .form-control, .form-select {
            border-radius: 8px;
            padding: 10px 15px;
            border: 1px solid #ced4da;
            transition: all 0.3s;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #3a7bd5;
            box-shadow: 0 0 0 0.25rem rgba(58, 123, 213, 0.25);
          }
          
          .btn-primary {
            background-color: #3a7bd5;
            border-color: #3a7bd5;
          }
          
          .btn-primary:hover {
            background-color: #2c5fb3;
            border-color: #2c5fb3;
          }
          
          .btn-outline-primary {
            color: #3a7bd5;
            border-color: #3a7bd5;
          }
          
          .btn-outline-primary:hover {
            background-color: #3a7bd5;
            color: white;
          }
          
          .progress-bar {
            background-color: #3a7bd5;
          }
        `}
      </style>

      <Card className="border-0 shadow-lg rounded-3 overflow-hidden ">
        <Card.Header className="bg-gradient-blue text-white py-5 text-center">
          <div className="d-flex flex-column align-items-center">
            <h2 className="mb-2 fw-bold" style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '2.2rem',
              letterSpacing: '1px',
              textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
            }}>
              <FaGraduationCap className="me-2" style={{ transform: 'translateY(-2px)' }} />
              College Admission Portal
            </h2>
            <p className="mb-0 mt-1" style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 500,
              letterSpacing: '0.5px',
              // opacity: 0.9
            }}>
              Begin your academic journey with us
            </p>
          </div>
        </Card.Header>

        <Card.Body className="p-4">
          {/* Stepper */}
          <ListGroup horizontal className="mb-4 justify-content-between">
            {steps.map((step) => (
              <ListGroup.Item
                key={step.id}
                className={`border-0 bg-transparent p-0 text-center ${activeStep >= step.id ? 'text-primary' : 'text-muted'}`}
              >
                <div className={`d-flex flex-column align-items-center ${activeStep === step.id ? 'fw-bold' : ''}`}>
                  <div className={`stepper-circle ${activeStep >= step.id ? 'active' : ''} ${activeStep === step.id ? 'current' : ''}`}>
                    {React.cloneElement(step.icon, { size: 20 })}
                  </div>
                  <div style={{ fontFamily: "'Poppins', sans-serif" }}>{step.title}</div>
                  <small className="text-muted" style={{ fontFamily: "'Open Sans', sans-serif" }}>{step.description}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <ProgressBar now={(activeStep / steps.length) * 100} className="mb-4" />

          <Form noValidate validated={validated} onSubmit={handleNext}>
            {renderStepContent()}

            <div className="d-flex justify-content-between mt-4">
              {activeStep > 1 && (
                <Button
                  variant="outline-primary"
                  onClick={handlePrev}
                  className="fw-bold px-4 py-2 rounded-pill"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <FaArrowLeft className="me-2" /> Previous
                </Button>
              )}

              {activeStep < steps.length ? (
                <Button
                  type="submit"
                  variant="primary"
                  className="fw-bold px-4 py-2 rounded-pill ms-auto"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Next <FaArrowRight className="ms-2" />
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() => setShowPreview(true)}
                  className="fw-bold px-4 py-2 rounded-pill ms-auto"
                  style={{ fontFamily: "'Poppins', sans-serif" }} >
                  <FaEye className="me-2" /> Preview & Submit
                </Button>
              )}
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="xl" centered>
        <Modal.Header closeButton className="bg-gradient-blue text-white py-3">
          <Modal.Title className="fw-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <FaFileAlt className="me-2" /> Application Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-4">
            <h5 className="border-bottom pb-2 fw-semibold text-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <FaUser className="me-2" /> Personal Information
            </h5>
            <Row className="g-3">
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaUser className="me-2" /><strong>Name:</strong> {formData.FirstName} {formData.LastName}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><IoMdCalendar className="me-2" /><strong>DOB:</strong> {formData.DOB}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><BsGenderAmbiguous className="me-2" /><strong>Gender:</strong> {formData.Gender}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaPhone className="me-2" /><strong>Phone:</strong> {formData.Phone}</p></Col>
              <Col md={12}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaEnvelope className="me-2" /><strong>Email:</strong> {formData.Email}</p></Col>
              <Col md={12}>
                <p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaMapMarkerAlt className="me-2" /><strong>Address:</strong> {formData.Address}, {formData.City}, {formData.State} - {formData.Pin}</p>
              </Col>
            </Row>
          </div>

          <div className="mb-4">
            <h5 className="border-bottom pb-2 fw-semibold text-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <FaBook className="me-2" /> Academic Information
            </h5>
            <Row className="g-3">
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaSchool className="me-2" /><strong>School:</strong> {formData.School}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaChalkboardTeacher className="me-2" /><strong>Board:</strong> {formData.Board}</p></Col>
              <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaCalendarAlt className="me-2" /><strong>Passing Year:</strong> {formData.PassingYear}</p></Col>
              <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaPercentage className="me-2" /><strong>Percentage:</strong> {formData.Percentage}%</p></Col>
              <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><MdSubject className="me-2" /><strong>Subjects:</strong> {formData.Subjects}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><GiDiploma className="me-2" /><strong>Degree:</strong> {formData.Degree}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaGraduationCap className="me-2" /><strong>Field:</strong> {formData.Field}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaFileAlt className="me-2" /><strong>Entrance Exam:</strong> {formData.EntranceExam}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><MdScore className="me-2" /><strong>Exam Score:</strong> {formData.ExamScore}</p></Col>
            </Row>
          </div>

          <div className="mb-4">
            <h5 className="border-bottom pb-2 fw-semibold text-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <FaUsers className="me-2" /> Parental Information
            </h5>
            <Row className="g-3">
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaUserTie className="me-2" /><strong>Parent Name:</strong> {formData.ParentName}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaPhone className="me-2" /><strong>Parent Phone:</strong> {formData.ParentPhone}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaUserTie className="me-2" /><strong>Occupation:</strong> {formData.ParentOccupation}</p></Col>
              <Col md={6}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaMoneyBillWave className="me-2" /><strong>Income Range:</strong> {formData.IncomeRange}</p></Col>
              <Col md={12}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaIdCard className="me-2" /><strong>Category:</strong> {formData.Category}</p></Col>
            </Row>
          </div>

          <div className="mb-4">
            <h5 className="border-bottom pb-2 fw-semibold text-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <FaAward className="me-2" /> Special Reservations
            </h5>
            <Row className="g-3">
              <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaRunning className="me-2" /><strong>Sports Quota:</strong> {formData.SportsQuota}</p></Col>
              <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaWheelchair className="me-2" /><strong>Physically Challenged:</strong> {formData.PhysicallyChallenged}</p></Col>
              <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaUserNinja className="me-2" /><strong>Ex-Serviceman:</strong> {formData.ExServiceman}</p></Col>
            </Row>
          </div>

          <div className="mb-4">
            <h5 className="border-bottom pb-2 fw-semibold text-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>
              <FaFileUpload className="me-2" /> Uploaded Documents
            </h5>
            <Row className="g-3">
              <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaUser className="me-2" /><strong>Photo:</strong> {files.Photo ? files.Photo.name : 'Not uploaded'}</p></Col>
              <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaFileAlt className="me-2" /><strong>Marksheet:</strong> {files.Marksheet ? files.Marksheet.name : 'Not uploaded'}</p></Col>
              {formData.SportsQuota === 'Yes' && (
                <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><GiAchievement className="me-2" /><strong>Sports Certificate:</strong> {files.SportsQuotaDoc ? files.SportsQuotaDoc.name : 'Not uploaded'}</p></Col>
              )}
              {formData.PhysicallyChallenged === 'Yes' && (
                <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaCertificate className="me-2" /><strong>Disability Certificate:</strong> {files.PhysicallyChallengedDoc ? files.PhysicallyChallengedDoc.name : 'Not uploaded'}</p></Col>
              )}
              {formData.ExServiceman === 'Yes' && (
                <Col md={4}><p style={{ fontFamily: "'Open Sans', sans-serif" }}><FaUserShield className="me-2" /><strong>Service Certificate:</strong> {files.ExServicemanDoc ? files.ExServicemanDoc.name : 'Not uploaded'}</p></Col>
              )}
            </Row>
          </div>

          <div className="alert alert-info">
            <div className="d-flex align-items-center">
              <FaInfoCircle className="fs-4 text-info me-3" />
              <div style={{ fontFamily: "'Open Sans', sans-serif" }}>
                <strong>Note:</strong> Please review all information carefully before submission.
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button
            variant="outline-secondary"
            onClick={() => setShowPreview(false)}
            className="rounded-pill px-4 py-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}>
            <FaPencilAlt className="me-2" /> Edit Application
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="rounded-pill px-4 py-2 shadow"
            style={{ fontFamily: "'Poppins', sans-serif" }} >
            <FaCheck className="me-2" /> Confirm & Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApplicationForm;