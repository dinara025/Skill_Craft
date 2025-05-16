import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  getFollowersCount,
  getFollowingCount,
} from "../services/followService";
import "../styles/UserProfile.css";

// Configure Axios base URL (adjust as needed for your backend)
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const UserProfile = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostsAndCount = async () => {
      try {
        if (!user?.id) {
          throw new Error("User ID is not available");
        }

        // Fetch posts
        const postsResponse = await axios.get(`/api/auth/posts/user/${user.id}`);
        setPosts(postsResponse.data);

        // Fetch post count
        const countResponse = await axios.get(`/api/auth/posts/count/${user.id}`);
        setPostCount(countResponse.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(
          err.response?.status === 404
            ? "User posts not found. Please try again later."
            : "An error occurred while fetching posts."
        );
      } finally {
        setLoading(false);
      }
    };

    const fetchCounts = async () => {
      try {
        if (user?.username) {
          const followersRes = await getFollowersCount(user.username);
          setFollowersCount(followersRes.data);

          const followingRes = await getFollowingCount(user.username);
          setFollowingCount(followingRes.data);
        }
      } catch (err) {
        console.error("Error fetching follow counts:", err);
      }
    };

    if (user) {
      fetchPostsAndCount();
      fetchCounts();
    } else {
      setError("User not found");
      setLoading(false);
    }
  }, [user]);

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar-container">
            <img
              src={user.profilePhoto || "/default-profile.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <button className="edit-profile-button" onClick={handleEditProfile}>
              <i className="fas fa-camera"></i> Edit
            </button>
          </div>
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-bio">{user.bio || "No bio yet"}</p>
          <div className="profile-details">
            {user.education && (
              <div className="profile-detail-item">
                <i className="fas fa-graduation-cap"></i>
                <span>{user.education}</span>
              </div>
            )}
            {user.skills?.length > 0 && (
              <div className="profile-detail-item">
                <i className="fas fa-tools"></i>
                <div className="skills-list">
                  {user.skills.map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{postCount}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{followersCount}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{followingCount}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          <i className="fas fa-th-large"></i> Posts
        </button>
        <button
          className={`tab-button ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          <i className="fas fa-book"></i> Courses
        </button>
        <button
          className={`tab-button ${activeTab === "plans" ? "active" : ""}`}
          onClick={() => setActiveTab("plans")}
        >
          <i className="fas fa-tasks"></i> Learning Plans
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "posts" && (
          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="post-card">
                  {post.mediaLinks?.[0] && (
                    <img
                      src={post.mediaLinks[0]}
                      alt="Post media"
                      className="post-image"
                    />
                  )}
                  <div className="post-content">
                    <p className="post-excerpt">
                      {post.content?.substring(0, 100) || "No content"}...
                    </p>
                    <div className="post-meta">
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="post-likes">
                        <i className="fas fa-heart"></i> {post.likeCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="far fa-newspaper"></i>
                <p>No posts published yet</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "courses" && (
          <div className="courses-list">
            {user.courses?.length > 0 ? (
              user.courses.map((course, idx) => (
                <div key={idx} className="course-card">
                  <div className="course-icon">
                    <i className="fas fa-book-open"></i>
                  </div>
                  <div className="course-info">
                    <h4>{course.title || `Course ${idx + 1}`}</h4>
                    <p>{course.description || "No description available"}</p>
                    <div className="course-progress">
                      <div
                        className="progress-bar"
                        style={{ width: `${course.progress || 0}%` }}
                      ></div>
                      <span>{course.progress || 0}% complete</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-book"></i>
                <p>No enrolled courses</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "plans" && (
          <div className="plans-list">
            {user.learningPlans?.length > 0 ? (
              user.learningPlans.map((plan, idx) => (
                <div key={idx} className="plan-card">
                  <div className="plan-icon">
                    <i className="fas fa-tasks"></i>
                  </div>
                  <div className="plan-info">
                    <h4>{plan.title || `Learning Plan ${idx + 1}`}</h4>
                    <p>{plan.description || "No description available"}</p>
                    <div className="plan-meta">
                      <span>
                        <i className="fas fa-calendar-alt"></i>{" "}
                        {plan.duration || "No timeframe"}
                      </span>
                      <span>
                        <i className="fas fa-check-circle"></i>{" "}
                        {plan.completedItems || 0}/{plan.totalItems || 0}{" "}
                        completed
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-tasks"></i>
                <p>No learning plans added</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;