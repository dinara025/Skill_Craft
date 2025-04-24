import React, { useState, useEffect } from 'react';
import {
  sendFollowRequest,
  getSentRequests,
  getReceivedRequests,
  updateRequestStatus,
  deleteRequest
} from '../services/followService';

const mockUsers = ['user1', 'user2', 'user3', 'user4', 'user5'];

const FollowSystem = () => {
  const [senderId, setSenderId] = useState('user1');
  const [receiverId, setReceiverId] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const refreshData = () => {
    getSentRequests(senderId).then(res => setSentRequests(res.data));
    getReceivedRequests(senderId).then(res => setReceivedRequests(res.data));
  };

  useEffect(() => {
    refreshData();
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

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return '#f0ad4e';
      case 'accepted': return '#5cb85c';
      case 'declined': return '#d9534f';
      case 'unfollow': return '#999';
      default: return '#ccc';
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h2>Follow System</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label><strong>Sender (Logged in):</strong></label>
        <select value={senderId} onChange={(e) => setSenderId(e.target.value)} style={{ marginLeft: '1rem' }}>
          {mockUsers.map(user => <option key={user} value={user}>{user}</option>)}
        </select>
      </div>

      <div>
        <input
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          style={{ padding: '6px', width: '200px', marginRight: '10px' }}
        />
        <button onClick={handleSend}>Send Follow Request</button>
      </div>

      <hr />

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Sent Requests */}
        <div>
          <h3>Sent Requests</h3>
          <ul>
          {sentRequests.map(req => (
  <li key={req.id}>
    To: {req.receiverId} — <strong>{req.status}</strong>
    {req.status === 'pending' && (
      <>
        <button onClick={() => handleDelete(req.id)} style={{ marginLeft: '10px' }}>Cancel</button>
      </>
    )}
    {req.status === 'accepted' && (
      <>
        <button onClick={() => handleAction(req.id, 'unfollow')} style={{ marginLeft: '10px' }}>Unfollow</button>
      </>
    )}
  </li>
))}
          </ul>
        </div>

        {/* Received Requests */}
        <div>
          <h3>Received Requests</h3>
          <ul>
            {receivedRequests.map(req => (
              <li key={req.id} style={{ marginBottom: '10px' }}>
                From: <strong>{req.senderId}</strong>
                <span style={{
                  backgroundColor: statusColor(req.status),
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '5px',
                  marginLeft: '8px',
                  fontSize: '12px'
                }}>
                  {req.status}
                </span>

                {req.status === 'pending' && (
                  <>
                    <button onClick={() => handleAction(req.id, 'accepted')} style={{ marginLeft: '10px' }}>Accept</button>
                    <button onClick={() => handleAction(req.id, 'declined')} style={{ marginLeft: '5px' }}>Decline</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FollowSystem;
