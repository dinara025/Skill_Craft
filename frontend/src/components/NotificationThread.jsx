import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/NotificationThread.css';

function NotificationThread({ userId, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!userId) {
        console.warn('No userId provided, skipping notification fetch');
        setLoading(false);
        setError('User ID is missing. Please log in.');
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.warn('No JWT token found in localStorage');
        setLoading(false);
        setError('Authentication token is missing. Please log in.');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching notifications for userId:', userId);
        console.log('JWT Token payload:', JSON.parse(atob(token.split('.')[1])));
        const res = await axios.get(`http://localhost:8080/api/auth/notifications/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const notifs = res.data;
        console.log('Fetched notifications:', notifs);
        setNotifications(Array.isArray(notifs) ? notifs : []);
        setLoading(false);

        // Mark unread notifications as read
        const unreadIds = notifs.filter(n => !n.isRead).map(n => n.id);
        if (unreadIds.length > 0) {
          console.log(`Marking notifications as read: ${unreadIds.join(', ')}`);
          try {
            const markRes = await axios.patch(
              `http://localhost:8080/api/auth/notifications/mark-read`,
              { notificationIds: unreadIds },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log('Mark read response:', markRes.data);
            // Update local state to reflect read status
            setNotifications(prev => prev.map(n => 
              unreadIds.includes(n.id) ? { ...n, isRead: true } : n
            ));
          } catch (markError) {
            console.error('Error marking notifications as read:', markError);
            if (markError.response?.status === 401 || markError.response?.status === 403) {
              setError('Session expired. Please log in again.');
              navigate('/login');
            } else {
              setError('Failed to mark notifications as read. Please try again.');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
          if (err.response.status === 401 || err.response.status === 403) {
            setError('Session expired. Please log in again.');
            navigate('/login');
          } else {
            setError('Failed to fetch notifications. Please try again.');
          }
        } else {
          setError('Network error. Please check your connection.');
        }
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId, navigate]);

  const handleNotificationClick = (notification) => {
    onClose();
    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    }
  };

  return (
    <div className="notification-thread">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button onClick={onClose} className="close-button">×</button>
      </div>
      {error ? (
        <p className="error">{error}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <span>
                {notification.type === 'like'
                  ? `${notification.senderUsername || notification.senderId} liked your post`
                  : `${notification.senderUsername || notification.senderId} commented on your post`}
              </span>
              <span className="notification-time">
                {new Date(notification.timestamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationThread;