import React from 'react';
import { Link } from "react-router-dom";
import './Header.css';

function Header() {
  return (

    <nav className="navbar navbar-expand bg-body-tertiary">
      <div className="container">
        <div className='navbar-brand'>
          <img src='https://qualitythought.in/wp-content/uploads/2024/02/Quality_thought_logo.png' alt='logo' />
        </div>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ms-auto">
            <Link className="nav-item text-decoration-none" to={"https://qualitythought.in/contact-us/"} target='_blank'>
              <button className="nav-link" id='contactus_btn'>Contact Us</button>
            </Link>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header
