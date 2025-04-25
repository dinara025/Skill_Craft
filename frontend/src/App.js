import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import FollowSystem from './components/FollowSystem';
import Header from './components/Header';
import NavBar from './components/NavBar';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showNav, setShowNav] = useState(false); // nav visibility

  const toggleNav = () => {
    setShowNav(prev => !prev);
  };

  return (
    <div className="App">
      {loggedInUser && (
        <>
          <Header onMenuClick={toggleNav} />
          {showNav && <NavBar onClose={toggleNav}/>}
        </>
      )}

      <div style={{ padding: '20px', marginLeft: loggedInUser && showNav ? '220px' : '0' }}>
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
    </div>
  );
}

export default App;
