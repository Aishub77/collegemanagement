import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getfacultypending } from '../../Redux/Facultyslice';
import {
  FaUserEdit,
  FaChalkboardTeacher,
  FaSearch,
  FaFilter,
  FaSync
} from 'react-icons/fa';
import {
  Container,
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Dropdown,
  Badge,
  Row,
  Col
} from 'react-bootstrap';
import { loginpending } from '../../Redux/Loginslice';
import defaultlogo from '../../assest/defaultlogo.jpeg'

const FacultyList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { facultyinput, loading, error } = useSelector((state) => state.faculty);
  console.log(useSelector((state) => state.Login));
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getfacultypending());
    dispatch(loginpending());
  }, [dispatch]);

  // Apply filters whenever facultyinput or filter criteria change
  useEffect(() => {
    let result = facultyinput;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(faculty =>
        faculty.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.FacultyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.Department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter (works with both Status string or IsActive boolean)
    if (statusFilter !== 'all') {
      result = result.filter(faculty => {
        if (faculty.Status !== undefined) {
          return statusFilter === 'active'
            ? faculty.Status === 'Active'
            : faculty.Status === 'Inactive';
        } else {
          return statusFilter === 'active' ? faculty.IsActive : !faculty.IsActive;
        }
      });
    }

    setFilteredData(result);
  }, [facultyinput, searchTerm, statusFilter]);

  const handleEditClick = (facultyCode) => {
    navigate(`/edit/${facultyCode}`);
  };

  const handleRefresh = () => {
    dispatch(getfacultypending());
    setSearchTerm('');
    setStatusFilter('all');
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger">
        <Alert.Heading>Error loading faculty data</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={() => dispatch(getfacultypending())}>
          Retry
        </Button>
      </Alert>
    </Container>
  );

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Header className="text-white rounded-top" style={{
          background: "linear-gradient(135deg, #667eea 0%,rgb(111, 181, 238) 100%)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        }}>
          <Row className="align-items-center">
            <Col md={6}>
              <h4 className="mb-0 d-flex align-items-center">
                <FaChalkboardTeacher className="me-2" /> Faculty Management
              </h4>
            </Col>
            <Col md={6} className="text-md-end">
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleRefresh}
                className="me-2 hover:bg-white hover:bg-opacity-10 transition-all"
              >
                <FaSync className="me-1" /> Refresh
              </Button>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="bg-light">
          {/* Search and Filter Section */}
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <InputGroup>
                    <InputGroup.Text className="bg-white">
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, email, code or department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" className="w-100">
                      <FaFilter className="me-1" />
                      {statusFilter === 'all' ? 'Filter by Status' : `Status: ${statusFilter}`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      <Dropdown.Item onClick={() => setStatusFilter('all')}>All Status</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter('active')}>Active</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter('inactive')}>Inactive</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Faculty Table */}
          <Card className="shadow-sm">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-primary">
                  <tr>
                    <th>S.No</th>
                    <th>Faculty Code</th>
                    <th>Profile Picture</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((faculty, index) => (
                      <tr key={faculty.FacultyCode || index}>
                        <td>{index + 1}</td>
                        <td className="fw-bold">{faculty.FacultyCode}</td>
                        <td>
                          <td>
                            <img
                              src={
                                faculty.ProfilePicture
                                  ? `http://localhost:5000/${faculty.ProfilePicture}`
                                  :defaultlogo// Place this default image in /public/images
                              }
                              alt="Profile"
                              width="75"
                              height="90"
                              style={{ objectFit: 'cover' }}
                              className="rounded-circle border"
                            />
                          </td>

                        </td>
                        <td>{faculty.Username}</td>
                        <td>
                          <a href={`mailto:${faculty.Email}`}>{faculty.Email}</a>
                        </td>
                        <td>{faculty.Department}</td>
                        <td>
                          <Badge
                            pill
                            bg={faculty.Status === 'Active' || faculty.IsActive ? 'success' : 'secondary'}
                          >
                            {faculty.Status || (faculty.IsActive ? 'Active' : 'Inactive')}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditClick(faculty.FacultyCode)}
                            className="me-2"
                          >
                            <FaUserEdit className="me-1" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        {searchTerm || statusFilter !== 'all' ? (
                          'No matching faculty found. Try adjusting your search or filters.'
                        ) : (
                          'No faculty data available.'
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card>

          {/* Summary Info */}
          <div className="mt-3 text-muted small">
            Showing {filteredData.length} of {facultyinput.length} faculty members
            {(searchTerm || statusFilter !== 'all') && ' (filtered)'}
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FacultyList;



