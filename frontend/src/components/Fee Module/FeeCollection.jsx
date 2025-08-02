// File: src/components/FeeCollection.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Card, Button, Form, Table, Alert } from 'react-bootstrap';

const FeeCollection = () => {
  const [studentCode, setStudentCode] = useState('');
  const [feeDetails, setFeeDetails] = useState(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/payment/${studentCode}`);
      setFeeDetails(res.data);
      setError('');
      setSuccess('');
    } catch (err) {
      setError('Student not found or server error');
      setFeeDetails(null);
    }
  };

  const handlePayment = async () => {
    try {
      await axios.post('http://localhost:5000/payment/pay', {
        StudentCode: feeDetails.student.StudentCode,
        FeeStructureID: feeDetails.student.FeeStructureID,
        YearOfStudy: feeDetails.student.YearOfStudy,
        TotalAmount: feeDetails.totalFee,
        PaidAmount: parseFloat(paidAmount)
      });
      setSuccess('Payment recorded successfully');
      setError('');
      setPaidAmount('');
      handleSearch(); // refresh payment info
    } catch (err) {
      setError('Failed to record payment');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">🎓 Fee Collection Portal</h3>
      <Card className="p-4 shadow-lg">
        <Form className="mb-3 d-flex">
          <Form.Control
            type="text"
            placeholder="Enter Student Code"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
          />
          <Button variant="primary" className="ms-2" onClick={handleSearch}>
            Search
          </Button>
        </Form>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {feeDetails && (
          <>
            <h5>👤 Student Info</h5>
            <p><strong>Name:</strong> {feeDetails.student.Username}</p>
            <p><strong>Course:</strong> {feeDetails.student.Course} / {feeDetails.student.Department}</p>
            <p><strong>Year:</strong> {feeDetails.student.YearOfStudy}</p>

            <h5 className="mt-4">💰 Fee Breakdown</h5>
            <Table bordered striped>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {feeDetails.feeComponents.map((c, i) => (
                  <tr key={i}>
                    <td>{c.ComponentName}</td>
                    <td>₹{c.Amount}</td>
                  </tr>
                ))}
                {/* <tr>
                  <td><strong>Tuition Fee</strong></td>
                  <td>₹{feeDetails.yearFee}</td>
                </tr> */}
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>₹{feeDetails.totalFee}</strong></td>
                </tr>
              </tbody>
            </Table>

            <h5 className="mt-3">🧾 Payment</h5>
            {feeDetails.payment && feeDetails.payment.PaymentStatus === 'Paid' ? (
              <Alert variant="success">
                ✅ Full Payment Done: ₹{feeDetails.payment.PaidAmount}
              </Alert>
            ) : (
              <>
                {feeDetails.payment && (
                  <Alert variant="info">
                    Already Paid: ₹{feeDetails.payment.PaidAmount} ({feeDetails.payment.PaymentStatus})<br />
                    Remaining Balance: ₹{feeDetails.totalFee - feeDetails.payment.PaidAmount}
                  </Alert>
                )}

                <Form.Group className="mb-2">
                  <Form.Control
                    type="number"
                    placeholder={`Enter amount to pay (max ₹${feeDetails.totalFee})`}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mb-2"
                  onClick={() =>
                    setPaidAmount(
                      feeDetails.totalFee - (feeDetails.payment?.PaidAmount || 0)
                    )
                  }>
                  Pay Full Balance
                </Button>
                <Button
                  variant="success"
                  onClick={handlePayment}
                  disabled={
                    parseFloat(paidAmount || 0) <= 0 ||
                    parseFloat(paidAmount) >
                    (feeDetails.totalFee - (feeDetails.payment?.PaidAmount || 0))
                  }>
                  Submit Payment
                </Button>
              </>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default FeeCollection;
