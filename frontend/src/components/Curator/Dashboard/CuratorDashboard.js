import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import './Curatordashboard.css';
import RSLogo from './RSLogo.png';
import Cookies from 'js-cookie';


import InternData from '../intern_data/internData';
import GuestData from '../intern_data/guestData';
import CuratorStudentDetails from '../intern_data/CuratorStudentData';

import { Dropdown } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';



const CuratorDash = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedView, setSelectedView] = useState('allInterns');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  const name = Cookies.get('name');
  const CID = Cookies.get('CID');
  console.log(name, CID)
  const { '*': currentPath } = useParams();

  const menuItems = [
    { id: 'allInterns', name: 'All Interns', icon: 'fas fa-list' },
    { id: 'allGuests', name: 'All Guests', icon: 'fas fa-list' },
  ];

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2) {
      const view = pathParts[2];
      setSelectedView(view);
    }
  }, [location]);

  const handleMenuItemClick = (id) => {
    setSelectedView(id);
    navigate(`/curator/${id}`);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const logout = () => {
    Object.keys(Cookies.get()).forEach(cookieName => {
      Cookies.remove(cookieName);
    });

    navigate("/")
  }


  const renderMenuItem = (item) => (
    <li key={item.id} className="menu-item-container">
      <div
        className={`menu-item ${selectedView === item.id ? 'active' : ''}`}
        onClick={() => handleMenuItemClick(item.id)}
      >
        <i className={item.icon}></i>
        {isSidebarOpen && <span>{item.name}</span>}
      </div>
    </li>
  );

  const renderContent = () => {

    if (currentPath.startsWith('student/')) {
      const candidateID = currentPath.split('/')[1];
      return (
        <CuratorStudentDetails candidateID={candidateID} />
      );
    }

    switch (selectedView) {

      case 'allInterns':
        return <InternData />;

      case 'allGuests':
        return <GuestData />

      default:
        return <InternData />;
    }
  };

  return (

    <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <nav className={`SA_side-nav ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="logo">
          {isSidebarOpen ? <img className="logo-img" src={RSLogo} alt='text' /> : ''}

        </div>
        <button className="SA-toggle-button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
        </button>
        <div className='icons-container'>
          <ul style={{ fontSize: "15px", fontWeight: "bold", fontFamily: "Avantgarde, TeX Gyre Adventor, URW Gothic L, sans-serif" }}>
            {menuItems.map(renderMenuItem)}
          </ul>
        </div>
      </nav>
      <div className={`main-content ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
        <div className="top-panel" >
          <Dropdown.Item className="p">{name}</Dropdown.Item>
          <button
            onClick={logout}
            className="btn bg-transparent logout-btn fw-bold ml-5 w-100 pt-0"
            style={{ color: 'white', marginRight: "30px" }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
        {renderContent()}
        <Outlet />
      </div>
    </div>
  );
};

export default CuratorDash;
