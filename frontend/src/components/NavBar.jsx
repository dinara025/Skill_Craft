import React, { useEffect, useRef } from 'react';
import { FaHome, FaUsers, FaBook, FaBell, FaCog, FaPlusCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // <-- import this
import '../styles/NavBar.css';

function NavBar({ onClose }) {
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="sidebar-overlay">
      <div className="sidebar" ref={sidebarRef}>
        <div className="sidebar-logo">
          <img src="/skill_craft_logo.png" alt="SkillCraft" />
        </div>

        <nav className="sidebar-nav">
          <Link to="/" className="nav-item">
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
          <Link to="/communities" className="nav-item">
            <FaUsers className="nav-icon" />
            <span>Communities</span>
          </Link>
          <Link to="/learning" className="nav-item">
            <FaBook className="nav-icon" />
            <span>Learning</span>
          </Link>
          <Link to="/notifications" className="nav-item">
            <FaBell className="nav-icon" />
            <span>Notifications</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <Link to="/create-post" className="nav-item create-post">
            <FaPlusCircle className="nav-icon" />
            <span>Create Post</span>
          </Link>
          <Link to="/settings" className="nav-item">
            <FaCog className="nav-icon" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
