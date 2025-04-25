import React, { useEffect, useRef } from 'react';
import { FaHome, FaUsers, FaBook, FaBell, FaCog, FaPlusCircle } from 'react-icons/fa';
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
          <a href="#" className="nav-item">
            <FaHome className="nav-icon" />
            <span>Home</span>
          </a>
          <a href="#" className="nav-item">
            <FaUsers className="nav-icon" />
            <span>Communities</span>
          </a>
          <a href="#" className="nav-item">
            <FaBook className="nav-icon" />
            <span>Learning</span>
          </a>
          <a href="#" className="nav-item">
            <FaBell className="nav-icon" />
            <span>Notifications</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a href="/create-post" className="nav-item create-post">
            <FaPlusCircle className="nav-icon" />
            <span>Create Post</span>
          </a>
          <a href="#" className="nav-item">
            <FaCog className="nav-icon" />
            <span>Settings</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
