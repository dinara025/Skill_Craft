import React from "react";
import "../styles/AdminLogin.css"; // we'll create this CSS file

const LoginPage = ({ onLogin }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    // Example call to onLogin (replace with real auth later)
    onLogin({ username, token: "fake-jwt-token" });
  };

  return (
    <div className="login-body">
      <section className="login-section">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="SkillCraft Logo"
          className="login-logo"
        />

        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-header">
              <h1>Welcome Back</h1>
            </div>

            <input
              type="text"
              name="username"
              placeholder="Username"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
