import React from 'react';
import '../css/Navbar.css';
import logo from '../assest/newlogo1.png'; // Replace with your logo
import Home from './Home';
import Course from './Course';
import VisionMission from './VisionMission';
import { Link } from 'react-router-dom';
import PlacementStats from './PlacementStats';
import Footer from './Footer';

const Navbar = () => {
  return (
    <div>
      {/* Header with logo and tagline centered */}
      <div className="header text-center py-3">
        <img src={logo} alt="College Logo" className="college-logo mb-2" />
        <h2 className="college-name">CrownRidge Arts & Science College</h2>
        <p className="tagline">"Empowering Minds, Enriching Futures"</p>
      </div>

      {/* Navigation Bar */}
      <nav className="main-navbar navbar navbar-expand-lg navbar-dark justify-content-center">
        <div className="container-fluid justify-content-center">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <a className="nav-link" href="#home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#about">About Us</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#course">Courses</a>
              </li>
              <li className="nav-item">
               <Link className="nav-link" to="/admission">Admission</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#placement">Placements</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Section Wrappers with IDs for smooth scrolling */}
      <div id="home">
        <Home />
      </div>
      <div id="about">
        <VisionMission />
      </div>
      <div id="course">
        <Course />
      </div>
      <div id="placement">
        <PlacementStats />
      </div>
      {/* <div id="admission"> */}
        {/* Add your admission component here if any, or dummy content */}
        {/* <div className="p-5 text-center bg-light">
          <h2>Admission Section</h2>
          <p>Admission information goes here...</p>
        </div>
      </div> */}

      <Footer />
    </div>
  );
};

export default Navbar;
