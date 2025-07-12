import React from "react";
import "../css/PlacementStats.css"; // Import the CSS
import bgImage from '../assest/placement_banner.jpg'; // Replace with your actual image path
import Footer from "./Footer";

const stats = [
  { count: "150+", label: "Number of Companies" },
  { count: "1500+", label: "Number of Students Placed" },
  { count: "93.12%", label: "Percentage of Students Placed" },
  { count: "₹58LPA", label: "Highest Salary" },
  { count: "80+", label: "International Internships" },
];

const PlacementStats = () => {
  return (
    <div
      className="placement-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay" />
      <div className="placement-content">
        <h2>CROWNRIDGE– PLACEMENTS STATISTICS</h2>
        <p>
          Explore limitless possibilities: Look where our talented alumni have soared!
        </p>

        <div className="stats-boxes">
          {stats.map((item, index) => (
            <div className="stat-box" key={index}>
              <h3>{item.count}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
     {/* <Footer/> */}
    </div>
  );
};

export default PlacementStats;
