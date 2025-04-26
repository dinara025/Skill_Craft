// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
// import { 
//   FaSearch, 
//   FaUserPlus, 
//   FaChalkboardTeacher, 
//   FaBookOpen,
//   FaHeart, 
//   FaRegHeart,
//   FaComment,
//   FaShare,
//   FaBookmark,
//   FaRegBookmark,
//   FaEllipsisH
// } from 'react-icons/fa';
// import { IoMdNotificationsOutline } from 'react-icons/io';
// import { BsPlusCircleFill } from 'react-icons/bs';
// import Header from '../components/Header';
// import '../styles/MainPage.css';




// const MainPage = ({ user, children }) => {
//   // Use the user data from props if available
//   const currentUser = user ? {
//     id: user.id,             // MongoDB document ID
//     name: user.username,     // Display username as the name
//     handle: `@${user.username.toLowerCase()}`, // Create handle from username
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Default avatar
//     skills: ["UI/UX", "React", "Figma"] // Default skills (you may want to add these to your User model later)
//   } : {
//     // Fallback data if no user is provided
//     name: "Guest User",
//     handle: "@guest",
//     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//     skills: []
//   };

//   const navigate = useNavigate();

//   // Navigation tabs
//   const tabs = [
//     { id: 1, name: "For You", active: true },
//     { id: 2, name: "Following" },
//     { id: 3, name: "Popular" },
//     { id: 4, name: "Learning" }
//   ];

//   // Quick actions
//   const quickActions = [
//     {
//       icon: <BsPlusCircleFill className="action-icon" />,
//       label: "Create Post",
//       variant: "primary",
//       onClick: () => navigate("/create-post")
//     },
//     {
//       icon: <FaUserPlus className="action-icon" />,
//       label: "Find Friends",
//       variant: "outline-primary",
//       onClick: () => navigate("/follow-system") // Navigate to FollowSystem page
//     },
//     {
//       icon: <FaChalkboardTeacher className="action-icon" />,
//       label: "Start Teaching",
//       variant: "outline-success"
//     }
//   ];

//   // Trending skills
//   const trendingSkills = [
//     { name: "React.js", posts: 1243 },
//     { name: "UI Design", posts: 892 },
//     { name: "Python", posts: 765 },
//     { name: "Digital Marketing", posts: 543 }
//   ];

//   // Suggested people to follow
//   const suggestedPeople = [
//     {
//       name: "Sarah Miller",
//       handle: "@sarahdesigns",
//       avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//       skill: "UI/UX Designer"
//     },
//     {
//       name: "Michael Chen",
//       handle: "@michaelcode",
//       avatar: "https://randomuser.me/api/portraits/men/22.jpg",
//       skill: "Full Stack Developer"
//     },
//     {
//       name: "Priya Patel",
//       handle: "@priyatech",
//       avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//       skill: "Data Scientist"
//     }
//   ];

//   // Community posts
//   const communityPosts = [
//     {
//       id: 1,
//       user: {
//         name: "Emma Watson",
//         handle: "@emmawcodes",
//         avatar: "https://randomuser.me/api/portraits/women/33.jpg",
//         verified: true
//       },
//       content: {
//         text: "Just published my new course on Advanced React Patterns! Check it out and let me know what you think. #react #frontend",
//         image: "https://source.unsplash.com/600x400/?coding,react",
//         likes: 142,
//         comments: 28,
//         shares: 12,
//         isLiked: false,
//         isBookmarked: false,
//         time: "2 hours ago"
//       }
//     },
//     {
//       id: 2,
//       user: {
//         name: "David Kim",
//         handle: "@davidux",
//         avatar: "https://randomuser.me/api/portraits/men/45.jpg",
//         verified: false
//       },
//       content: {
//         text: "Sharing my latest Figma tutorial on creating responsive components. Who's working on UI design this weekend? #figma #uidesign",
//         image: "https://source.unsplash.com/600x400/?figma,design",
//         likes: 89,
//         comments: 15,
//         shares: 5,
//         isLiked: true,
//         isBookmarked: true,
//         time: "5 hours ago"
//       }
//     },
//     {
//       id: 3,
//       user: {
//         name: "Lisa Ray",
//         handle: "@lisapython",
//         avatar: "https://randomuser.me/api/portraits/women/65.jpg",
//         verified: true
//       },
//       content: {
//         text: "Python developers! I'm hosting a live Q&A tomorrow about Django best practices. Drop your questions below! #python #django",
//         image: "https://source.unsplash.com/600x400/?python,code",
//         likes: 256,
//         comments: 42,
//         shares: 31,
//         isLiked: false,
//         isBookmarked: false,
//         time: "1 day ago"
//       }
//     }
//   ];

