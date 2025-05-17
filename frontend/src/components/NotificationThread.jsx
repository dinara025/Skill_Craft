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
        setError('Please log in to view notifications.');
        setLoading(false);
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/auth/notifications/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const notifs = res.data;
        console.log('Fetched notifications:', JSON.stringify(notifs, null, 2)); // Detailed debug log
        setNotifications(Array.isArray(notifs) ? notifs : []);
        setLoading(false);

        // Mark unread notifications as read
        const unreadIds = notifs.filter(n => !n.read).map(n => n.id);
        if (unreadIds.length > 0) {
          try {
            await axios.put(
              `http://localhost:8080/api/auth/notifications/mark-read`,
              { notificationIds: unreadIds },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
            setNotifications(prev => prev.map(n => 
              unreadIds.includes(n.id) ? { ...n, read: true } : n
            ));
          } catch (markError) {
            console.error('Error marking notifications as read:', markError);
            setError('Failed to update notifications. Please try again.');
          }
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Session expired. Please log in again.');
          navigate('/login');
        } else {
          setError('Unable to load notifications. Please try again later.');
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
          {notifications.map(notification => {
            // Ensure notification has required fields
            const message = notification.message || '';
            const senderUsername = notification.senderUsername || 'Someone';
            const type = notification.type || 'unknown';

            // Construct display message
            let displayMessage = message;
            if (message.includes('liked your post') || message.includes('commented on your post')) {
              displayMessage = message;
            } else {
              const action = type === 'like' ? 'liked' : type === 'comment' ? 'commented on' : 'interacted with';
              displayMessage = `${senderUsername} ${action} your post`;
            }

            return (
              <li
                key={notification.id}
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <span>{displayMessage}</span>
                <span className="notification-time">
                  {new Date(notification.timestamp).toLocaleString()}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default NotificationThread;