import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getstudentpending } from '../../Redux/studentslice';
import { FaUserEdit, FaUserGraduate } from 'react-icons/fa';
import { Container, Card, Table, Button, Spinner } from 'react-bootstrap';

const Studentview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studata, loading} = useSelector((state) => state.students);

  useEffect(() => {
    dispatch(getstudentpending());
  }, [dispatch]);

  const handleEditClick = (studentCode) => {
    navigate(`/studentedit/${studentCode}`);
  };

  if (loading) return (
    <div className="d-flex justify-content-center mt-5">
      <Spinner animation="border" variant="primary" />
    </div>
  );

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-white border-bottom-0">
          <h4 className="mb-0 d-flex align-items-center">
            <FaUserGraduate className="me-2 text-primary" />
            Student List
          </h4>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table striped bordered hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>S.No</th>
                  <th>Student Code</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {studata.map((student, index) => (
                  <tr key={student.StudentCode || index}>
                    <td>{index + 1}</td>
                    <td>{student.StudentCode}</td>
                    <td>{student.Username}</td>
                    <td>{student.Email}</td>
                    <td>{student.Department}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEditClick(student.StudentCode)}
                      >
                        <FaUserEdit className="me-1" /> Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Studentview;