import React, { useState } from 'react';
import { registerUser } from '../services/authService';
import { FaUser, FaLock, FaUserPlus, FaSpinner } from 'react-icons/fa';
import '../styles/authForms.css';

const RegisterForm = ({ onLogin, switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword } = formData;

    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await registerUser(username, password);

      if (res.data) {
        localStorage.setItem('jwtToken', res.data.token);
        localStorage.setItem('jwtUsername', username);
        onLogin({ username, token: res.data.token });
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Username already exists');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <h2>Join SkillCraft Community</h2>
          <p>Connect with professionals and showcase your skills</p>
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              name="username"
              type="text"
              placeholder="Username (min 3 characters)"
              value={formData.username}
              onChange={handleChange}
              className="auth-input"
              autoComplete="username"
              minLength="3"
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              autoComplete="new-password"
              minLength="6"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <div className="password-strength">
            <div 
              className={`strength-bar ${formData.password.length === 0 ? 'empty' : 
                formData.password.length < 6 ? 'weak' : 
                formData.password.length < 10 ? 'medium' : 'strong'}`}
            ></div>
            <small>
              {formData.password.length === 0 ? '' : 
               formData.password.length < 6 ? 'Weak' : 
               formData.password.length < 10 ? 'Medium' : 'Strong'}
            </small>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || !formData.username || !formData.password || !formData.confirmPassword}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                Creating Account...
              </>
            ) : (
              <>
                <FaUserPlus />
                Sign Up
              </>
            )}
          </button>

          <div className="auth-footer">
            {/* <p>
              Already have an account?{' '}
              <button type="button" onClick={switchToLogin} className="auth-link">
                Sign in
              </button>
            </p> */}
            <div className="terms-agreement">
              <small>
                By registering, you agree to our Terms of Service and Privacy Policy
              </small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;