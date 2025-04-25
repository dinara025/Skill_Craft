import React, { useState } from 'react';
import '../styles/Header.css';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';

function Header({ onMenuClick }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick}>
          <FaBars />
        </button>
        <img src="/skill_craft_logo.png" alt="SkillCraft Logo" className="logo" />
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search SkillCraft..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <div className="header-right">
        <FaBell className="icon" />
        <FaUserCircle className="icon profile-icon" />
      </div>
    </header>
  );
}

export default Header;
