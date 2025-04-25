import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MainPage from './components/MainPage';
import FollowSystem from './components/FollowSystem';
import CreatePost from './components/CreatePost'; // Add this import

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  return (
    <Router>
      <div className="app">
        {!loggedInUser ? (
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
        ) : (
          <Routes>
            {/* Main Page Route */}
            <Route
              path="/"
              element={<MainPage senderId={loggedInUser} />}
            />
           
            {/* Follow System Route */}
            <Route
              path="/follow-requests"
              element={
                <MainPage senderId={loggedInUser.username}>
                  <FollowSystem currentUser={loggedInUser} />
                </MainPage>
              }
            />
           
            <Route path="/create-post" element={<CreatePost user={loggedInUser} />} />

            <Route path="/follow-system" element={<FollowSystem />} />
            {/* Add other routes as needed */}
          </Routes>
        )}
      </div>
    </Router>
  );
}
export default App;