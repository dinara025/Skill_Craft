import React, { useState, useEffect } from 'react';
import {
  sendFollowRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  deleteRequest
} from '../services/followService';
import { getAllUsers } from '../services/authService';
import { Tab, Nav, Button, ListGroup, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaUserPlus, FaUserCheck, FaUserTimes, FaUserMinus, FaUserClock } from 'react-icons/fa';
import '../styles/FollowSystem.css';

const FollowSystem = ({ senderId }) => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('sent');
  const [mutualFriends, setMutualFriends] = useState([]);

  const refreshData = async () => {
    const sentRes = await getSentRequests(senderId);
    const receivedRes = await getReceivedRequests(senderId);
    setSentRequests(sentRes.data);
    setReceivedRequests(receivedRes.data);
  };

  const loadUsers = async () => {
    const res = await getAllUsers();
    const blockedUsernames = sentRequests
      .filter(req => req.status === 'pending' || req.status === 'accepted')
      .map(req => req.receiverId);
    const filteredUsers = res.data.filter(user => {
      const isSelf = user.username === senderId;
      const isBlocked = blockedUsernames.includes(user.username);
      const isAlreadyFriend = friends.includes(user.username);
      return !isSelf && !isBlocked && !isAlreadyFriend;
    });
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

    const mutuals = outgoingAccepted.filter(user => incomingAccepted.includes(user));
    setMutualFriends(mutuals);
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
    <div className="follow-system-container">
      <h2>Connect with Others</h2>

      <div className="search-section">
        <InputGroup className="mb-4">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search users to follow..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {searchTerm.length > 0 && (
          <div className="search-results">
            {filteredUsers.length > 0 ? (
              <ListGroup>
                {filteredUsers.map(user => (
                  <ListGroup.Item key={user.id} className="user-item">
                    <div className="user-info">
                      <span className="username">{user.username}</span>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleSend(user.username)}
                      className="follow-btn"
                    >
                      <FaUserPlus className="me-1" /> Follow
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="no-results">No users found</div>
            )}
          </div>
        )}
      </div>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="follow-tabs">
          <Nav.Item>
            <Nav.Link eventKey="sent">
              <FaUserClock className="me-1" /> Sent
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="received">
              <FaUserPlus className="me-1" /> Requests
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="followers">
              <FaUserCheck className="me-1" /> Followers
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="mutual">
              <FaUserCheck className="me-1" /> Mutual Friends
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="follow-tab-content">
          {/* Sent Requests */}
          <Tab.Pane eventKey="sent">
            {sentRequests.filter(req => req.status === 'pending').length > 0 ? (
              <ListGroup>
                {sentRequests
                  .filter(req => req.status === 'pending')
                  .map(req => (
                    <ListGroup.Item key={req.id}>
                      {req.receiverId}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(req.id)}
                        className="float-end"
                      >
                        <FaUserTimes /> Cancel
                      </Button>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            ) : (
              <div className="empty-state">No pending sent requests</div>
            )}
          </Tab.Pane>

          {/* Received Requests */}
          <Tab.Pane eventKey="received">
            {receivedRequests.filter(req => req.status === 'pending').length > 0 ? (
              <ListGroup>
                {receivedRequests
                  .filter(req => req.status === 'pending')
                  .map(req => (
                    <ListGroup.Item key={req.id}>
                      {req.senderId}
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleAction(req.id, 'accepted')}
                        className="float-end"
                      >
                        <FaUserCheck /> Accept
                      </Button>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            ) : (
              <div className="empty-state">No friend requests</div>
            )}
          </Tab.Pane>

          {/* Friends */}
          <Tab.Pane eventKey="followers">
            {friends.length > 0 ? (
              <ListGroup>
                {friends.map(friendUsername => (
                  <ListGroup.Item key={friendUsername}>
                    {friendUsername}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="empty-state">No friends yet</div>
            )}
          </Tab.Pane>

          {/* Mutual Friends */}
          <Tab.Pane eventKey="mutual">
            {mutualFriends.length > 0 ? (
              <ListGroup>
                {mutualFriends.map(username => (
                  <ListGroup.Item key={username}>
                    {username}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="empty-state">No mutual friends</div>
            )}
          </Tab.Pane>

        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default FollowSystem;
