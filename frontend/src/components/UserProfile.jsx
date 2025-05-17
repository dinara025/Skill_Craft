import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown } from "react-bootstrap";
import {
  getFollowersCount,
  getFollowingCount,
} from "../services/followService";
import { FaEllipsisH, FaEdit, FaTrash } from "react-icons/fa";
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
  const [showDropdown, setShowDropdown] = useState(null);

  const navigate = useNavigate();
  const dropdownRefs = useRef({});

  useEffect(() => {
    const fetchPostsAndCount = async () => {
      try {
        if (!user?.id) {
          throw new Error("User ID is not available");
        }

        // Fetch posts
        const postsResponse = await axios.get(`/api/auth/posts/user/${user.id}`);
        // Transform posts to match PostCard expectations
        const transformedPosts = postsResponse.data.map(post => ({
          id: post.id || Math.random().toString(36).substr(2, 9),
          title: post.title || "",
          content: post.content || "",
          mediaLinks: post.mediaLinks || [],
          tags: post.tags || [],
          template: post.template || "general",
          createdAt: post.createdAt || new Date().toISOString(),
          userId: String(post.userId || user.id),
          username: user.username || "Unknown User",
          avatar: user.profilePhoto || "https://via.placeholder.com/48",
          likeCount: post.likeCount || 0,
          likes: post.likes || [],
          isLiked: false, // Not provided in /user endpoint, set to false
          comments: post.comments || 0,
          commentsList: [], // Comments not fetched here
        }));

        setPosts(transformedPosts);

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

  const toggleDropdown = (postId) => {
    setShowDropdown(prev => (prev === postId ? null : postId));
  };

  const handleEditPost = (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) {
      setError("Post not found");
      return;
    }
    if (post.userId !== String(user.id)) {
      setError("You are not authorized to edit this post");
      return;
    }
    toggleDropdown(null);
    navigate(`/update-post/${postId}`, { state: { post } });
  };

  const handleDeletePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) {
      setError("Post not found");
      return;
    }
    if (post.userId !== String(user.id)) {
      setError("You are not authorized to delete this post");
      return;
    }

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      await axios.delete(`/api/auth/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      setPostCount(prev => prev - 1);
      setShowDropdown(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post");
    }
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
                  {post.userId === String(user.id) && (
                    <div className="post-options-container" ref={el => (dropdownRefs.current[post.id] = el)}>
                      <Button
                        variant="link"
                        className="post-options"
                        onClick={() => toggleDropdown(post.id)}
                      >
                        <FaEllipsisH />
                      </Button>
                      {showDropdown === post.id && (
                        <Dropdown show className="post-dropdown-menu">
                          <Dropdown.Menu className="dropdown-menu-custom">
                            <Dropdown.Item
                              onClick={() => handleEditPost(post.id)}
                              className="dropdown-item-custom"
                            >
                              <FaEdit className="me-2" /> Edit Post
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDeletePost(post.id)}
                              className="dropdown-item-custom text-danger"
                            >
                              <FaTrash className="me-2" /> Delete Post
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  )}
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