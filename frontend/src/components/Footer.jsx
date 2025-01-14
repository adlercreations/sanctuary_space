// frontend/src/components/Footer.jsx
import React from 'react';
import '../styles/Footer.css'; // optional for styling

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>© 2025 Sanctuary Space. All rights reserved.</p>
        {/* If you want social links or disclaimers, add them here */}
      </div>
    </footer>
  );
}

export default Footer;