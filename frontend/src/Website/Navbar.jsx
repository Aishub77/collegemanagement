import React from 'react';
import '../css/Navbar.css'
import logo from '../assest/newlogo1.png'; // Replace with your logo
import Home from './Home';
import Course from '../components/Course';
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
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/About">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/course">Courses</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/admission">Admission</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/placement">Placements</a>
              </li>
              {/* <li className="nav-item">
                <a className="nav-link" href="/facilities">Campus Life</a>
              </li> */}
              <li className="nav-item">
                <a className="nav-link" href="/gallery">Gallery</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Home/>
      <VisionMission/>
      <Course/>
      <PlacementStats/>
      <Footer/>
    </div>
  );
};

export default Navbar;
