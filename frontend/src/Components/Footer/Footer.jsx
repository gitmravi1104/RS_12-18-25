import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-container  ">
        <div className="footer-links">
          <a href="https://qualitythought.in/about-us/">About Us</a>
          <a href="https://qualitythought.in/blog/">Our Blog</a>
          <a href="https://qualitythought.in/contact-us/">Contact Us</a>
          <a href="https://qualitythought.in/careers/">Career</a>
        </div>
        <hr className="footer-divider" />
        <div className="footer-logo-section">
          <img
            className="footer-logo"
            src="https://qualitythought.in/wp-content/uploads/2019/02/Quality_thought_logo_white.png"
            alt="Quality Thought White Logo"
          />
          <p className="footer-info">
            <a href="">All Rights Reserved Quality Thought Infosystems India Pvt. Ltd.</a>
            {/* <br />
          <a href="https://qualitythought.in/page-sitemap.xml">Sitemap</a>&nbsp;|&nbsp;
          <a href="https://qualitythought.in/faq/">FAQs</a>&nbsp;|&nbsp;
          <a href="https://qualitythought.in/cancellation_and_refund/">Cancellation & Refunds</a>&nbsp;|&nbsp;
          <a href="https://qualitythought.in/privacy_policy/">Privacy Policy</a>&nbsp;|&nbsp;
          <a href="https://qualitythought.in/terms_and_conditions/">Terms & Conditions</a>&nbsp;|&nbsp;
          <a href="https://qualitythought.in/feedback/">Feedback</a>
          <br /> */}
            {/* *Note: The certification names and logos are the trademarks of their respective owners. */}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
