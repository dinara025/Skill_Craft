import React from 'react';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import '../styles/AuthPage.css';

function AuthPage({ onLogin }) {
  return (
    <div className="auth-container">
      <div className="auth-card register-section">
        <div className="auth-header">
          <FaUserPlus className="auth-icon" />
          <h2>Join Our Community</h2>
          <p>Start your learning journey today</p>
        </div>
        <RegisterForm onLogin={onLogin} />
      </div>
      
      <div className="auth-card login-section">
        <div className="auth-header">
          <FaSignInAlt className="auth-icon" />
          <h2>Welcome Back</h2>
          <p>Continue your learning journey</p>
        </div>
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  );
}

export default AuthPage;