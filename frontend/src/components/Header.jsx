import React, { useState } from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // ✅ Import Link
import '../styles/Header.css';

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
        <Link to="/profile">
          <FaUserCircle className="icon profile-icon" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
