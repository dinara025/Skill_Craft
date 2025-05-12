import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewMessageForm from './NewMessageForm';
import '../styles/threads.css';

const ThreadView = ({ thread }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!thread?.id) return;

    const token = localStorage.getItem('jwtToken');

    axios.get(`http://localhost:8080/api/messages/${thread.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log("✅ Messages fetched:", res.data);
      setMessages(res.data);
    })
    .catch(err => console.error('Error fetching messages:', err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thread]);

  const handleNewMessage = () => {
    if (!thread?.id) return;

    const token = localStorage.getItem('jwtToken');

    axios.get(`http://localhost:8080/api/messages/${thread.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setMessages(res.data))
    .catch(err => console.error('Error fetching messages:', err));
  };

  if (!thread || !thread.id) {
    return (
      <div className="thread-view">
        <p style={{ color: 'gray' }}>Loading thread...</p>
      </div>
    );
  }

  return (
    <div className="thread-view">
      <h2>{thread.title}</h2>
      <p>{thread.description}</p>
      <p><small>Tags: {thread.tags?.join(', ')}</small></p>

      <hr />
      <h4>Messages:</h4>
      {messages.length === 0 ? (
        <p>No replies yet.</p>
      ) : (
        messages.map(msg => (
          <div key={msg._id || msg.id} className="message">
            <p>{msg.message}</p>
            <small>— {msg.senderId}</small>
          </div>
        ))
      )}

{thread?.id && (
  <NewMessageForm threadId={thread.id} onMessagePosted={handleNewMessage} />
)}

    </div>
  );
};

export default ThreadView;
