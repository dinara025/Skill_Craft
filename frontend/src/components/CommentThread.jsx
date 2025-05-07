import React, { useRef, useEffect, useState } from 'react';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../styles/CommentThread.css';

const CommentThread = ({ postId, comments = [], user, userId, onAddComment, onClose }) => {
  const commentInputRef = useRef(null);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    commentInputRef.current?.focus();
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const content = commentInputRef.current.value.trim();
    if (!content || isPosting) return;

    // Validate userId
    if (!userId) {
      setError('User ID is missing. Please log in to comment.');
      return;
    }

    setIsPosting(true);

    try {
      console.log('Posting comment with payload:', { postId, userId, content }); // Debug log
      const response = await axios.post('http://localhost:8080/api/auth/comments', {
        postId,
        userId, // Use the userId prop directly
        content,
      });

      // Notify parent to update comment list
      onAddComment({
        user: {
          id: userId,
          name: user.name,
        },
        text: content,
      });

      commentInputRef.current.value = '';
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="comment-thread">
      <div className="comment-thread-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Comments</h6>
        <Button variant="link" onClick={onClose} className="text-danger">✕</Button>
      </div>

      <div className="comment-list mt-2">
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          comments.map((cmt, index) => (
            <div key={index} className="comment-item mb-2">
              <strong>{cmt.user?.name || 'Anonymous'}</strong>: {cmt.text}
            </div>
          ))
        )}
      </div>

      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}

      <Form onSubmit={handleCommentSubmit} className="comment-form d-flex gap-2 mt-3">
        <Form.Control
          type="text"
          placeholder="Write a comment..."
          ref={commentInputRef}
          disabled={isPosting}
        />
        <Button type="submit" variant="primary" disabled={isPosting}>
          {isPosting ? <Spinner animation="border" size="sm" /> : 'Post'}
        </Button>
      </Form>
    </div>
  );
};

export default CommentThread;