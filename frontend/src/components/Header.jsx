import React, { useState, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle, FaSearch, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationThread from './NotificationThread';
import { onMessageListener } from '../config/firebaseMessaging';
import '../styles/Header.css';

function Header({ onMenuClick, user, onSearch, onClearSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === '') {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(`http://localhost:8080/api/auth/posts/search-suggestions?query=${encodeURIComponent(searchTerm)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        setSuggestions(response.data.map(tag => ({ type: 'tag', value: tag })));
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching hashtag suggestions:', err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id) {
        console.warn('No user ID available for fetching unread notifications');
        setUnreadCount(0);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8080/api/auth/notifications/${user.id}/unread-count`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
        setUnreadCount(res.data.count || 0);
      } catch (err) {
        console.error('Error fetching unread notification count:', err);
        setUnreadCount(0);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      onMessageListener()
        .then((payload) => {
          console.log('Foreground FCM message:', payload);
          setUnreadCount((prev) => prev + 1);
          setShowNotifications(true);
        })
        .catch((err) => console.error('Error in onMessageListener:', err));
    }
  }, [user?.id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm);
      setShowSuggestions(false);
      navigate('/');
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchTerm(item.value);
    onSearch(item.value);
    setShowSuggestions(false);
    navigate('/');
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    onClearSearch();
  };

  const toggleNotifications = () => {
    if (!user?.id) {
      console.warn('Cannot open notifications: user is not logged in');
      navigate('/login');
      return;
    }
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    if (!user) {
      console.warn('Header: user prop is undefined. Check parent component.');
    } else if (!user.id) {
      console.warn('Header: user object exists but has no id field:', user);
    } else {
      console.log('Header: user prop received with id:', user.id);
    }
  }, [user]);

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
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="search-input"
          />
          {searchTerm && (
            <FaTimes
              className="clear-icon"
              onClick={handleClearSearch}
            />
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="suggestion-item"
              >
                #️⃣ {item.value}
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className="header-right">
        <div className="notification-wrapper">
          <FaBell
            className={`icon ${!user?.id ? 'disabled' : ''}`}
            onClick={toggleNotifications}
            title={user?.id ? 'View notifications' : 'Please log in to view notifications'}
          />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
          {showNotifications && user?.id && (
            <NotificationThread
              userId={user.id}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>
        <Link to={user?.id ? '/profile' : '/login'}>
          <FaUserCircle className="icon profile-icon" />
        </Link>
      </div>
    </header>
  );
}

export default Header;