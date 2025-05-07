import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserProfile.css";

const UserProfile = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (user?.id) {
          const response = await axios.get(`/api/posts/user/${user.id}`);
          setPosts(response.data);
        }
      } catch (err) {
        console.error("Error fetching user posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  if (loading) return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
  
  if (!user) return <div className="error-message">User not found</div>;

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-cover">
          <div className="profile-avatar-container">
            <img
              src={user.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="profile-avatar"
            />
            <button className="edit-profile-button">
              <i className="fas fa-camera"></i> Edit
            </button>
          </div>
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-bio">{user.bio || "No bio yet"}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{user.postsCount || 0}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.followersCount || 0}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{user.followingCount || 0}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
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
                  {post.image && (
                    <img src={post.image} alt={post.title} className="post-image" />
                  )}
                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-excerpt">{post.content.substring(0, 100)}...</p>
                    <div className="post-meta">
                      <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="post-likes">
                        <i className="fas fa-heart"></i> {post.likes || 0}
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
                        <i className="fas fa-calendar-alt"></i> {plan.duration || "No timeframe"}
                      </span>
                      <span>
                        <i className="fas fa-check-circle"></i> {plan.completedItems || 0}/{plan.totalItems || 0} completed
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