import React from "react";
import "../css/Footer.css";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-contact-card">
        <div className="footer-box">
          <FaMapMarkerAlt className="footer-icon" />
          <h4>Address</h4>
          <p>
            CrownRidge Campus, Pollachi Road,<br />
            Coimbatore, Tamil Nadu, India - 641021.
          </p>
        </div>

        <div className="footer-box">
          <FaPhoneAlt className="footer-icon" />
          <h4>Admission Hotline</h4>
          <p>+91 948 844 8909</p>
        </div>

        <div className="footer-box">
          <FaMapMarkerAlt className="footer-icon" />
          <h4>Email Address</h4>
          <p>admission@crownridge.in</p>
        </div>
      </div>

      <div className="footer-bottom-bar">
        © 2025 <span className="brand">CrownRidge</span>.All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
