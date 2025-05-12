import React, { useState, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Header.css';

function Header({ onMenuClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Fetch suggestions on input
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        const res = await axios.get(`/api/search?query=${searchTerm}`);
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300); // debounce input
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/search?query=${searchTerm}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setShowSuggestions(false);
    if (item.type === 'user') {
      navigate(`/profile/${item.id}`);
    } else if (item.type === 'post') {
      navigate(`/post/${item.id}`);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick}>
          <FaBars />
        </button>
        <Link to="/">
          <img
            src="/skill_craft_logo.png"
            alt="SkillCraft Logo"
            className="logo"
          />
        </Link>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search SkillCraft..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay hiding to allow click
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSuggestionClick(item)}
                className="suggestion-item"
              >
                {item.type === 'user' ? `👤 ${item.username}` : `#️⃣ ${item.tag || item.title}`}
              </li>
            ))}
          </ul>
        )}
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
