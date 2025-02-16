import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer hdv-container">
      <div className="footer-content">
        <p>Copyrights 2024–25. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <span>|</span>
          <a href="/terms">Terms</a>
          <span>|</span>
          <a href="/infringement">Infringement</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
