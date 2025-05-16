import React, { useState, useEffect } from 'react';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationThread from './NotificationThread';
import { onMessageListener } from '../config/firebaseMessaging';
import '../styles/Header.css';

function Header({ onMenuClick, user }) {
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
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/search?query=${searchTerm}`);
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching search suggestions:', err);
        setSuggestions([]);
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

  const toggleNotifications = () => {
    if (!user?.id) {
      console.warn('Cannot open notifications: user is not logged in');
      navigate('/login');
      return;
    }
    setShowNotifications(!showNotifications);
  };

  // Log if user is missing for debugging
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
        <input
          type="text"
          placeholder="Search SkillCraft..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
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