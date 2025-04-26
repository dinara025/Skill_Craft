import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { 
  FaSearch, 
  FaUserPlus, 
  FaChalkboardTeacher, 
  FaBookOpen,
  FaHeart, 
  FaRegHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { BsPlusCircleFill } from 'react-icons/bs';
import Header from '../components/Header';
import '../styles/MainPage.css';

const MainPage = ({ user, children }) => {
  // User data
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

  const navigate = useNavigate();

  // State for posts
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null); // Track which post's dropdown is open
  const dropdownRef = useRef(null);

  // Sample data for when API fails (with timestamps for sorting)
  const samplePosts = [
    {
      id: 1,
      user: {
        name: "Emma Watson",
        handle: "@emmawcodes",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        verified: true
      },
      content: {
        text: "Just published my new course on Advanced React Patterns! Check it out and let me know what you think. #react #frontend",
        mediaLinks: [
          "https://source.unsplash.com/600x400/?coding,react",
          "https://source.unsplash.com/600x400/?javascript,code",
          "https://source.unsplash.com/600x400/?frontend,dev"
        ],
        likes: 142,
        comments: 28,
        shares: 12,
        isLiked: false,
        isBookmarked: false,
        time: "2 hours ago",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    },
    {
      id: 2,
      user: {
        name: "David Kim",
        handle: "@davidux",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        verified: false
      },
      content: {
        text: "Sharing my latest Figma tutorial on creating responsive components. Who's working on UI design this weekend? #figma #uidesign",
        mediaLinks: ["https://source.unsplash.com/600x400/?figma,design"],
        likes: 89,
        comments: 15,
        shares: 5,
        isLiked: true,
        isBookmarked: true,
        time: "5 hours ago",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      }
    }
  ];

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        
        const text = await response.text();
        console.log('Raw API response:', text);
        
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Error parsing JSON:', parseError);
          throw new Error('Invalid JSON response from server');
        }
        
        if (Array.isArray(data) && data.length > 0) {
          // Transform data to match the expected post structure
          const transformedPosts = data.map(post => ({
            id: post.id || Math.random().toString(36).substr(2, 9),
            createdAt: post.createdAt,
            user: {
              name: post.username || 'Unknown User',
              handle: `@${(post.userId || 'user').toLowerCase()}`,
              avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
              verified: false
            },
            content: {
              text: post.content || '',
              mediaLinks: post.mediaLinks || [],
              likes: post.likes || 0,
              comments: post.comments || 0,
              shares: post.shares || 0,
              isLiked: false,
              isBookmarked: false,
              time: post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Recently',
              timestamp: post.createdAt ? new Date(post.createdAt) : new Date()
            }
          }));

          // Sort posts by createdAt in descending order (latest first)
          transformedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setPosts(transformedPosts);
        } else {
          console.log('No posts found or invalid data structure, using sample posts');
          // Sort sample posts by timestamp
          const sortedSamplePosts = [...samplePosts].sort((a, b) => b.content.timestamp - a.content.timestamp);
          setPosts(sortedSamplePosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Sort sample posts by timestamp
        const sortedSamplePosts = [...samplePosts].sort((a, b) => b.content.timestamp - a.content.timestamp);
        setPosts(sortedSamplePosts);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown for a specific post
  const toggleDropdown = (postId) => {
    setShowDropdown(showDropdown === postId ? null : postId);
  };

  // Handle edit post
  const handleEditPost = (postId) => {
    console.log(`Edit post ${postId}`);
    setShowDropdown(null);
    navigate(`/update-post/${postId}`);
  };

  // Handle delete post
  const handleDeletePost = (postId) => {
    console.log(`Delete post ${postId}`);
    setShowDropdown(null);
    // Add your delete logic here
    // For example:
    // setPosts(posts.filter(post => post.id !== postId));
  };

  // Navigation tabs
  const tabs = [
    { id: 1, name: "For You", active: true },
    { id: 2, name: "Following" },
    { id: 3, name: "Popular" },
    { id: 4, name: "Learning" }
  ];

  // Quick actions
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
    }
  ];

  // Trending skills (unchanged)
  const trendingSkills = [
    { name: "React.js", posts: 1243 },
    { name: "UI Design", posts: 892 },
    { name: "Python", posts: 765 },
    { name: "Digital Marketing", posts: 543 }
  ];

  // Suggested people (unchanged)
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
      <Header />
      
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
            
            {/* Main Content */}
            <Col lg={6} className="main-feed">
              {/* Create Post */}
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
              
              {/* Feed Tabs */}
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
              
              {/* Loading and Error States */}
              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading posts...</p>
                </div>
              ) : error ? (
                <Card className="error-card my-3">
                  <Card.Body>
                    <div className="text-center text-danger">
                      <h5>Error loading posts</h5>
                      <p>{error}</p>
                    </div>
                  </Card.Body>
                </Card>
              ) : posts.length === 0 ? (
                <Card className="my-3">
                  <Card.Body>
                    <div className="text-center">
                      <h5>No posts found</h5>
                      <p>Be the first to share something!</p>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                /* Community Posts */
                posts.map(post => (
                  <Card key={post.id} className="post-card">
                    {/* Post Header */}
                    <Card.Header className="post-header">
                      <div className="user-info">
                        <img 
                          src={post.user.avatar} 
                          alt={post.user.name} 
                          className="user-avatar"
                        />
                        <div>
                          <h6 className="user-name">
                            {post.user.name}
                            {post.user.verified && <span className="verified-badge">✓</span>}
                          </h6>
                          <p className="user-handle">{post.user.handle} · {post.content.time}</p>
                        </div>
                      </div>
                      <div className="post-options-container" ref={dropdownRef}>
                        <Button 
                          variant="link" 
                          className="post-options"
                          onClick={() => toggleDropdown(post.id)}
                        >
                          <FaEllipsisH />
                        </Button>
                        
                        {/* Dropdown Menu */}
                        {showDropdown === post.id && (
                          <Dropdown show className="post-dropdown-menu">
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleEditPost(post.id)}>
                                <FaEdit className="me-2" /> Edit Post
                              </Dropdown.Item>
                              <Dropdown.Item 
                                onClick={() => handleDeletePost(post.id)}
                                className="text-danger"
                              >
                                <FaTrash className="me-2" /> Delete Post
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </div>
                    </Card.Header>
                    
                    {/* Post Content */}
                    <Card.Body>
                      <Card.Text className="post-text">
                        {post.content.text}
                      </Card.Text>
                      {post.content.mediaLinks && post.content.mediaLinks.length > 0 && (
                        <div className="post-media-wrapper">
                          <div className="post-media-container">
                            {post.content.mediaLinks.map((link, index) => (
                              <div key={index} className="post-media-item">
                                <img 
                                  src={link} 
                                  alt={`Post media ${index}`} 
                                  className="post-media"
                                  onError={(e) => {e.target.style.display = 'none'}} 
                                />
                              </div>
                            ))}
                          </div>
                          {post.content.mediaLinks.length > 1 && (
                            <div className="media-dots">
                              {post.content.mediaLinks.map((_, index) => (
                                <span
                                  key={index}
                                  className={`media-dot ${index === 0 ? 'active' : ''}`}
                                  data-index={index}
                                ></span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Card.Body>
                    
                    {/* Post Footer */}
                    <Card.Footer className="post-footer">
                      <div className="engagement-actions">
                        <Button variant="link" className={`like-btn ${post.content.isLiked ? 'liked' : ''}`}>
                          {post.content.isLiked ? <FaHeart /> : <FaRegHeart />}
                          <span>{post.content.likes}</span>
                        </Button>
                        <Button variant="link" className="comment-btn">
                          <FaComment />
                          <span>{post.content.comments}</span>
                        </Button>
                        <Button variant="link" className="share-btn">
                          <FaShare />
                          <span>{post.content.shares}</span>
                        </Button>
                      </div>
                      <Button variant="link" className={`bookmark-btn ${post.content.isBookmarked ? 'bookmarked' : ''}`}>
                        {post.content.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                      </Button>
                    </Card.Footer>
                  </Card>
                ))
              )}
            </Col>
            
            {/* Right Sidebar */}
            <Col lg={3} className="right-sidebar d-none d-lg-block">
              {/* Search */}
              <InputGroup className="search-bar mb-4">
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control 
                  type="search" 
                  placeholder="Search skills, people, posts..." 
                />
              </InputGroup>
              
              {/* Quick Actions */}
              <Card className="quick-actions-card mb-4">
                <Card.Body>
                  <h5>Quick Actions</h5>
                  <div className="actions-list">
                    {quickActions.map((action, index) => (
                      <Button key={index} variant={action.variant} className="action-btn" onClick={action.onClick}>
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </Card.Body>
              </Card>
              
              {/* Suggested People */}
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
              
              {/* Notifications */}
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