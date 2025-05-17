import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Modal } from "react-bootstrap";
import { getFollowersCount, getFollowingCount } from "../services/followService";
import { FaEllipsisH, FaEdit, FaTrash, FaPlay, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import "../styles/UserProfile.css";

// Configure Axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const UserProfile = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [learningJourney, setLearningJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(null);
  const [showMediaModal, setShowMediaModal] = useState(null);
  const [modalMediaIndex, setModalMediaIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState({});
  const [playingVideos, setPlayingVideos] = useState({});
  const [touchStartX, setTouchStartX] = useState(null);

  const navigate = useNavigate();
  const dropdownRefs = useRef({});
  const videoRefs = useRef({});

  const isVideo = (url) => {
    if (!url || typeof url !== "string") return false;
    const cleanUrl = url.split("?")[0];
    return cleanUrl.match(/\.(mp4|webm|ogg)$/i);
  };

  const fetchUserData = async () => {
    try {
      if (!user?.id) {
        throw new Error("User ID is not available");
      }

      const postsResponse = await axios.get(`/api/auth/posts/user/${user.id}`);
      const transformedPosts = postsResponse.data.map((post) => ({
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
        isLiked: false,
        comments: post.comments || 0,
        commentsList: [],
      }));
      setPosts(transformedPosts);
      setCurrentMediaIndex(
        transformedPosts.reduce((acc, post) => {
          acc[post.id] = 0;
          return acc;
        }, {})
      );

      const countResponse = await axios.get(`/api/auth/posts/count/${user.id}`);
      setPostCount(countResponse.data);

      const journeyResponse = await axios.get(
        `/api/auth/learning-journey/user/${user.id}`
      );
      setLearningJourney(journeyResponse.data[0] || null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(
        err.response?.status === 404
          ? "User data not found. Please try again later."
          : "An error occurred while fetching data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      fetchUserData();
      fetchCounts();
    } else {
      setError("User not found");
      setLoading(false);
    }
  }, [user]);

  const handlePostCreated = () => {
    fetchUserData();
  };

  const handleEditProfile = () => {
    navigate("/profile/edit");
  };

  const toggleDropdown = (postId) => {
    setShowDropdown((prev) => (prev === postId ? null : postId));
  };

  const handleEditPost = (postId) => {
    const post = posts.find((p) => p.id === postId);
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
    const post = posts.find((p) => p.id === postId);
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

      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
      setPostCount((prev) => prev - 1);
      setShowDropdown(null);
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post");
    }
  };

  const handleNextMedia = (postId) => {
    setCurrentMediaIndex((prev) => {
      const post = posts.find((p) => p.id === postId);
      const media = post?.mediaLinks || [];
      return {
        ...prev,
        [postId]: prev[postId] < media.length - 1 ? prev[postId] + 1 : prev[postId],
      };
    });
  };

  const handlePrevMedia = (postId) => {
    setCurrentMediaIndex((prev) => ({
      ...prev,
      [postId]: prev[postId] > 0 ? prev[postId] - 1 : prev[postId],
    }));
  };

  const openMediaModal = (postId, index) => {
    setModalMediaIndex(index);
    setShowMediaModal(postId);
  };

  const closeMediaModal = () => {
    if (showMediaModal && isVideo(posts.find((p) => p.id === showMediaModal)?.mediaLinks?.[modalMediaIndex])) {
      toggleVideoPlay(modalMediaIndex, true);
    }
    setShowMediaModal(null);
  };

  const toggleVideoPlay = (index, isModal = false, postId = showMediaModal) => {
    const videoKey = isModal ? `modal-${index}` : `${postId}-${index}`;
    const videoRef = videoRefs.current[videoKey];

    if (videoRef) {
      if (playingVideos[videoKey]) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
    }

    setPlayingVideos((prev) => ({
      ...prev,
      [videoKey]: !prev[videoKey],
    }));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e, postId) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 50) {
      handlePrevMedia(postId);
    } else if (deltaX < -50) {
      handleNextMedia(postId);
    }
    setTouchStartX(null);
  };

  const renderMediaItem = (mediaUrl, index, postId, isModal = false) => {
    if (isVideo(mediaUrl)) {
      const videoKey = isModal ? `modal-${index}` : `${postId}-${index}`;
      return (
        <div className={`video-container ${isModal ? "modal-video" : ""}`}>
          <video
            ref={(el) => (videoRefs.current[videoKey] = el)}
            src={mediaUrl}
            className="post-media"
            controls={playingVideos[videoKey]}
            onClick={(e) => {
              if (!playingVideos[videoKey]) {
                e.stopPropagation();
                toggleVideoPlay(index, isModal, postId);
              }
            }}
            onEnded={() =>
              setPlayingVideos((prev) => ({
                ...prev,
                [videoKey]: false,
              }))
            }
          />
          {!playingVideos[videoKey] && (
            <div
              className="video-overlay"
              onClick={(e) => {
                e.stopPropagation();
                toggleVideoPlay(index, isModal, postId);
              }}
            >
              <FaPlay className="play-icon" />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <img
          src={mediaUrl}
          alt={`Post media ${index}`}
          className="post-media"
          onError={(e) => (e.target.style.display = "none")}
        />
      );
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
        <button
          className={`tab-button ${activeTab === "learning-journey" ? "active" : ""}`}
          onClick={() => setActiveTab("learning-journey")}
        >
          <i className="fas fa-graduation-cap"></i> Learning Journey
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "posts" && (
          <div className="posts-grid">
            {posts.length > 0 ? (
              posts.map((post) => {
                const media = post.mediaLinks || [];
                const currentIndex = currentMediaIndex[post.id] || 0;
                return (
                  <div key={post.id} className="post-card">
                    {media.length > 0 && (
                      <div
                        className="post-media-wrapper"
                        onTouchStart={(e) => handleTouchStart(e)}
                        onTouchEnd={(e) => handleTouchEnd(e, post.id)}
                      >
                        <div
                          className="media-frame"
                          onClick={() => openMediaModal(post.id, currentIndex)}
                        >
                          {renderMediaItem(media[currentIndex], currentIndex, post.id)}
                        </div>
                        {media.length > 1 && (
                          <div className="media-controls">
                            <Button
                              variant="link"
                              className="media-nav prev"
                              onClick={() => handlePrevMedia(post.id)}
                              disabled={currentIndex === 0}
                            >
                              <span className="nav-arrow">←</span>
                            </Button>
                            <div className="media-dots">
                              {media.map((_, index) => (
                                <button
                                  key={index}
                                  className={`media-dot ${index === currentIndex ? "active" : ""}`}
                                  onClick={() =>
                                    setCurrentMediaIndex((prev) => ({
                                      ...prev,
                                      [post.id]: index,
                                    }))
                                  }
                                  aria-label={`Go to media ${index + 1}`}
                                />
                              ))}
                            </div>
                            <Button
                              variant="link"
                              className="media-nav next"
                              onClick={() => handleNextMedia(post.id)}
                              disabled={currentIndex === media.length - 1}
                            >
                              <span className="nav-arrow">→</span>
                            </Button>
                          </div>
                        )}
                      </div>
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
                      <div className="post-options-container" ref={(el) => (dropdownRefs.current[post.id] = el)}>
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
                );
              })
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

        {activeTab === "learning-journey" && (
          <div className="learning-journey-list">
            {learningJourney && learningJourney.entries?.length > 0 ? (
              learningJourney.entries.map((entry, idx) => (
                <div key={idx} className="learning-journey-card">
                  <div className="learning-journey-icon">
                    <i
                      className={`fas ${
                        entry.type === "skill" ? "fa-tools" : "fa-book-open"
                      }`}
                    ></i>
                  </div>
                  <div className="learning-journey-info">
                    <h4>{entry.title}</h4>
                    <p>{entry.description || "No description"}</p>
                    <span>{new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-graduation-cap"></i>
                <p>No learning journey entries yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showMediaModal && (
        <Modal
          show={!!showMediaModal}
          onHide={closeMediaModal}
          centered
          size="lg"
          className="media-modal"
        >
          <Modal.Header className="media-modal-header">
            <Button variant="link" onClick={closeMediaModal} className="close-button">
              <FaTimes />
            </Button>
          </Modal.Header>
          <Modal.Body className="media-modal-body">
            <div className="modal-media-container">
              {renderMediaItem(
                posts.find((p) => p.id === showMediaModal)?.mediaLinks?.[modalMediaIndex],
                modalMediaIndex,
                showMediaModal,
                true
              )}
            </div>
            {posts.find((p) => p.id === showMediaModal)?.mediaLinks?.length > 1 && (
              <>
                <Button
                  variant="link"
                  className="modal-nav prev"
                  onClick={() =>
                    setModalMediaIndex((prev) => (prev > 0 ? prev - 1 : prev))
                  }
                  disabled={modalMediaIndex === 0}
                >
                  <FaChevronLeft />
                </Button>
                <Button
                  variant="link"
                  className="modal-nav next"
                  onClick={() =>
                    setModalMediaIndex((prev) =>
                      prev <
                      (posts.find((p) => p.id === showMediaModal)?.mediaLinks?.length || 0) - 1
                        ? prev + 1
                        : prev
                    )
                  }
                  disabled={
                    modalMediaIndex ===
                    (posts.find((p) => p.id === showMediaModal)?.mediaLinks?.length || 0) - 1
                  }
                >
                  <FaChevronRight />
                </Button>
                <div className="modal-media-dots">
                  {posts.find((p) => p.id === showMediaModal)?.mediaLinks?.map((_, index) => (
                    <button
                      key={index}
                      className={`modal-media-dot ${index === modalMediaIndex ? "active" : ""}`}
                      onClick={() => setModalMediaIndex(index)}
                      aria-label={`Go to media ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default UserProfile;