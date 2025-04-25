import React, { useState, useEffect } from 'react';
import {
  sendFollowRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  deleteRequest
} from '../services/followService';
import { Tab, Nav, Button, ListGroup, Badge } from 'react-bootstrap';

const FollowSystem = ({ senderId }) => {
  const [receiverId, setReceiverId] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const refreshData = () => {
    getSentRequests(senderId).then(res => setSentRequests(res.data));
    getReceivedRequests(senderId).then(res => setReceivedRequests(res.data));
  };

  useEffect(() => {
    if (senderId) refreshData();
  }, [senderId]);

  const handleSend = () => {
    if (!receiverId || receiverId === senderId) return;
    sendFollowRequest(senderId, receiverId).then(() => {
      setReceiverId('');
      refreshData();
    });
  };

  const handleAction = (id, status) => {
    updateRequestStatus(id, status).then(() => refreshData());
  };

  const handleDelete = (id) => {
    deleteRequest(id).then(() => refreshData());
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Welcome, {senderId}</h3>

      <div className="mb-4 d-flex">
        <input
          className="form-control me-2"
          placeholder="Enter username to follow"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <Button onClick={handleSend}>Follow</Button>
      </div>

      <Tab.Container defaultActiveKey="sent">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="sent">Sent Requests</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="received">Friend Requests</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          {/* Sent Requests */}
          <Tab.Pane eventKey="sent">
            <ListGroup>
              {sentRequests.map(req => (
                <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{req.receiverId}</strong>
                    <Badge bg="secondary" className="ms-2">{req.status}</Badge>
                  </div>
                  <div>
                    {req.status === 'pending' && (
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(req.id)}>Cancel</Button>
                    )}
                    {req.status === 'accepted' && (
                      <Button variant="outline-warning" size="sm" onClick={() => handleAction(req.id, 'unfollow')}>Unfollow</Button>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab.Pane>

          {/* Received Requests */}
          <Tab.Pane eventKey="received">
            <ListGroup>
              {receivedRequests.map(req => (
                <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{req.senderId}</strong>
                    <Badge bg="info" className="ms-2">{req.status}</Badge>
                  </div>
                  <div>
                    {req.status === 'pending' && (
                      <>
                        <Button variant="primary" size="sm" onClick={() => handleAction(req.id, 'accepted')}>Confirm</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleAction(req.id, 'declined')}>Delete</Button>
                      </>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default FollowSystem;
