import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NewMessageForm from './NewMessageForm';
import '../styles/threads.css';

const ThreadView = ({ thread }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (thread) {
      axios.get(`http://localhost:8080/api/messages/${thread.id}`)
        .then(res => setMessages(res.data))
        .catch(err => console.error('Error fetching messages:', err));
    }
  }, [thread]);

  const handleNewMessage = (newMsg) => {
    setMessages(prev => [...prev, newMsg]);
  };

  if (!thread) {
    return <div className="thread-view"><p>Select a thread to view messages.</p></div>;
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
          <div key={msg.id} className="message">
            <p>{msg.message}</p>
            <small>— {msg.senderId}</small>
          </div>
        ))
      )}

      <NewMessageForm threadId={thread.id} onMessagePosted={handleNewMessage} />
    </div>
  );
};

export default ThreadView;
