import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';
import '../styles/newMessageForm.css';

const NewMessageForm = ({ threadId, onMessagePosted }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const senderId = localStorage.getItem('jwtUsername');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    console.log("📤 Posting message with:", {
      threadId,
      senderId,
      message
    });

    try {
      const res = await axios.post('http://localhost:8080/api/messages', {
        threadId,
        senderId,
        message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onMessagePosted(res.data);
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('❌ Error posting message:', err);
      setError(err.response?.data?.message || 'Failed to post message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false && !isSubmitting) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="new-message-container">
      <form onSubmit={handleSubmit} className="message-form">
        <h3 className="form-title">Post Your Reply</h3>
        
        <div className="form-group">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Write your thoughtful reply here..."
            rows={4}
            className="message-input"
            disabled={isSubmitting}
          />
          <div className="form-footer">
            <small className={`character-count ${message.length > 500 ? 'warning' : ''}`}>
              {message.length}/500
            </small>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Message posted successfully!</div>}
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !message.trim()}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="spinner-icon" />
              Posting...
            </>
          ) : (
            <>
              <FaPaperPlane className="send-icon" />
              Post Reply
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NewMessageForm;