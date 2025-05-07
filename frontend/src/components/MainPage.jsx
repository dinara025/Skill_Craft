import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import {
  FaUserPlus,
  FaChalkboardTeacher,
  FaBook,
  FaBookOpen
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsPlusCircleFill } from 'react-icons/bs';
import Header from '../components/Header';
import PostList from '../components/PostList';
import NavBar from '../components/NavBar';
import '../styles/MainPage.css';

const MainPage = ({ user }) => {
  const navigate = useNavigate();

  // ------------------ 🔥 STATE FOR NAVBAR (Sidebar) ------------------
  const [showNavBar, setShowNavBar] = useState(false);

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
      variant: "outline-success"
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
                <div className="post-input-container">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="post-avatar"
                  />
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Share what you're learning..."
                    className="post-input"
                  />
                </div>
        <div className="post-actions">
                  <Button variant="outline-primary" size="sm">
                    <FaBookOpen className="me-1" /> Add Resource
                  </Button>
                  <Button variant="outline-success" size="sm" className="ms-2">
                    <FaChalkboardTeacher className="me-1" /> Ask Question
                  </Button>
                  <Button variant="primary" size="sm" className="ms-auto">
                    Post
                  </Button>
                </div>
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