import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Spinner } from 'react-bootstrap';
import {
  FaUserPlus,
  FaChalkboardTeacher,
  FaBook,
  FaBookOpen
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsPlusCircleFill } from 'react-icons/bs';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { createPost } from '../services/postService';
import Header from '../components/Header';
import PostList from '../components/PostList';
import NavBar from '../components/NavBar';
import '../styles/MainPage.css';

const MainPage = ({ user }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ------------------ 🔥 STATE FOR NAVBAR (Sidebar) ------------------
  const [showNavBar, setShowNavBar] = useState(false);

  // ------------------ STATE FOR POST CREATION ------------------
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const MAX_CHARS = 500;
  const MAX_MEDIA = 3;
  const MAX_VIDEO_DURATION = 30;

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtUsername');
    window.location.reload();
  };

  const currentUser = user ? {
    id: user.id,
    name: user.username,
    handle: `@${user.username.toLowerCase()}`,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    skills: ["UI/UX", "React", "Figma"]
  } : {
    name: "Guest User",
    handle: "@guest",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    skills: []
  };

  const tabs = [
    { id: 1, name: "For You", active: true },
    { id: 2, name: "Following" }
  ];

  const quickActions = [
    {
      icon: <BsPlusCircleFill className="action-icon" />,
      label: "Create Post",
      variant: "primary",
      onClick: () => navigate("/create-post")
    },
    {
      icon: <FaUserPlus className="action-icon" />,
      label: "Find Friends",
      variant: "outline-primary",
      onClick: () => navigate("/follow-system")
    },
    {
      icon: <FaChalkboardTeacher className="action-icon" />,
      label: "Start Teaching",
      variant: "outline-success",
      onClick: () => navigate("/Learning")
    },
    {
      icon: <FaBook className="action-icon" />,
      label: "Learning Plans",
      variant: "outline-info",
      onClick: () => navigate("/learning-plans")
    }
  ];

  const trendingSkills = [
    { name: "React.js", posts: 1243 },
    { name: "UI Design", posts: 892 },
    { name: "Python", posts: 765 },
    { name: "Digital Marketing", posts: 543 }
  ];

  const suggestedPeople = [
    {
      name: "Sarah Miller",
      handle: "@sarahdesigns",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      skill: "UI/UX Designer"
    },
    {
      name: "Michael Chen",
      handle: "@michaelcode",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      skill: "Full Stack Developer"
    },
    {
      name: "Priya Patel",
      handle: "@priyatech",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      skill: "Data Scientist"
    }
  ];

  // ------------------ POST CREATION LOGIC ------------------
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (mediaFiles.length + files.length > MAX_MEDIA) {
      alert(`You can upload up to ${MAX_MEDIA} media files.`);
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    for (const file of files) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        invalidFiles.push(`${file.name} (invalid type)`);
        continue;
      }

      if (file.type.startsWith('video/')) {
        try {
          const duration = await getVideoDuration(file);
          if (duration > MAX_VIDEO_DURATION) {
            invalidFiles.push(`${file.name} (video too long)`);
            continue;
          }
        } catch {
          invalidFiles.push(`${file.name} (error reading video)`);
          continue;
        }
      }

      validFiles.push(file);
    }

    if (invalidFiles.length > 0) {
      alert(`Invalid files:\n${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...validFiles.map(file => URL.createObjectURL(file))]);
    }

    if (e.target) e.target.value = null;
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMedia = (index) => {
    const newFiles = [...mediaFiles];
    const newUrls = [...previewUrls];
    newFiles.splice(index, 1);
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setMediaFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const uploadMediaToFirebase = async () => {
    const uploadTasks = mediaFiles.map(async (file) => {
      const fileRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      return await getDownloadURL(snapshot.ref);
    });
    return await Promise.all(uploadTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to create a post.');
      return;
    }

    if (description.trim().length === 0) {
      alert('Post content cannot be empty.');
      return;
    }

    try {
      setUploading(true);
      const mediaLinks = await uploadMediaToFirebase();
      const extractedTags = Array.from(new Set(description.match(/#[\w]+/g))) || [];

      const postPayload = {
        userId: user.id,
        content: description,
        tags: extractedTags.map(tag => tag.replace('#', '')),
        mediaLinks,
      };

      await createPost(postPayload);
      alert('Post created successfully!');
      setDescription('');
      setCharCount(0);
      setMediaFiles([]);
      setPreviewUrls([]);
      window.location.reload(); // Refresh the page to update PostList
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Something went wrong. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setDescription(text);
      setCharCount(text.length);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="skillshare-social">
      <Header onMenuClick={() => setShowNavBar(true)} />
      {showNavBar && <NavBar onClose={() => setShowNavBar(false)} />}

      <main className="main-content">
        <Container fluid>
          <Row>
            {/* Left Sidebar */}
            <Col lg={3} className="left-sidebar d-none d-lg-block">
              <Card className="profile-card">
                <div className="profile-header">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="profile-avatar"
                  />
                  <div className="profile-info">
                    <h5>{currentUser.name}</h5>
                    <p className="text-muted">{currentUser.handle}</p>
                  </div>
                </div>
                <div className="profile-skills">
                  <h6>My Skills</h6>
                  <div className="skills-list">
                    {currentUser.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>
                <Button variant="outline-primary" className="edit-profile-btn">
                  Edit Profile
                </Button>
                <Button variant="danger" className="mt-2" onClick={handleLogout}>
                  Logout
                </Button>
              </Card>

              <Card className="trending-card">
                <Card.Body>
                  <h5>Trending Skills</h5>
                  <ul className="trending-list">
                    {trendingSkills.map((skill, index) => (
                      <li key={index}>
                        <span className="skill-name">{skill.name}</span>
                        <span className="post-count">{skill.posts} posts</span>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            {/* Main Feed */}
            <Col lg={6} className="main-feed">
              <Card className="create-post-card">
                <Form onSubmit={handleSubmit} className="post-editor">
                  <div className="post-input-container">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="post-avatar"
                    />
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Share what you're learning... (Use #hashtags)"
                      className="post-input"
                      value={description}
                      onChange={handleDescriptionChange}
                      disabled={uploading}
                    />
                  </div>
                  <div className={`char-counter ${charCount > MAX_CHARS * 0.9 ? 'warning' : ''}`}>
                    {charCount}/{MAX_CHARS}
                  </div>
                  {previewUrls.length > 0 && (
                    <div className="media-preview">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="preview-item">
                          {mediaFiles[index].type.startsWith('image/') ? (
                            <img src={url} alt={`Preview ${index}`} />
                          ) : (
                            <video controls>
                              <source src={url} type={mediaFiles[index].type} />
                            </video>
                          )}
                          <button
                            type="button"
                            className="remove-media"
                            onClick={() => removeMedia(index)}
                            disabled={uploading}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="post-actions">
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={triggerFileInput}
                      disabled={mediaFiles.length >= MAX_MEDIA || uploading}
                    >
                      📷 {mediaFiles.length > 0 ? 'Add More' : 'Add Media'}
                    </Button>
                    {/* <Button variant="outline-primary" size="sm" className="ms-2">
                      <FaBookOpen className="me-1" /> Add Resource
                    </Button>
                    <Button variant="outline-success" size="sm" className="ms-2">
                      <FaChalkboardTeacher className="me-1" /> Ask Question
                    </Button> */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      className="ms-auto"
                      disabled={uploading || description.trim().length === 0}
                    >
                      {uploading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-1" />
                          Posting...
                        </>
                      ) : (
                        'Post'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card>

              <div className="feed-tabs">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-btn ${tab.active ? 'active' : ''}`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              <PostList userId={currentUser.id} user={currentUser} />
            </Col>

            {/* Right Sidebar */}
            <Col lg={3} className="right-sidebar d-none d-lg-block">
              <Card className="quick-actions-card mb-4">
                <Card.Body>
                  <h5>Quick Actions</h5>
                  <div className="actions-list">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant}
                        className="action-btn"
                        onClick={action.onClick}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              <Card className="suggested-people-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Suggested People</h5>
                    <Button variant="link" className="see-all-btn">See All</Button>
                  </div>
                  <div className="people-list">
                    {suggestedPeople.map((person, index) => (
                      <div key={index} className="person-item">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="person-avatar"
                        />
                        <div className="person-info">
                          <h6>{person.name}</h6>
                          <p className="text-muted">{person.skill}</p>
                        </div>
                        <Button variant="outline-primary" size="sm" className="follow-btn">
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              <Button variant="light" className="notifications-btn">
                <IoMdNotificationsOutline size={20} />
                <span className="notification-count">3</span>
              </Button>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default MainPage;