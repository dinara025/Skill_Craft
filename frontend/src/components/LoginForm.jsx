import React, { useState } from 'react';
import { loginUser } from '../services/authService';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await loginUser(username, password);
      if (res.data) {
        alert('Login successful');
        onLogin(res.data);
      } else {
        alert('Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginForm;
