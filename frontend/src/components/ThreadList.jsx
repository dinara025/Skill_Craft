import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/threads.css';

const ThreadList = ({ onSelectThread }) => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');

    axios.get('http://localhost:8080/api/threads', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      console.log("✅ ThreadList fetched:", res.data);
      setThreads(res.data);
    })
    .catch(err => console.error('❌ Error fetching threads:', err));
  }, []);

  const handleThreadClick = (thread) => {
    console.log("🧵 Thread clicked:", thread);
    onSelectThread(thread);
  };

  return (
    <div className="thread-list">
      <h2>Skill Help Threads</h2>
      {threads.length === 0 ? (
        <p>No threads available. Create one!</p>
      ) : (
        threads.map((thread) => (
          <div
            key={thread._id || thread.id}
            className="thread-card"
            onClick={() => handleThreadClick(thread)}
            style={{ cursor: 'pointer' }}
          >
            <h4>{thread.title}</h4>
            <p>{thread.description?.slice(0, 60)}{thread.description?.length > 60 && '...'}</p>
            <small>Tags: {thread.tags?.join(', ')}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default ThreadList;
