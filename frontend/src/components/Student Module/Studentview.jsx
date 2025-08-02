import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getstudentpending } from '../../Redux/studentslice';
import { FaUserEdit, FaUserGraduate, FaSearch, FaPlus } from 'react-icons/fa';
import { Container, Card, Table, Button, Spinner, Form, Image } from 'react-bootstrap';

const Studentview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studata, loading } = useSelector((state) => state.students);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    dispatch(getstudentpending());
  }, [dispatch]);

  // Filter students based on search term
  useEffect(() => {
    if (!studata) return;

    let result = [...studata];

    if (searchTerm) {
      result = result.filter(student =>
        (student.Username && student.Username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.Email && student.Email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.StudentCode && student.StudentCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.Department && student.Department.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredStudents(result);
  }, [studata, searchTerm]);

  const handleEditClick = (studentCode) => {
    navigate(`/studentedit/${studentCode}`);
  };

  const handleAddNew = () => {
    navigate('/studentadd');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h4 className="mb-0 d-flex align-items-center">
              <FaUserGraduate className="me-2 text-primary" />
              Student Management
            </h4>

            <div className="d-flex mt-2 mt-md-0">
              <div className="position-relative me-2 flex-grow-1" style={{ minWidth: '250px' }}>
                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="search"
                  placeholder="Search by name, email, code or department..."
                  className="ps-5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* <Button
                variant="primary"
                onClick={handleAddNew}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-1" /> Add New
              </Button> */}
            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="text-center">S.No</th>
                  <th>Student Code</th>
                  <th>Profile</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student.StudentCode || index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="fw-bold">{student.StudentCode}</td>
                      <Image
                        src={`http://localhost:5000/${student.ProfilePicture}`}  // prepend base URL here
                        roundedCircle
                        width={80}
                        height={80}
                        alt="Profile"
                        className="border"
                        style={{ objectFit: 'cover' }}
                      />

                      <td>{student.Username}</td>
                      <td>
                        <a href={`mailto:${student.Email}`} className="text-decoration-none">
                          {student.Email}
                        </a>
                      </td>
                      <td>{student.Department}</td>
                      <td className="text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditClick(student.StudentCode)}
                          className="d-inline-flex align-items-center"
                        >
                          <FaUserEdit className="me-1" /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {studata.length === 0 ? 'No students found' : 'No matching students found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          <Card.Footer className="bg-white text-muted py-2">
            <div className="d-flex justify-content-between align-items-center">
              <span>Showing {filteredStudents.length} of {studata.length} students</span>
              <small>Click on email to contact student</small>
            </div>
          </Card.Footer>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Studentview;