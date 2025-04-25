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

  const refreshData = async () => {
    const sentRes = await getSentRequests(senderId);
    const receivedRes = await getReceivedRequests(senderId);
    setSentRequests(sentRes.data);
    setReceivedRequests(receivedRes.data);
  };

  const loadUsers = async () => {
    const res = await getAllUsers();
    const followedIds = sentRequests
      .filter(req => req.status === 'pending' || req.status === 'accepted')
      .map(req => req.receiverId);

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
  }, [sentRequests]);

  useEffect(() => {
    const outgoingAccepted = sentRequests.filter(r => r.status === 'accepted').map(r => r.receiverId);
    const incomingAccepted = receivedRequests.filter(r => r.status === 'accepted').map(r => r.senderId);
    const allFriends = [...new Set([...outgoingAccepted, ...incomingAccepted])];
    setFriends(allFriends);
  }, [sentRequests, receivedRequests]);

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
      <h2>SkillCraft Platform</h2>
      <p><strong>Logged in as:</strong> {senderId}</p>

      {/* Search users to follow */}
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

      {/* Tabs */}
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
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(req.id)}>Cancel</Button>
                  </ListGroup.Item>
                ))}
              {sentRequests.filter(req => req.status === 'pending').length === 0 && (
                <ListGroup.Item>No pending sent requests</ListGroup.Item>
              )}
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
              {receivedRequests.filter(req => req.status === 'pending').length === 0 && (
                <ListGroup.Item>No friend requests</ListGroup.Item>
              )}
            </ListGroup>
          </Tab.Pane>

          {/* Friends Tab */}
          <Tab.Pane eventKey="friends">
            <ListGroup>
              {friends.map(friendUsername => (
                <ListGroup.Item key={friendUsername} className="d-flex justify-content-between align-items-center">
                  <strong>{friendUsername}</strong>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() => {
                      // Check in sentRequests
                      const sentReq = sentRequests.find(
                        req => req.receiverId === friendUsername && req.status === 'accepted'
                      );

                      if (sentReq) {
                        handleAction(sentReq.id, 'unfollow');
                        return;
                      }

                      // Check in receivedRequests
                      const receivedReq = receivedRequests.find(
                        req => req.senderId === friendUsername && req.status === 'accepted'
                      );

                      if (receivedReq) {
                        handleAction(receivedReq.id, 'unfollow');
                        return;
                      }

                      alert("Something went wrong. Could not unfollow.");
                    }}
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
