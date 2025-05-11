import React, { useState } from 'react';
import ThreadList from '../components/ThreadList';
import ThreadView from '../components/ThreadView';
import NewThreadForm from '../components/NewThreadForm';
import '../styles/threads.css';

const ThreadsPage = () => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleThreadCreated = () => {
    setRefreshKey(prev => prev + 1); // Refresh thread list
  };

  const handleSelectThread = (thread) => {
    setSelectedThread(thread);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '35%', borderRight: '1px solid #ccc', padding: '10px', overflowY: 'scroll' }}>
        <NewThreadForm onThreadCreated={handleThreadCreated} />
        <ThreadList key={refreshKey} onSelectThread={handleSelectThread} />
      </div>
      <div style={{ flex: 1, padding: '20px', overflowY: 'scroll' }}>
        <ThreadView thread={selectedThread} />
      </div>
    </div>
  );
};

export default ThreadsPage;
