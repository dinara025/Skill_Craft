import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaArrowLeft } from 'react-icons/fa';
import ThreadList from '../components/ThreadList';
import ThreadView from '../components/ThreadView';
import NewThreadForm from '../components/NewThreadForm';
import '../styles/ThreadsPage.css';

const ThreadsPage = () => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showThreadList, setShowThreadList] = useState(true);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleThreadCreated = () => {
    setRefreshKey(prev => prev + 1);
    setShowNewThreadForm(false);
    if (isMobileView) setShowThreadList(true);
  };

  const handleSelectThread = (thread) => {
    setSelectedThread(thread);
    if (isMobileView) setShowThreadList(false);
  };

  const handleBackToList = () => {
    setShowThreadList(true);
    setSelectedThread(null);
  };

  return (
    <div className="threads-container">
      {/* Left sidebar - Thread List */}
      <div className={`threads-sidebar ${!isMobileView || showThreadList ? 'visible' : 'hidden'}`}>
        <div className="threads-header">
          <h2>Community Discussions</h2>
          <div className="threads-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="new-thread-btn"
            onClick={() => setShowNewThreadForm(true)}
          >
            <FaPlus /> New Thread
          </button>
        </div>

        {showNewThreadForm ? (
          <div className="new-thread-form-container">
            <button 
              className="back-button"
              onClick={() => setShowNewThreadForm(false)}
            >
              <FaArrowLeft /> Back to list
            </button>
            <NewThreadForm onThreadCreated={handleThreadCreated} />
          </div>
        ) : (
          <ThreadList 
            key={refreshKey} 
            onSelectThread={handleSelectThread} 
            searchQuery={searchQuery}
          />
        )}
      </div>

      {/* Right panel - Thread View */}
      <div className={`thread-view-container ${(!isMobileView || !showThreadList) ? 'visible' : 'hidden'}`}>
        {selectedThread ? (
          <>
            {isMobileView && (
              <button className="back-button" onClick={handleBackToList}>
                <FaArrowLeft /> Back to discussions
              </button>
            )}
            <ThreadView thread={selectedThread} />
          </>
        ) : (
          <div className="empty-thread-view">
            <h3>Select a thread to view</h3>
            <p>Or create a new discussion to get help from the community</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadsPage;