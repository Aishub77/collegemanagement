import React from 'react';
import '../css/VisionMission.css';

const VisionMission = () => {
  return (
    <section className="vm-wrapper">
      <div className="vm-container">
        <h2 className="vm-main-heading">Our Vision & Mission</h2>

        <div className="vm-card vision">
          <h3 className="vm-title">🌟 Vision</h3>
          <p className="vm-text">
            To become a center of excellence in Arts and Science education by fostering innovation, creativity, and lifelong learning that shapes globally responsible citizens.
          </p>
        </div>

        <div className="vm-card mission">
          <h3 className="vm-title">🎯 Mission</h3>
          <p className="vm-subtext">CrownRidge College of Arts and Science strives to:</p>
          <ul className="vm-list">
            <li>
              <span className="vm-icon">✔</span>
              Set high standards of ‘Quality Education’ by developing and guiding the students towards ‘Innovation and Excellence’.
            </li>
            <li>
              <span className="vm-icon">✔</span>
              Develop skill sets, core competence and positive attitude.
            </li>
            <li>
              <span className="vm-icon">✔</span>
              Attain leadership in Commerce, Computer Applications and Management Education.
            </li>
            <li>
              <span className="vm-icon">✔</span>
              Produce graduates of national standards, committed to integrity and professionalism with ethics.
            </li>
            <li>
              <span className="vm-icon">✔</span>
              Organize a pluralistic and supportive environment to stimulate scholars and contribute to ‘Nation Building’.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