//   return (
//     <div className="skillshare-social">
//       <Header />
      
//       <main className="main-content">
//         <Container fluid>
//           <Row>
//             {/* Left Sidebar */}
//             <Col lg={3} className="left-sidebar d-none d-lg-block">
//               <Card className="profile-card">
//                 <div className="profile-header">
//                   <img 
//                     src={currentUser.avatar} 
//                     alt={currentUser.name} 
//                     className="profile-avatar"
//                   />
//                   <div className="profile-info">
//                     <h5>{currentUser.name}</h5>
//                     <p className="text-muted">{currentUser.handle}</p>
//                   </div>
//                 </div>
                
//                 <div className="profile-skills">
//                   <h6>My Skills</h6>
//                   <div className="skills-list">
//                     {currentUser.skills.map((skill, index) => (
//                       <span key={index} className="skill-badge">{skill}</span>
//                     ))}
//                   </div>
//                 </div>
                
//                 <Button variant="outline-primary" className="edit-profile-btn">
//                   Edit Profile
//                 </Button>
//               </Card>
              
//               <Card className="trending-card">
//                 <Card.Body>
//                   <h5>Trending Skills</h5>
//                   <ul className="trending-list">
//                     {trendingSkills.map((skill, index) => (
//                       <li key={index}>
//                         <span className="skill-name">{skill.name}</span>
//                         <span className="post-count">{skill.posts} posts</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </Card.Body>
//               </Card>
//             </Col>
            
//             {/* Main Content */}
//             <Col lg={6} className="main-feed">
//               {/* Create Post */}
//               <Card className="create-post-card">
//                 <div className="post-input-container">
//                   <img 
//                     src={currentUser.avatar} 
//                     alt={currentUser.name} 
//                     className="post-avatar"
//                   />
//                   <Form.Control 
//                     as="textarea" 
//                     rows={2} 
//                     placeholder="Share what you're learning..." 
//                     className="post-input"
//                   />
//                 </div>
//                 <div className="post-actions">
//                   <Button variant="outline-primary" size="sm">
//                     <FaBookOpen className="me-1" /> Add Resource
//                   </Button>
//                   <Button variant="outline-success" size="sm" className="ms-2">
//                     <FaChalkboardTeacher className="me-1" /> Ask Question
//                   </Button>
//                   <Button variant="primary" size="sm" className="ms-auto">
//                     Post
//                   </Button>
//                 </div>
//               </Card>
              
//               {/* Feed Tabs */}
//               <div className="feed-tabs">
//                 {tabs.map(tab => (
//                   <button 
//                     key={tab.id} 
//                     className={`tab-btn ${tab.active ? 'active' : ''}`}
//                   >
//                     {tab.name}
//                   </button>
//                 ))}
//               </div>
              
//               {/* Community Posts */}
//               {communityPosts.map(post => (
//                 <Card key={post.id} className="post-card">
//                   {/* Post Header */}
//                   <Card.Header className="post-header">
//                     <div className="user-info">
//                       <img 
//                         src={post.user.avatar} 
//                         alt={post.user.name} 
//                         className="user-avatar"
//                       />
//                       <div>
//                         <h6 className="user-name">
//                           {post.user.name}
//                           {post.user.verified && <span className="verified-badge">✓</span>}
//                         </h6>
//                         <p className="user-handle">{post.user.handle} · {post.content.time}</p>
//                       </div>
//                     </div>
//                     <Button variant="link" className="post-options">
//                       <FaEllipsisH />
//                     </Button>
//                   </Card.Header>
                  
