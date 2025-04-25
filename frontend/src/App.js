import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import MainPage from './components/MainPage';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
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
        <MainPage senderId={loggedInUser.username} />
      )}
    </div>
  );
}

export default App;

