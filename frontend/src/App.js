import React, { useState, useEffect } from 'react';  // ✅ Added useEffect
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import MainPage from './components/MainPage';
import FollowSystem from './components/FollowSystem';
import CreatePost from './components/CreatePost'; 

import LearningPlans from './components/LearningPlans'; // Added LearningPlans also
import Course from './components/CourseManager';

import UpdatePost from './components/UpdatePost';
import AdminLoginPage from './components/AdminLoginPage';


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);



  // ✅ Auto-login if token is saved in localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('jwtUsername');
  
    const fetchUserDetails = async (username, token) => {
      try {
        const response = await fetch(`http://localhost:8080/userDetails/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
  
        const userData = await response.json();
        // Add token to the fetched user details
        setLoggedInUser({ ...userData, token });
  
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoggedInUser(null); // Clear user on failure
      }
    };
  
    if (token && username) {
      fetchUserDetails(username, token);
      console.log(loggedInUser)
    }
  }, []);
  

  // ✅ Update setLoggedInUser to also save username to localStorage
  const handleLogin = async ({ username, token }) => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('jwtUsername', username);
  
    try {
      const response = await fetch(`http://localhost:8080/api/auth/userDetails/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
  
      if (!response.ok) throw new Error('Login fetch failed');
  
      const userData = await response.json();
      setLoggedInUser({ ...userData, token });
      console.log("the id of the user: ",userData.id);
      localStorage.setItem('usersId', userData.id);
  
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  



  return (
    <Router>
      <div className="app">
        {!loggedInUser ? (
          <Routes>
            <Route path="/" element={<AuthPage onLogin={handleLogin} />} />  {/* ✅ Changed to use handleLogin */}
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/admin-login" element={<AdminLoginPage/>}/>
          </Routes>
        ) : (
          <Routes>
            {/* <Route path="/" element={<MainPage user={loggedInUser} />} /> */}
            <Route path="/" element={<MainPage user={loggedInUser} />} />
            <Route path="/create-post" element={<CreatePost user={loggedInUser.id} />} />
            <Route path="/follow-system" element={<FollowSystem senderId={loggedInUser.username} />} />
            <Route path="/learning-plans" element={<LearningPlans user={loggedInUser} />} />
            <Route path="/update-post/:id" element={<UpdatePost user={loggedInUser} />} />
            <Route path="*" element={<Navigate to="/" />} />

            {/* course management page */}
            <Route path="/Learning" element={<Course />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
