import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Table, Form, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AppList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cutoff, setCutoff] = useState('');
  const [reservationFilter, setReservationFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [reservationFilter]);

  useEffect(() => {
    const filtered = applications.filter(app =>
      ((app.FullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (app.Email?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
      (!cutoff || parseFloat(app.Percentage) >= parseFloat(cutoff))
    );
    setFilteredApps(filtered);
  }, [searchTerm, cutoff, applications]);

  const fetchApplications = async () => {
    try {
      const query = reservationFilter !== 'All' ? `?filter=${reservationFilter}` : '';
      const res = await axios.get(`http://localhost:5000/applist/applications/summary${query}`);
      setApplications(res.data);
      setFilteredApps(res.data);
    } catch (error) {
      console.error('Error Fetching Application', error);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/applist/applications/${id}`);
      setSelectedApp(res.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching application details', err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/applist/applications/status/${id}`, {
        status: status
      });
      toast.success(`Status updated to ${status}`);
      fetchApplications(); // refresh UI after update
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Student Applications</h3>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <Form.Control
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <Form.Control
            type="number"
            placeholder="Filter by Percentage (e.g. 70)"
            value={cutoff}
            onChange={(e) => setCutoff(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <Form.Select value={reservationFilter} onChange={(e) => setReservationFilter(e.target.value)}>
            <option value="All">All Applications</option>
            <option value="SportsQuota">Sports Quota</option>
            <option value="PhysicallyChallenged">Physically Challenged</option>
            <option value="ExServiceman">Ex-Servicemen</option>
          </Form.Select>
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Degree</th>
            <th>Field</th>
            <th>Board</th>
            <th>Year</th>
            <th>%</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredApps.length > 0 ? (
            filteredApps.map(app => (
              <tr key={app.ApplicationID}>
                <td>{app.FullName}</td>
                <td>{app.Email}</td>
                <td>{app.Degree}</td>
                <td>{app.Field}</td>
                <td>{app.Board}</td>
                <td>{app.PassingYear}</td>
                <td>{app.Percentage}</td>
                <td>
                  <Badge bg={
                    app.ApplicationStatus === 'Shortlisted' ? 'success' :
                      app.ApplicationStatus === 'Rejected' ? 'danger' :
                        'secondary'
                  }>
                    {app.ApplicationStatus || 'Pending'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleView(app.ApplicationID)}
                    className="me-2"
                  >
                    View
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStatusUpdate(app.ApplicationID, 'Shortlisted')}
                    disabled={app.ApplicationStatus === 'Shortlisted'}
                    className="me-2"
                  >
                    Shortlist
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleStatusUpdate(app.ApplicationID, 'Rejected')}
                    disabled={app.ApplicationStatus === 'Rejected'}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No applications found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal to View Application Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApp ? (
            <div>
              <p><strong>Name:</strong> {selectedApp.FirstName} {selectedApp.LastName}</p>
              <p><strong>Email:</strong> {selectedApp.Email}</p>
              <p><strong>Phone:</strong> {selectedApp.Phone}</p>
              <p><strong>Address:</strong> {selectedApp.Address}, {selectedApp.City}, {selectedApp.State} - {selectedApp.Pin}</p>
              <p><strong>Degree:</strong> {selectedApp.Degree} | <strong>Field:</strong> {selectedApp.Field}</p>
              <p><strong>Board:</strong> {selectedApp.Board}, <strong>Year:</strong> {selectedApp.PassingYear}, <strong>Percentage:</strong> {selectedApp.Percentage}</p>
              <p><strong>Category:</strong> {selectedApp.Category}</p>

              <hr />

              <h5>Special Reservations</h5>
              <ul>
                <li>Sports Quota: {selectedApp.SportsQuota ? '✅ Yes' : '❌ No'}</li>
                <li>Physically Challenged: {selectedApp.PhysicallyChallenged ? '✅ Yes' : '❌ No'}</li>
                <li>Ex-Serviceman: {selectedApp.ExServiceman ? '✅ Yes' : '❌ No'}</li>
              </ul>

              <hr />

              <h5>Uploaded Documents</h5>
              <ul>
                <li>
                  <strong>Marksheet:</strong>{' '}
                  {selectedApp.MarksheetPath ? (
                    <a
                      href={`http://localhost:5000/${selectedApp.MarksheetPath.replace(/^uploads[\\/]/, 'uploads/')}`}
                      target="_blank"
                      rel="noopener noreferrer" >
                      View Marksheet
                    </a>
                  ) : (
                    'Not Uploaded'
                  )}
                </li>

                {selectedApp.SportsQuota && selectedApp.SportsQuotaDocPath && (
                  <li>
                    <strong>Sports Quota Doc:</strong>{' '}
                    <a
                      href={`http://localhost:5000/${selectedApp.SportsQuotaDocPath.replace(/^uploads[\\/]/, 'uploads/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Sports Document
                    </a>
                  </li>
                )}

                {selectedApp.PhysicallyChallenged && selectedApp.PhysicallyChallengedDocPath && (
                  <li>
                    <strong>Physically Challenged Doc:</strong>{' '}
                    <a
                      href={`http://localhost:5000/${selectedApp.PhysicallyChallengedDocPath.replace(/^uploads[\\/]/, 'uploads/')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Disability Document
                    </a>
                  </li>
                )}

                {selectedApp.ExServiceman && selectedApp.ExServicemanDocPath && (
                  <li>
                    <strong>Ex-Serviceman Doc:</strong>{' '}
                    <a
                      href={`http://localhost:5000/${selectedApp.ExServicemanDocPath.replace(/^uploads[\\/]/, 'uploads/')}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      View Service Document
                    </a>
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AppList