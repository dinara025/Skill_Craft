import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserPlus, FaChalkboardTeacher, FaBookOpen } from 'react-icons/fa';

const MainPage = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
      <h1 className="mb-5 text-center fw-bold">Welcome to SkillCraft</h1>
      <Row className="g-4 w-100 justify-content-center">
        <Col xs={10} sm={6} md={4}>
          <Card className="text-center shadow-lg border-0">
            <Card.Body>
              <FaUserPlus size={40} className="mb-3 text-primary" />
              <Card.Title>Follow Requests</Card.Title>
              <Button variant="outline-primary" size="lg" className="mt-3" href="/follow-requests">
                Go
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={10} sm={6} md={4}>
          <Card className="text-center shadow-lg border-0">
            <Card.Body>
              <FaChalkboardTeacher size={40} className="mb-3 text-success" />
              <Card.Title>Learning Plans</Card.Title>
              <Button variant="outline-success" size="lg" className="mt-3" href="/learning-plans">
                Explore
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={10} sm={6} md={4}>
          <Card className="text-center shadow-lg border-0">
            <Card.Body>
              <FaBookOpen size={40} className="mb-3 text-warning" />
              <Card.Title>Courses</Card.Title>
              <Button variant="outline-warning" size="lg" className="mt-3" href="/courses">
                Start
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MainPage;
