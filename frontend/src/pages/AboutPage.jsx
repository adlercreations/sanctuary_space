// frontend/src/pages/AboutPage.jsx
import React from 'react';
import '../styles/AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      <div className="daytime-motif" />
      <h1>About Sanctuary Space</h1>
      <div className="about-content">
        <p>
          Our mission is to help you find peace, stillness, and comfort 
          by providing high-quality products that enhance your well-being.
        </p>
        <p>
          We envision a community where everyone can share resources, 
          experiences, and uplifting ideas.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
