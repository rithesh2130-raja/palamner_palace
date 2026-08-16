import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#" className="footer-link">Conditions of Use</a>
        <a href="#" className="footer-link">Privacy Notice</a>
        <a href="#" className="footer-link">Your Ads Privacy Choices</a>
      </div>
      <p>&copy; {new Date().getFullYear()} Amazon Clone. Developed for demo purposes using MERN Stack.</p>
    </footer>
  );
};

export default Footer;
