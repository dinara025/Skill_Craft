import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';  // NEW
import MainPage from './components/MainPage';
import FollowSystem from './components/FollowSystem';
import CreatePost from './components/CreatePost'; 
import LearningPlans from './components/LearningPlans';
import UpdatePost from './components/UpdatePost';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <Router>
      <div className="app">
        {!loggedInUser ? (
          <Routes>
            <Route path="/" element={<AuthPage onLogin={setLoggedInUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<MainPage user={loggedInUser} />} />
            <Route path="/create-post" element={<CreatePost user={loggedInUser} />} />
            <Route path="/follow-system" element={<FollowSystem senderId={loggedInUser.username} />} />
            <Route path="/learning-plans" element={<LearningPlans userId={loggedInUser?.id} />} />
            <Route path="/update-post/:id" element={<UpdatePost user={loggedInUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
