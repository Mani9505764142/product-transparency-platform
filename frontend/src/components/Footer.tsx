import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Product Transparency</h3>
          <p>Building trust through transparency in product information.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">My Products</a></li>
            <li><a href="/">Add Product</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>AI-Powered Questions</li>
            <li>Transparency Scoring</li>
            <li>PDF Report Generation</li>
            <li>User Isolation</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li>📧 support@demo.com</li>
            <li>🌐 www.demo.com</li>
            <li>📱 +1 (555) 123-4567</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Product Transparency Platform. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <span>•</span>
          <a href="/terms">Terms of Service</a>
          <span>•</span>
          <a href="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
