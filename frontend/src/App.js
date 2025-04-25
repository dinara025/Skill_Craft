import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import FollowSystem from './components/FollowSystem';
import Header from './components/Header';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleMenuClick = () => {
    console.log('Sidebar toggle clicked!');
  };

  return (
    <div className="App">
      {/* Show Header only after login */}
      {loggedInUser && <Header onMenuClick={handleMenuClick} />}

      <div style={{ padding: '20px' }}>
        {!loggedInUser ? (
          <>
            <h2>Welcome to SkillCraft</h2>
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
    </div>
  );
}

export default App;