//                   {/* Post Content */}
//                   <Card.Body>
//                     <Card.Text className="post-text">
//                       {post.content.text}
//                     </Card.Text>
//                     {post.content.image && (
//                       <div className="post-image-container">
//                         <img 
//                           src={post.content.image} 
//                           alt="Post content" 
//                           className="post-image"
//                         />
//                       </div>
//                     )}
//                   </Card.Body>
                  
//                   {/* Post Footer */}
//                   <Card.Footer className="post-footer">
//                     <div className="engagement-actions">
//                       <Button variant="link" className={`like-btn ${post.content.isLiked ? 'liked' : ''}`}>
//                         {post.content.isLiked ? <FaHeart /> : <FaRegHeart />}
//                         <span>{post.content.likes}</span>
//                       </Button>
//                       <Button variant="link" className="comment-btn">
//                         <FaComment />
//                         <span>{post.content.comments}</span>
//                       </Button>
//                       <Button variant="link" className="share-btn">
//                         <FaShare />
//                         <span>{post.content.shares}</span>
//                       </Button>
//                     </div>
//                     <Button variant="link" className={`bookmark-btn ${post.content.isBookmarked ? 'bookmarked' : ''}`}>
//                       {post.content.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
//                     </Button>
//                   </Card.Footer>
//                 </Card>
//               ))}
//             </Col>
            
//             {/* Right Sidebar */}
//             <Col lg={3} className="right-sidebar d-none d-lg-block">
//               {/* Search */}
//               <InputGroup className="search-bar mb-4">
//                 <InputGroup.Text>
//                   <FaSearch />
//                 </InputGroup.Text>
//                 <Form.Control 
//                   type="search" 
//                   placeholder="Search skills, people, posts..." 
//                 />
//               </InputGroup>
              
//               {/* Quick Actions */}
//               <Card className="quick-actions-card mb-4">
//                 <Card.Body>
//                   <h5>Quick Actions</h5>
//                   <div className="actions-list">
//                   {quickActions.map((action, index) => (
//                          <Button key={index} variant={action.variant} className="action-btn" onClick={action.onClick}>
//                            {action.icon}
//                            {action.label}
//                          </Button>
//                        ))}

//                   </div>
//                 </Card.Body>
//               </Card>
              
//               {/* Suggested People */}
//               <Card className="suggested-people-card">
//                 <Card.Body>
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="mb-0">Suggested People</h5>
//                     <Button variant="link" className="see-all-btn">See All</Button>
//                   </div>
                  
//                   <div className="people-list">
//                     {suggestedPeople.map((person, index) => (
//                       <div key={index} className="person-item">
//                         <img 
//                           src={person.avatar} 
//                           alt={person.name} 
//                           className="person-avatar"
//                         />
//                         <div className="person-info">
//                           <h6>{person.name}</h6>
//                           <p className="text-muted">{person.skill}</p>
//                         </div>
//                         <Button variant="outline-primary" size="sm" className="follow-btn">
//                           Follow
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </Card.Body>
//               </Card>
              
//               {/* Notifications */}
//               <Button variant="light" className="notifications-btn">
//                 <IoMdNotificationsOutline size={20} />
//                 <span className="notification-count">3</span>
//               </Button>
//             </Col>
//           </Row>
//         </Container>
//       </main>
//     </div>
//   );
// };

// export default MainPage;

// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
// // import { FaSearch, FaUserPlus, FaChalkboardTeacher, FaBookOpen } from 'react-icons/fa';
// // import { BsPlusCircleFill } from 'react-icons/bs';
// // import Header from '../components/Header';
// // import '../styles/MainPage.css';

// // const MainPage = ({ user, children }) => {
// //   const currentUser = user ? {
// //     id: user.id,
// //     name: user.username,
// //     handle: `@${user.username.toLowerCase()}`,
// //     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
// //     skills: ["UI/UX", "React", "Figma"]
// //   } : {
// //     name: "Guest User",
// //     handle: "@guest",
// //     avatar: "https://randomuser.me/api/portraits/men/32.jpg",
// //     skills: []
// //   };

