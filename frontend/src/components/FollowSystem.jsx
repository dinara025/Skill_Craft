import React, { useState, useEffect } from 'react';
import {
  sendFollowRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  deleteRequest
} from '../services/followService';
import { getAllUsers } from '../services/authService';
import { Tab, Nav, Button, ListGroup, Badge, Form } from 'react-bootstrap';

const FollowSystem = ({ senderId }) => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);

  const refreshData = () => {
    getSentRequests(senderId).then(res => {
      setSentRequests(res.data);
      const accepted = res.data.filter(r => r.status === 'accepted');
      setFriends(accepted);
    });

    getReceivedRequests(senderId).then(res => {
      setReceivedRequests(res.data);
    });
  };

  const loadUsers = async () => {
    const res = await getAllUsers();
    const followedIds = sentRequests.map(req => req.receiverId);
    const filteredUsers = res.data.filter(user =>
      user.username !== senderId && !followedIds.includes(user.username)
    );
    setAllUsers(filteredUsers);
  };

  useEffect(() => {
    if (senderId) {
      refreshData();
    }
  }, [senderId]);

  useEffect(() => {
    if (senderId) {
      loadUsers();
    }
  }, [senderId, sentRequests]);

  const handleSend = (receiverId) => {
    sendFollowRequest(senderId, receiverId).then(() => {
      refreshData();
      loadUsers();
    });
  };

  const handleAction = (id, status) => {
    updateRequestStatus(id, status).then(() => {
      refreshData();
      loadUsers();
    });
  };

  const handleDelete = (id) => {
    deleteRequest(id).then(() => {
      refreshData();
      loadUsers();
    });
  };

  const filteredUsers = allUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Welcome, {senderId}</h3>

      <div className="mb-4">
        <h5>Search Users to Follow</h5>
        <Form.Control
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <ListGroup.Item
                key={user.id}
                className="d-flex justify-content-between align-items-center"
              >
                <span>{user.username}</span>
                <Button
                  size="sm"
                  onClick={() => handleSend(user.username)}
                >
                  Follow
                </Button>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No users found</ListGroup.Item>
          )}
        </ListGroup>
      </div>

      <Tab.Container defaultActiveKey="sent">
        <Nav variant="tabs">
          <Nav.Item>
            <Nav.Link eventKey="sent">Sent Requests</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="received">Friend Requests</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="friends">Friends</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          {/* Sent Requests */}
          <Tab.Pane eventKey="sent">
            <ListGroup>
              {sentRequests
                .filter(req => req.status === 'pending')
                .map(req => (
                  <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{req.receiverId}</strong>
                      <Badge bg="secondary" className="ms-2">{req.status}</Badge>
                    </div>
                    <div>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(req.id)}>Cancel</Button>
                    </div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Tab.Pane>

          {/* Received Requests */}
          <Tab.Pane eventKey="received">
            <ListGroup>
              {receivedRequests
                .filter(req => req.status === 'pending')
                .map(req => (
                  <ListGroup.Item key={req.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{req.senderId}</strong>
                      <Badge bg="info" className="ms-2">{req.status}</Badge>
                    </div>
                    <div>
                      <Button variant="primary" size="sm" onClick={() => handleAction(req.id, 'accepted')}>Confirm</Button>{' '}
                      <Button variant="danger" size="sm" onClick={() => handleAction(req.id, 'declined')}>Delete</Button>
                    </div>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Tab.Pane>

          {/* Friends Tab */}
          <Tab.Pane eventKey="friends">
            <ListGroup>
              {friends.map(friend => (
                <ListGroup.Item key={friend.id} className="d-flex justify-content-between align-items-center">
                  <strong>{friend.receiverId}</strong>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => handleAction(friend.id, 'unfollow')}
                  >
                    Unfollow
                  </Button>
                </ListGroup.Item>
              ))}
              {friends.length === 0 && (
                <ListGroup.Item>No friends yet</ListGroup.Item>
              )}
            </ListGroup>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default FollowSystem;
