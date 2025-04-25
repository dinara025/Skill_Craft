import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import FollowSystem from './components/FollowSystem';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h2>SkillCraft Platform</h2>
      {!loggedInUser ? (
        <>
          <RegisterForm onLogin={setLoggedInUser} />
          <hr />
          <LoginForm onLogin={setLoggedInUser} />
        </>
      ) : (
        <>
          <p>Logged in as: <strong>{loggedInUser.username}</strong></p>
          <FollowSystem senderId={loggedInUser.username} />
        </>
      )}
    </div>
  );
}

export default App;
