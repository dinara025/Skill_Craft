import React, { useState } from 'react';
import { FaUserPlus, FaSignInAlt, FaTimes, FaChevronLeft } from 'react-icons/fa';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import '../styles/AuthPage.css';

function AuthPage({ onLogin }) {
  const [activeForm, setActiveForm] = useState('login');
  const [isMobileView, setIsMobileView] = useState(false);

  // Check if mobile view on component mount and resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleForm = (form) => {
    setActiveForm(form);
  };

  return (
    <div className="auth-page-container">
      {/* Background Animation */}
      <div className="auth-bg-animation"></div>
      
      {/* Auth Container */}
      <div className={`auth-container ${isMobileView ? 'mobile-view' : ''}`}>
        {/* Close Button for Mobile */}
        {isMobileView && (
          <button className="close-auth" onClick={() => {/* Add close handler if needed */}}>
            <FaTimes />
          </button>
        )}

        {/* Login Form */}
        <div 
          className={`auth-card login-section ${activeForm === 'login' ? 'active' : ''}`}
          style={{ display: isMobileView && activeForm !== 'login' ? 'none' : 'flex' }}
        >
          {/* <div className="auth-header">
            <div className="auth-icon-container">
              <FaSignInAlt className="auth-icon" />
            </div>
            <h2>Welcome to SkillCraft</h2>
            <p>Connect with your professional community</p>
          </div> */}
          
          <LoginForm 
            onLogin={onLogin} 
            switchToRegister={() => toggleForm('register')} 
          />
          
          {/* {!isMobileView && (
            <div className="auth-footer-note">
              <p>New to SkillCraft? <span onClick={() => toggleForm('register')}>Create account</span></p>
            </div>
          )} */}
        </div>

        {/* Register Form */}
        <div 
          className={`auth-card register-section ${activeForm === 'register' ? 'active' : ''}`}
          style={{ display: isMobileView && activeForm !== 'register' ? 'none' : 'flex' }}
        >
          {isMobileView && (
            <button className="back-button" onClick={() => toggleForm('login')}>
              <FaChevronLeft />
            </button>
          )}
          
          {/* <div className="auth-header">
            <div className="auth-icon-container">
              <FaUserPlus className="auth-icon" />
            </div>
            <h2>Join SkillCraft</h2>
            <p>Start your professional journey</p>
          </div> */}
          
          <RegisterForm 
            onLogin={onLogin} 
            switchToLogin={() => toggleForm('login')} 
          />
          
          {/* {!isMobileView && (
            <div className="auth-footer-note">
              <p>Already a member? <span onClick={() => toggleForm('login')}>Sign in</span></p>
            </div>
          )} */}
        </div>

        {/* Decorative Element */}
        <div className="auth-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-square"></div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;