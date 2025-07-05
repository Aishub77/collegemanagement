import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { 
  CheckCircleFill, 
  ShieldCheck,
  PersonBadge,
  ClipboardCheck,
  Envelope,
  Phone,
  InfoCircle
} from 'react-bootstrap-icons';
import instructionImg from '../../assest/imageinstruction.webp';
import { useNavigate } from 'react-router-dom';

const InstructionItem = ({ text, icon }) => {
  const IconComponent = icon;
  return (
    <li className="d-flex align-items-start mb-3">
      <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
        <IconComponent className="text-primary" size={18} />
      </div>
      <span className="text-dark">{text}</span>
    </li>
  );
};

const InstructionsSection = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleApplyClick = () => {
    navigate('/application');
  };

  const instructions = [
    { text: "Ensure stable internet connection", icon: ShieldCheck },
    { text: "Create account with valid email & mobile", icon: PersonBadge },
    { text: "Name & DOB must match educational certificates", icon: ClipboardCheck },
    { text: "Keep softcopies of Photo and MarkSheet ready", icon: ClipboardCheck },
    { text: "OTP verification for email & mobile", icon: Envelope },
    { text: "Check junk/spam folder for emails", icon: InfoCircle },
    { text: "Redirected to dashboard after registration", icon: ShieldCheck },
    { text: "OTP login available for re-access", icon: Phone },
    { text: "All communications via Embase Pro Suit Portal", icon: Envelope }
  ];

  return (
    <section className="py-4">
      <Container>
        <Row className="align-items-center g-5">
          <Col md={6} className="order-md-2">
            <div 
              className="position-relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary rounded-4" 
                   style={{
                     transform: isHovered ? 'rotate(3deg)' : 'rotate(0)',
                     transition: 'transform 0.3s ease',
                     zIndex: -1
                   }} 
              />
              <img 
                src={instructionImg} 
                alt="Application Process" 
                className="img-fluid rounded-4 shadow-lg position-relative"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.3s ease',
                  border: '3px solid white',
                  maxHeight: '450px',
                  width: '100%',
                  objectFit: 'cover'
                }} 
              />
            </div>
          </Col>

          <Col md={6} className="order-md-1">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary p-2 rounded-circle me-3">
                <ClipboardCheck size={24} className="text-white" />
              </div>
              <h2 className="fw-bold mb-0 text-primary">Application Instructions</h2>
            </div>
            
            <p className="text-muted mb-4">
              Follow these guidelines carefully for a successful application process
            </p>
            
            <ul className="list-unstyled">
              {instructions.map((item, index) => (
                <InstructionItem key={index} text={item.text} icon={item.icon} />
              ))}
            </ul>
            
            <div className="bg-primary bg-opacity-10 p-3 rounded-3 mt-4 mb-4">
              <div className="d-flex align-items-center">
                <InfoCircle className="text-primary me-2" size={20} />
                <span className="fw-medium text-primary">Important:</span>
              </div>
              <p className="mb-0 mt-2">
                All information must match official documents. Incorrect details may lead to rejection.
              </p>
            </div>
            
            <Button 
              variant="primary" 
              size="lg"
              className="w-100 py-3 fw-bold shadow"
              onClick={handleApplyClick}>
              Start Apply Now
            </Button>
            <p className="text-center text-muted mt-2 mb-0">
              Estimated completion: 15-20 minutes
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default InstructionsSection;