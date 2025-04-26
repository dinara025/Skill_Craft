import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MainPage from './components/MainPage';
import FollowSystem from './components/FollowSystem';
import CreatePost from './components/CreatePost';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <Router>
      <div className="app">

        {/* If NOT logged in, show Login + Register */}
        {!loggedInUser ? (
          <Routes>
            <Route path="/" element={
              <div className="auth-container">
                <div className="register-section">
                  <h4>Register</h4>
                  <RegisterForm onLogin={setLoggedInUser} />
                </div>
                <div className="login-section">
                  <h4>Login</h4>
                  <LoginForm onLogin={setLoggedInUser} />
                </div>
              </div>
            } />
            
            {/* Redirect any unknown route to login page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            {/* Main page after login */}
            <Route path="/" element={<MainPage user={loggedInUser} />} />

            {/* Create post page */}
            <Route path="/create-post" element={<CreatePost user={loggedInUser} />} />

            {/* Follow System page */}
            <Route path="/follow-system" element={<FollowSystem senderId={loggedInUser.username} />} />

            {/* If unknown path entered after login, redirect to Home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}

      </div>
    </Router>
  );
}

export default App;