// //   const navigate = useNavigate();

// //   // Quick actions
// //   const quickActions = [
// //     {
// //       icon: <BsPlusCircleFill className="action-icon" />,
// //       label: "Create Post",
// //       variant: "primary",
// //       onClick: () => navigate("/create-post")
// //     },
// //     {
// //       icon: <FaUserPlus className="action-icon" />,
// //       label: "Find Friends",
// //       variant: "outline-primary",
// //       onClick: () => navigate("/follow-system") // Navigate to FollowSystem page
// //     },
// //     {
// //       icon: <FaChalkboardTeacher className="action-icon" />,
// //       label: "Start Teaching",
// //       variant: "outline-success"
// //     }
// //   ];

// //   return (
// //     <div className="skillshare-social">
// //       <Header />

// //       <main className="main-content">
// //         <Container fluid>
// //           <Row>
// //             <Col lg={3} className="left-sidebar d-none d-lg-block">
// //               <Card className="profile-card">
// //                 <div className="profile-header">
// //                   <img src={currentUser.avatar} alt={currentUser.name} className="profile-avatar" />
// //                   <div className="profile-info">
// //                     <h5>{currentUser.name}</h5>
// //                     <p className="text-muted">{currentUser.handle}</p>
// //                   </div>
// //                 </div>

// //                 <Button variant="outline-primary" className="edit-profile-btn">
// //                   Edit Profile
// //                 </Button>
// //               </Card>
// //             </Col>

// //             <Col lg={6} className="main-feed">
// //               <Card className="create-post-card">
// //                 <div className="post-input-container">
// //                   <img src={currentUser.avatar} alt={currentUser.name} className="post-avatar" />
// //                   <Form.Control as="textarea" rows={2} placeholder="Share what you're learning..." className="post-input" />
// //                 </div>
// //               </Card>
// //             </Col>

// //             <Col lg={3} className="right-sidebar d-none d-lg-block">
// //               <Card className="quick-actions-card mb-4">
// //                 <Card.Body>
// //                   <h5>Quick Actions</h5>
// //                   <div className="actions-list">
// //                     {quickActions.map((action, index) => (
// //                       <Button key={index} variant={action.variant} className="action-btn" onClick={action.onClick}>
// //                         {action.icon}
// //                         {action.label}
// //                       </Button>
// //                     ))}
// //                   </div>
// //                 </Card.Body>
// //               </Card>
// //             </Col>
// //           </Row>
// //         </Container>
// //       </main>
// //     </div>
// //   );
// // };

// // export default MainPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
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
  FaEllipsisH
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

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        // Transform data to match the expected post structure
        const transformedPosts = data.map(post => ({
          id: post.id,
          user: {
            name: post.userId, // Ideally, fetch user details from a user service
            handle: `@${post.userId.toLowerCase()}`, // Placeholder handle
            avatar: "https://randomuser.me/api/portraits/lego/1.jpg", // Default avatar
            verified: false // Placeholder
          },
          content: {
            text: post.content,
            image: post.mediaLinks && post.mediaLinks.length > 0 ? post.mediaLinks[0] : null,
            likes: 0, // Not in model, placeholder
            comments: 0, // Not in model, placeholder
            shares: 0, // Not in model, placeholder
            isLiked: false, // Not in model, placeholder
            isBookmarked: false, // Not in model, placeholder
            time: new Date(post.createdAt).toLocaleString() // Format timestamp
          }
        }));
        setPosts(transformedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

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
              
              {/* Community Posts */}
              {posts.map(post => (
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
                    <Button variant="link" className="post-options">
                      <FaEllipsisH />
                    </Button>
                  </Card.Header>
                  
                  {/* Post Content */}
                  <Card.Body>
                    <Card.Text className="post-text">
                      {post.content.text}
                    </Card.Text>
                    {post.content.image && (
                      <div className="post-image-container">
                        <img 
                          src={post.content.image} 
                          alt="Post content" 
                          className="post-image"
                        />
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
              ))}
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