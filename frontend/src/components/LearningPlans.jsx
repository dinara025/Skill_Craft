import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, InputGroup, Form, Offcanvas } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {
    FaSearch,
    FaUserPlus,
    FaChalkboardTeacher,
    FaBook,
    FaBookOpen
  } from 'react-icons/fa';
import { BsPlusCircleFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import {
  fetchPlansByUser,
  createPlan,
  updatePlan,
  deletePlan
} from '../services/learningServices';

import "../styles/MainPage.css";
import "../styles/LearningPlans.css";

const initialForm = {
  title: "",
  description: "",
  topics: "",
  resources: "",
  targetCompletionDate: "",
  completed: false,
};

const LearningPlans = ({ user }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [showNavBar, setShowNavBar] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem('usersId');

  useEffect(() => {
    if (userId) fetchPlans();
  }, [userId]);

  const fetchPlans = () => {
    fetchPlansByUser(userId)
      .then(res => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      ...form,
      userId,
      topics: form.topics.split(',').map(t => t.trim()),
      resources: form.resources.split(',').map(r => r.trim()),
    };

    const req = editId
      ? updatePlan(editId, payload)
      : createPlan(payload);

    req.then(() => {
      fetchPlans();
      closeDrawer();
    }).catch(err => console.error(err));
  };

  const handleDelete = id => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      deletePlan(id).then(() => fetchPlans());
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openDrawer = (plan = null) => {
    if (plan) {
      setEditId(plan.id);
      setForm({
        title: plan.title,
        description: plan.description,
        topics: plan.topics.join(", "),
        resources: plan.resources.join(", "),
        targetCompletionDate: plan.targetCompletionDate,
        completed: plan.completed,
      });
    } else {
      setEditId(null);
      setForm(initialForm);
    }
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setForm(initialForm);
    setEditId(null);
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
                <Button variant="danger" className="mt-2" onClick={() => {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('jwtUsername');
                window.location.reload();
                }}>
                Logout
                </Button>
            </Card>

            <Card className="trending-card">
                <Card.Body>
                <h5>Trending Skills</h5>
                <ul className="trending-list">
                    {[
                    { name: "React.js", posts: 1243 },
                    { name: "UI Design", posts: 892 },
                    { name: "Python", posts: 765 },
                    { name: "Digital Marketing", posts: 543 }
                    ].map((skill, index) => (
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
            <Col lg={6}>
              <div className="learning-plans-container">
                <h2>Your Learning Plans</h2>
                <Button className="create-btn mb-3" onClick={() => openDrawer()}>
                  <BsPlusCircleFill className="me-1" /> Create New Plan
                </Button>
                {loading ? <p>Loading...</p> : (
                  <div className="plan-list">
                    {plans.map(plan => (
                      <Card key={plan.id} className="plan-card shadow-sm mb-4 p-3">
                        <h4>{plan.title}</h4>
                        <p className="text-muted">{plan.description}</p>
                        <p><strong>Topics:</strong> {plan.topics.join(", ")}</p>
                        <p><strong>Resources:</strong> {plan.resources.join(", ")}</p>
                        <p><strong>Target Date:</strong> {plan.targetCompletionDate}</p>
                        <p><strong>Status:</strong> {plan.completed ? "✅ Completed" : "⌛ In Progress"}</p>
                        <div className="d-flex gap-2 mt-2">
                          <Button size="sm" variant="outline-primary" onClick={() => openDrawer(plan)}>Edit</Button>
                          <Button size="sm" variant="danger" onClick={() => handleDelete(plan.id)}>Delete</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Col>

            {/* Right Sidebar */}
        <Col lg={3} className="right-sidebar d-none d-lg-block">
        <InputGroup className="search-bar mb-4">
            <InputGroup.Text>
            <FaSearch />
            </InputGroup.Text>
            <Form.Control
            type="search"
            placeholder="Search skills, people, posts..."
            />
        </InputGroup>

        <Card className="quick-actions-card mb-4">
            <Card.Body>
            <h5>Quick Actions</h5>
            <div className="actions-list">
                {[
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
                ].map((action, index) => (
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
                {[
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
                ].map((person, index) => (
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

      {/* Offcanvas Drawer */}
      <Offcanvas show={showDrawer} onHide={closeDrawer} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{editId ? "Edit Plan" : "Create Plan"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={form.title} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={form.description} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Topics</Form.Label>
              <Form.Control name="topics" value={form.topics} onChange={handleInputChange} placeholder="Comma-separated" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Resources</Form.Label>
              <Form.Control name="resources" value={form.resources} onChange={handleInputChange} placeholder="Comma-separated" />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Target Completion Date</Form.Label>
              <Form.Control type="date" name="targetCompletionDate" value={form.targetCompletionDate} onChange={handleInputChange} />
            </Form.Group>
            <Form.Check type="checkbox" label="Completed" name="completed" checked={form.completed} onChange={handleInputChange} />
            <div className="mt-3 d-flex gap-2">
              <Button type="submit" variant="success">{editId ? "Update" : "Create"}</Button>
              <Button variant="secondary" onClick={closeDrawer}>Cancel</Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default LearningPlans;
