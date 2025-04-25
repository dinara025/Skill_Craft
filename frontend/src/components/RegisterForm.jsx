import React, { useState } from 'react';
import { registerUser } from '../services/authService';

const RegisterForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await registerUser(username, password);
      if (res.data) {
        alert('Registration successful');
        onLogin(res.data); // auto-login
      } else {
        alert('Username already exists');
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <div>
      <h3>Register</h3>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default RegisterForm;
