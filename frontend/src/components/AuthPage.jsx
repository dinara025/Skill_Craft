import React from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import '../styles/AuthPage.css';  // Optional: put the login/register styles here

function AuthPage({ onLogin }) {
  return (
    <div className="auth-container">
      <div className="register-section">
        <h4>Register</h4>
        <RegisterForm onLogin={onLogin} />
      </div>
      <div className="login-section">
        <h4>Login</h4>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}

export default AuthPage;
