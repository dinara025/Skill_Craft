import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/threads.css';

const ThreadList = ({ onSelectThread }) => {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/threads')
      .then(res => setThreads(res.data))
      .catch(err => console.error('Error fetching threads:', err));
  }, []);

  return (
    <div className="thread-list">
      <h2>Skill Help Threads</h2>
      {threads.map(thread => (
        <div key={thread.id} className="thread-card" onClick={() => onSelectThread(thread)}>
          <h4>{thread.title}</h4>
          <p>{thread.description}</p>
          <small>Tags: {thread.tags?.join(', ')}</small>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
