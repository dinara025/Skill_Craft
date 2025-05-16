import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import {
  FaUserPlus,
  FaChalkboardTeacher,
  FaBook,
  FaComments,
} from 'react-icons/fa';
import { BsPlusCircleFill } from 'react-icons/bs';
import Header from '../components/Header';
import PostList from '../components/PostList';
import NavBar from '../components/NavBar';
import CreatePost from './CreatePost';
import '../styles/MainPage.css';

const MainPage = ({ user }) => {
  const navigate = useNavigate();
  const [showNavBar, setShowNavBar] = useState(false);

  // ------------------ TOKEN EXPIRATION CHECK ------------------
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload); // Debug token
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry - 5000;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  };

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtUsername');
    navigate('/login');
  };

  // ------------------ AUTH CHECK AND AUTO-LOGOUT ------------------
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token || isTokenExpired(token)) {
      console.warn('No valid token found, redirecting to login');
      alert('Please log in to continue.');
      handleLogout();
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    const timeLeft = expiry - Date.now();

    if (timeLeft <= 0) {
      alert('Your session has expired. Please log in again.');
      handleLogout();
      return;
    }

    const timeout = setTimeout(() => {
      alert('Your session has expired. Please log in again.');
      handleLogout();
    }, timeLeft);

    // Log user prop for debugging
    console.log('MainPage user prop:', user);
    if (user && user.id) {
      console.log('User ID passed to Header:', user.id);
    } else {
      console.warn('User prop missing or incomplete:', user);
    }

    return () => clearTimeout(timeout);
  }, [navigate, user]);

  // Construct currentUser with fallback for undefined user
  const currentUser = user && user.id && user.username
    ? {
        id: user.id,
        name: user.username,
        handle: `@${user.username.toLowerCase()}`,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        skills: user.skills || ['UI/UX', 'React', 'Figma'],
      }
    : {
        id: null,
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
      <Header onMenuClick={() => setShowNavBar(true)} user={user} />
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
                {user && user.id && (
                  <Button
                    variant="danger"
                    className="mt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                )}
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
              {user && user.id ? (
                <CreatePost user={user} currentUser={currentUser} />
              ) : (
                <Card className="text-center mb-3">
                  <Card.Body>
                    <p>Please log in to create posts.</p>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/login')}
                    >
                      Log In
                    </Button>
                  </Card.Body>
                </Card>
              )}
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
                        disabled={!user || !user.id}
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
                          disabled={!user || !user.id}
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
                disabled={!user || !user.id}
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