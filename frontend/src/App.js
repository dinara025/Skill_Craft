import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthPage from "./components/AuthPage";
import MainPage from "./components/MainPage";
import FollowSystem from "./components/FollowSystem";
import CreatePost from "./components/CreatePost";
import LearningPlans from "./components/LearningPlans";
import Course from "./components/CourseManager";
import UpdatePost from "./components/UpdatePost";
import UserProfile from "./components/UserProfile";
import AdminLoginPage from "./components/AdminLoginPage";
import ThreadsPage from "./components/ThreadsPage";
import ProfileEdit from "./components/ProfileEdit";
import LearningJourneyForm from "./components/LearningJourneyForm"; // Added import for LearningJourneyForm
import OAuth2RedirectHandler from "./components/OAuth2RedirectHandler";
import NotificationThread from "./components/NotificationThread";
import { requestNotificationPermission } from "./config/firebaseMessaging";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Auto-login if token is saved in localStorage
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const username = localStorage.getItem("jwtUsername");

    const fetchUserDetails = async (username, token) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/auth/userDetails/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const userData = await response.json();
        setLoggedInUser({ ...userData, token });
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoggedInUser(null); // Clear user on failure
      }
    };

    if (token && username) {
      fetchUserDetails(username, token);
    }
  }, []);

  // Update setLoggedInUser to also save username to localStorage
  const handleLogin = async ({ username, token }) => {
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("jwtUsername", username);

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/userDetails/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Login fetch failed");

      const userData = await response.json();
      setLoggedInUser({ ...userData, token });
      localStorage.setItem("usersId", userData.id);
    } catch (err) {
      console.error("Login error:", err);
      localStorage.clear();
      setLoggedInUser(null);
    }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* OAuth2 redirect handler is always available */}
          <Route
            path="/oauth2/success"
            element={<OAuth2RedirectHandler onLogin={handleLogin} />}
          />
          {!loggedInUser ? (
            <>
              <Route path="/" element={<AuthPage onLogin={handleLogin} />} />
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<MainPage user={loggedInUser} />} />
              <Route
                path="/create-post"
                element={<CreatePost user={loggedInUser.id} />}
              />
              <Route
                path="/follow-system"
                element={<FollowSystem senderId={loggedInUser.username} />}
              />
              <Route
                path="/learning-plans"
                element={<LearningPlans user={loggedInUser} />}
              />
              <Route
                path="/update-post/:id"
                element={<UpdatePost user={loggedInUser} />}
              />
              <Route path="/threads" element={<ThreadsPage />} />
              <Route path="/Learning" element={<Course />} />
              <Route
                path="/profile"
                element={<UserProfile user={loggedInUser} />}
              />
              <Route
                path="/notifications"
                element={<NotificationThread userId={loggedInUser.id} />}
              />
              <Route path="/profile/edit" element={<ProfileEdit />} />
              <Route
                path="/learning-journey/create"
                element={<LearningJourneyForm user={loggedInUser} />}
              />
              <Route
                path="/learning-journey/edit/:entryId"
                element={<LearningJourneyForm user={loggedInUser} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;