import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Container, Button, Badge, Row, Col, Spinner, Form } from 'react-bootstrap';
import {
  Megaphone, Calendar, Download, FileEarmark,
  FileEarmarkImage, FileEarmarkPdf, FileEarmarkText,
  Inbox
} from 'react-bootstrap-icons';

const MyCirculars = () => {
  const [circulars, setCirculars] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [loading, setLoading] = useState(true);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:5000/Field/fieldget');
        setDepartments(res.data);
      } catch (err) {
        console.error('Failed to fetch departments:', err);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch circulars when department changes
  useEffect(() => {
    const fetchCirculars = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/circular/my-circulars', {
          withCredentials: true,
          params: {
            department: selectedDept
          }
        });
        setCirculars(res.data);
      } catch (err) {
        console.error('Error fetching circulars:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDept) fetchCirculars();
  }, [selectedDept]);

  const renderAttachment = (fileName) => {
    const fileUrl = `http://localhost:5000/uploads/circulars/${fileName}`;
    const ext = fileName.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    const isPDF = ext === 'pdf';
    const isDoc = ['doc', 'docx', 'txt'].includes(ext);

    const renderBadge = () => {
      let icon, variant;
      if (isImage) {
        icon = <FileEarmarkImage className="me-1" />;
        variant = 'primary';
      } else if (isPDF) {
        icon = <FileEarmarkPdf className="me-1" />;
        variant = 'danger';
      } else {
        icon = <FileEarmarkText className="me-1" />;
        variant = 'secondary';
      }
      return (
        <Badge pill bg={variant} className="d-inline-flex align-items-center py-2">
          {icon}{ext.toUpperCase()}
        </Badge>
      );
    };

    return (
      <div className="mt-3 border-top pt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="text-muted fw-semibold d-flex align-items-center mb-0">
            <FileEarmark className="me-2" /> Attachment
          </h6>
          {renderBadge()}
        </div>

        <div className="bg-light rounded-3 p-3 border">
          {isImage ? (
            <div className="text-center">
              <img src={fileUrl} alt="Circular" className="img-fluid rounded border" style={{ maxHeight: '300px' }} />
            </div>
          ) : isPDF ? (
            <iframe
              src={fileUrl}
              title="PDF Preview"
              width="100%"
              height="300px"
              className="border rounded"
            />
          ) : (
            <div className="d-flex align-items-center justify-content-between p-2">
              <div className="d-flex align-items-center">
                <FileEarmarkText size={24} className="text-secondary me-3" />
                <span className="text-truncate fw-medium">{fileName}</span>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end mt-3">
            <Button
              variant="outline-primary"
              size="sm"
              href={fileUrl}
              target="_blank"
              className="me-2 d-flex align-items-center px-3"
            >
              <FileEarmark className="me-2" /> View
            </Button>
            <Button
              variant="primary"
              size="sm"
              href={fileUrl}
              download
              className="d-flex align-items-center px-3"
            >
              <Download className="me-2" /> Download
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container className="py-4 px-lg-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
            <Megaphone size={28} className="text-primary" />
          </div>
          <div>
            <h1 className="h2 fw-bold mb-0">My Circulars</h1>
            <p className="text-muted mb-0">Important announcements and documents</p>
          </div>
        </div>
        <Badge pill bg="light" text="dark" className="fs-6 py-2 px-3 border">
          {circulars.length} {circulars.length === 1 ? 'Item' : 'Items'}
        </Badge>
      </div>

      {/* Department Filter */}
      <div className="mb-4">
        <Form.Label className="fw-semibold">Filter by Department</Form.Label>
        <Form.Select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          <option value="All">All Departments</option>
          {departments.map((d) => (
            <option key={d.FieldId} value={d.FieldName}>
              {d.FieldName} ({d.DegreeName})
            </option>
          ))}
        </Form.Select>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : circulars.length === 0 ? (
        <div className="text-center py-5 my-5">
          <Inbox size={48} className="text-muted mb-3 opacity-75" />
          <h4 className="text-muted fw-normal mb-2">No circulars available</h4>
          <p className="text-muted">You don't have any circulars at the moment.</p>
        </div>
      ) : (
        <Row>
          {circulars.map(c => (
            <Col key={c.CircularID} lg={6} className="mb-4">
              <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <Card.Header className="bg-primary bg-opacity-10 py-3 d-flex align-items-center border-0">
                  <div className="bg-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center">
                    <Megaphone size={20} className="text-white" />
                  </div>
                  <div className="w-100">
                    <div className="d-flex justify-content-between align-items-start">
                      <Card.Title className="mb-0 fw-bold text-dark">{c.Title}</Card.Title>
                      <Badge
                        pill
                        bg={new Date(c.ValidTill) > new Date() ? "success" : "danger"}
                        className="d-flex align-items-center py-2 px-3"
                      >
                        {new Date(c.ValidTill) > new Date() ? "Active" : "Expired"}
                      </Badge>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="pb-1 pt-4">
                  <Card.Text className="text-gray-700 mb-4 lh-base">{c.Description}</Card.Text>
                  {c.FileAttachment && renderAttachment(c.FileAttachment)}
                </Card.Body>

                <Card.Footer className="bg-white d-flex justify-content-between align-items-center border-top-0 pt-0 pb-3">
                  <small className="text-muted d-flex align-items-center">
                    <Calendar className="me-2 text-danger" size={16} />
                    <span className="fw-medium">Valid Till:</span>
                    <span className="ms-1">{formatDate(c.ValidTill)}</span>
                  </small>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyCirculars;


