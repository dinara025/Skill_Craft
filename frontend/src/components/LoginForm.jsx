import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from "react-icons/fa";
import "../styles/authForms.css";

const LoginForm = ({ onLogin, switchToRegister }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await loginUser(username, password);

      if (res.data) {
        const token = res.data;
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("jwtUsername", username);
        onLogin({ username, token });
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-wrapper">
        <div className="auth-header">
          <h2>Welcome Back to SkillCraft</h2>
          <p>Connect with skilled professionals in your field</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="auth-input"
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || !formData.username || !formData.password}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                Signing In...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Sign In
              </>
            )}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google logo"
              style={{ width: "20px", marginRight: "10px" }}
            />
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
