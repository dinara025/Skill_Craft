import React, { useState } from 'react';
import axios from 'axios';

const NewMessageForm = ({ threadId, onMessagePosted }) => {
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('jwtToken');
  const senderId = localStorage.getItem('jwtUsername'); // or use user ID if stored

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

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
    } catch (err) {
      console.error('Error posting message:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your reply..."
        rows={3}
        style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
      />
      <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
        Post Reply
      </button>
    </form>
  );
};

export default NewMessageForm;
