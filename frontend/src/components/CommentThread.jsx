import React, { useRef, useEffect, useState } from 'react';
import { Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { getAuthHeaders } from '../services/authService';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';
import '../styles/CommentThread.css';

const CommentThread = ({ postId, user, userId, onAddComment, onCommentsFetched, onClose }) => {
  const commentInputRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');

  // Fetch comments when component mounts or postId changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setFetchError('');

        // Fetch all users to map userId to username
        let userMap = new Map();
        try {
          const userResponse = await axios.get(`http://localhost:8080/api/auth/all`, {
            headers: {
              ...getAuthHeaders().headers,
              'Accept': 'application/json'
            }
          });
          console.log('Fetched users:', userResponse.data);
          userResponse.data.forEach(user => {
            userMap.set(user.id, user.username || `User_${user.id}`);
          });
        } catch (userError) {
          console.error('Error fetching users:', userError);
          // Proceed with empty userMap; will use fallback
        }

        // Fetch comments
        const commentResponse = await axios.get(`http://localhost:8080/api/auth/comments/post/${postId}`, {
          headers: {
            ...getAuthHeaders().headers,
            'Accept': 'application/json'
          }
        });

        // Log raw comment response for debugging
        console.log('Fetched comments:', commentResponse.data);

        // Transform comments using userMap
        const transformedComments = commentResponse.data.map(comment => {
          let timeAgo = 'Unknown time';
          try {
            if (comment.createdAt) {
              const parsedTime = new Date(comment.createdAt);
              if (!isNaN(parsedTime)) {
                const daysDiff = differenceInDays(new Date(), parsedTime);
                timeAgo = daysDiff < 7
                  ? formatDistanceToNow(parsedTime, { addSuffix: true })
                  : format(parsedTime, 'dd MMM yyyy');
              }
            }
          } catch (error) {
            console.error('Invalid comment timestamp:', comment.createdAt);
          }

          return {
            user: {
              id: comment.userId,
              name: userMap.get(comment.userId) || `User_${comment.userId}`
            },
            text: comment.content,
            timeAgo
          };
        });

        setComments(transformedComments);
        onCommentsFetched(transformedComments); // Notify PostCard of fetched comments
      } catch (error) {
        console.error('Error fetching comments:', error);
        setFetchError('Failed to load comments. Please try again.');
        onCommentsFetched([]); // Notify PostCard of empty comments on error
      }
    };

    fetchComments();
  }, [postId, onCommentsFetched]);

  // Focus input on mount
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
      console.log('Posting comment with payload:', { postId, userId, content });
      const response = await axios.post('http://localhost:8080/api/auth/comments', {
        postId,
        userId,
        content,
      }, {
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'application/json'
        }
      });

      // Create new comment object with timestamp
      const currentTime = new Date();
      const newComment = {
        user: {
          id: userId,
          name: user?.name || 'Anonymous'
        },
        text: content,
        timeAgo: formatDistanceToNow(currentTime, { addSuffix: true })
      };

      // Update local state
      setComments(prev => [...prev, newComment]);

      // Notify parent to update comment list
      onAddComment(newComment);

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
        <h6 className="mb-0">Comments ({fetchError ? 0 : comments.length})</h6>
        <Button variant="link" onClick={onClose} className="text-danger">✕</Button>
      </div>

      <div className="comment-list mt-2">
        {fetchError ? (
          <Alert variant="danger">{fetchError}</Alert>
        ) : comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          comments.map((cmt, index) => (
            <div key={index} className="comment-item mb-2">
              <div className="comment-header">
                <strong>{cmt.user?.name || 'Anonymous'}</strong>
                <span className="comment-timestamp">{cmt.timeAgo}</span>
              </div>
              <div className="comment-text">{cmt.text}</div>
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