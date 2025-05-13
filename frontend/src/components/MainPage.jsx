import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {
  FaUserPlus,
  FaChalkboardTeacher,
  FaBook,
  FaComments
} from 'react-icons/fa';
import { BsPlusCircleFill } from 'react-icons/bs';
import Header from '../components/Header';
import PostList from '../components/PostList';
import NavBar from '../components/NavBar';
import CreatePost from './CreatePost';
import '../styles/MainPage.css';
import { FaLightbulb } from 'react-icons/fa';


// ... other imports remain the same

const MainPage = ({ user }) => {
  const navigate = useNavigate();
  const [showNavBar, setShowNavBar] = useState(false);

  // ------------------ TOKEN EXPIRATION CHECK ------------------
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= (expiry - 5000);
    } catch (error) {
      return true;
    }
  };

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtUsername');
    window.location.href = '/login';
  };

  // ------------------ AUTO-LOGOUT ON TOKEN EXPIRY ------------------
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token && !isTokenExpired(token)) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const timeLeft = expiry - Date.now();
      if (timeLeft > 0) {
        const timeout = setTimeout(() => {
          alert('Your session has expired. Please log in again.');
          handleLogout();
        }, timeLeft);
        return () => clearTimeout(timeout);
      } else {
        alert('Your session has expired. Please log in again.');
        handleLogout();
      }
    }
  }, []);

  const currentUser = user
    ? {
        id: user.id,
        name: user.username,
        handle: `@${user.username.toLowerCase()}`,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        skills: ['UI/UX', 'React', 'Figma'],
      }
    : {
        name: 'Guest User',
        handle: '@guest',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        skills: [],
      };

  const quickActions = [
    {
      icon: <BsPlusCircleFill className="action-icon" />,
      label: 'Create Post',
      variant: 'primary',
      onClick: () => navigate('/create-post'),
    },
    {
      icon: <FaUserPlus className="action-icon" />,
      label: 'Find Friends',
      variant: 'outline-primary',
      onClick: () => navigate('/follow-system'),
    },
    {
      icon: <FaChalkboardTeacher className="action-icon" />,
      label: 'Start Teaching',
      variant: 'outline-success',
      onClick: () => navigate('/Learning'),
    },
    {
      icon: <FaBook className="action-icon" />,
      label: 'Learning Plans',
      variant: 'outline-info',
      onClick: () => navigate('/learning-plans'),
    },
  ];

  const trendingSkills = [
    { name: 'React.js', posts: 1243 },
    { name: 'UI Design', posts: 892 },
    { name: 'Python', posts: 765 },
    { name: 'Digital Marketing', posts: 543 },
  ];

  const suggestedPeople = [
    {
      name: 'Sarah Miller',
      handle: '@sarahdesigns',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      skill: 'UI/UX Designer',
    },
    {
      name: 'Michael Chen',
      handle: '@michaelcode',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      skill: 'Full Stack Developer',
    },
    {
      name: 'Priya Patel',
      handle: '@priyatech',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      skill: 'Data Scientist',
    },
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
              <CreatePost user={user} currentUser={currentUser} />

              {/* Removed feed-tabs section */}

              <PostList
                userId={currentUser.id}
                user={currentUser}
                // Removed `filter` prop if not needed anymore
              />
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
                    <Button variant="link" className="see-all-btn">
                      See All
                    </Button>
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
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="follow-btn"
                        >
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              <Button
              variant="light"
              className="community-help-btn"
              onClick={() => navigate('/threads')}
              aria-label="Get help from community"
            >
              <div className="btn-content">
                <FaComments className="chat-icon" />
                <span className="btn-text">Community Help</span>
                <div className="pulse-dot"></div>
              </div>
            </Button>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default MainPage;
