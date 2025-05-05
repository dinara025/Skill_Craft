import React, { useState, useEffect } from 'react';  // ✅ Added useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import MainPage from './components/MainPage';
import FollowSystem from './components/FollowSystem';
import CreatePost from './components/CreatePost'; 
import LearningPlans from './components/LearningPlans';
import UpdatePost from './components/UpdatePost';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ✅ Auto-login if token is saved in localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('jwtUsername');  // ✅ We'll save this at login too
    if (token && username) {
      setLoggedInUser({ username, token });
    }
  }, []);

  // ✅ Update setLoggedInUser to also save username to localStorage
  const handleLogin = ({ username, token }) => {
    localStorage.setItem('jwtUsername', username);  // ✅ Save username too
    setLoggedInUser({ username, token });
  };

  return (
    <Router>
      <div className="app">
        {!loggedInUser ? (
          <Routes>
            <Route path="/" element={<AuthPage onLogin={handleLogin} />} />  {/* ✅ Changed to use handleLogin */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<MainPage user={loggedInUser} />} />
            <Route path="/create-post" element={<CreatePost user={loggedInUser} />} />
            <Route path="/follow-system" element={<FollowSystem senderId={loggedInUser.username} />} />
            <Route path="/learning-plans" element={<LearningPlans userId={loggedInUser.username} />} /> {/* Passed username as ID */}
            <Route path="/update-post/:id" element={<UpdatePost user={loggedInUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
