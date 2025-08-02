import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/CoursesOffered.css';

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/Field/fieldget')
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className='mainpage-section'>
    {/* <div className="courses-container"> */}
      <div className="courses-header">
        <h1>Courses We Offer</h1>
        <p>Explore our diverse academic programs designed to empower minds and enrich futures</p>
        <div className="header-divider"></div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course, index) => (
            <div className="course-card" key={index}>
              <div className="degree-highlight">
                <h3>{course.DegreeName}</h3>
              </div>
              
              <div className="course-content">
                <h2 className="course-title">{course.FieldName}</h2>
                <p className="course-description">
                  Advance your career with our {course.FieldName} program under {course.DegreeName}.
                </p>
                
                <div className="course-details">
                  <div className="detail-item">
                    <span className="detail-value">3 Years</span>
                    <span className="detail-label">Duration</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-value">6 Semesters</span>
                    <span className="detail-label">Program</span>
                  </div>
                </div>
              </div>
              
              <div className="course-footer">
                <button className="explore-btn">Explore Program</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
        {/* </div> */}
    </div>
  );
};

export default Course;