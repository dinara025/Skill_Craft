import React from 'react';
import { useAuth } from '../context/AuthContext';

const MessageActions = ({ message, onEdit, onDelete }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser || currentUser.id !== message.senderId) {
    return null;
  }

  return (
    <div className="message-actions">
      <button 
        onClick={() => onEdit(message)}
        className="action-btn edit-btn"
      >
        Edit
      </button>
      <button 
        onClick={() => onDelete(message._id)}
        className="action-btn delete-btn"
      >
        Delete
      </button>
    </div>
  );
};

export default MessageActions;