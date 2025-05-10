import React, { useRef, useEffect, useState } from 'react';
import { Button, Form, Spinner, Alert, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { getAuthHeaders } from '../services/authService';
import { formatDistanceToNow, differenceInDays, format } from 'date-fns';
import { FaEllipsisH, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/CommentThread.css';

const CommentThread = ({ postId, user, userId, isPostOwner, onAddComment, onCommentsFetched, onClose }) => {
  const commentInputRef = useRef(null);
  const [comments, setComments] = useState([]);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [showCommentDropdown, setShowCommentDropdown] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  useEffect(() => {
    console.log('CommentThread Props:', { userId, isPostOwner, postId });
  }, [userId, isPostOwner, postId]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setFetchError('');

        // Check if user is authenticated
        if (!userId || !getAuthHeaders()?.headers?.Authorization) {
          setFetchError('Please log in to view comments.');
          onCommentsFetched([]);
          return;
        }

        let userMap = new Map();

        try {
          const userResponse = await axios.get(`http://localhost:8080/api/auth/all`, {
            headers: {
              ...getAuthHeaders().headers,
              'Accept': 'application/json'
            }
          });
          userResponse.data.forEach(user => {
            userMap.set(user.id, user.username || `User_${user.id}`);
          });
        } catch (userError) {
          console.error('Error fetching users:', userError);
        }

        console.log('Fetching comments with headers:', getAuthHeaders().headers);
        const commentResponse = await axios.get(`http://localhost:8080/api/auth/comments/post/${postId}`, {
          headers: {
            ...getAuthHeaders().headers,
            'Accept': 'application/json'
          }
        });

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
            id: comment.id,
            user: {
              id: comment.userId,
              name: userMap.get(comment.userId) || `User_${comment.userId}`
            },
            text: comment.content,
            timeAgo
          };
        });

        setComments(transformedComments);
        onCommentsFetched(transformedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        if (error.response?.status === 403) {
          setFetchError('You are not authorized to view comments. Please log in or check your permissions.');
          console.log('403 Response Details:', error.response);
        } else {
          setFetchError('Failed to load comments. Please try again.');
        }
        onCommentsFetched([]);
      }
    };

    fetchComments();
  }, [postId, onCommentsFetched, userId]);

  useEffect(() => {
    commentInputRef.current?.focus();
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const content = commentInputRef.current.value.trim();
    if (!content || isPosting) return;

    if (!userId) {
      setError('User ID is missing. Please log in to comment.');
      return;
    }

    setIsPosting(true);

    try {
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

      const currentTime = new Date();
      const newComment = {
        id: response.data.id,
        user: {
          id: userId,
          name: user?.name || 'Anonymous'
        },
        text: content,
        timeAgo: formatDistanceToNow(currentTime, { addSuffix: true })
      };

      setComments(prev => [...prev, newComment]);
      onAddComment(newComment);
      commentInputRef.current.value = '';
    } catch (error) {
      console.error('Error posting comment:', error);
      if (error.response?.status === 403) {
        setError('You are not authorized to post comments. Please log in or check your permissions.');
      } else {
        setError('Failed to post comment. Please try again.');
      }
    } finally {
      setIsPosting(false);
    }
  };

  const handleEditComment = (commentId, currentText) => {
    console.log(`Editing comment ${commentId} with current text: ${currentText}`);
    setShowCommentDropdown(null);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/auth/comments/${commentToDelete}`, {
        headers: {
          ...getAuthHeaders().headers
        },
        params: {
          requesterId: userId,
          postOwnerId: isPostOwner ? userId : ''
        }
      });
      setComments(prev => prev.filter(cmt => cmt.id !== commentToDelete));
      onCommentsFetched(comments.filter(cmt => cmt.id !== commentToDelete));
      setShowCommentDropdown(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error.response?.status === 403) {
        setError('You are not authorized to delete this comment.');
      } else {
        setError('Failed to delete comment. Please try again.');
      }
    } finally {
      setShowDeleteDialog(false);
      setCommentToDelete(null);
    }
  };

  const handleShowDeleteDialog = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteDialog(true);
    setShowCommentDropdown(null);
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setCommentToDelete(null);
  };

  const toggleCommentDropdown = (commentId) => {
    setShowCommentDropdown(prev => prev === commentId ? null : commentId);
  };

  return (
    <div className="comment-thread">
      <div className="comment-thread-header d-flex justify-content-between align-items-center">
        <h6 className="mb-0">Comments ({fetchError ? 0 : comments.length})</h6>
        <Button variant="link" onClick={onClose} className="text-danger p-0">✕</Button>
      </div>

      <div className="comment-list mt-2">
        {fetchError ? (
          <Alert variant="danger">{fetchError}</Alert>
        ) : comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          comments.map((cmt, index) => {
            const isCommentOwner = String(cmt.user.id) === String(userId);

            return (
              <div className="comment-item mb-2" key={cmt.id || index}>
                <div className="comment-header d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{cmt.user?.name || 'Anonymous'}</strong>
                    <span className="comment-timestamp ms-2">{cmt.timeAgo}</span>
                  </div>
                  {(isCommentOwner || isPostOwner) && (
                    <div className="comment-options-container">
                      <Button
                        variant="link"
                        className="comment-options p-0"
                        onClick={() => toggleCommentDropdown(cmt.id)}
                      >
                        <FaEllipsisH />
                      </Button>
                      {showCommentDropdown === cmt.id && (
                        <Dropdown show className="comment-dropdown-menu">
                          <Dropdown.Menu>
                            {isCommentOwner && (
                              <Dropdown.Item 
                                onClick={() => handleEditComment(cmt.id, cmt.text)}
                                title="Edit comment"
                              >
                                <FaEdit className="me-1" /> Edit
                              </Dropdown.Item>
                            )}
                            <Dropdown.Item
                              onClick={() => handleShowDeleteDialog(cmt.id)}
                              className="text-danger"
                              title="Delete comment"
                            >
                              <FaTrash className="me-1" /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  )}
                </div>
                <div className="comment-text mt-1">{cmt.text}</div>
              </div>
            );
          })
        )}
      </div>

      {error && <Alert variant="danger" className="mt-2 mb-2">{error}</Alert>}

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

      {showDeleteDialog && (
        <div className="delete-confirmation-dialog">
          <div className="delete-confirmation-content">
            <div className="delete-confirmation-header">
              <FaExclamationTriangle className="text-warning me-2" size={24} />
              <h5>Delete Comment</h5>
            </div>
            <div className="delete-confirmation-body">
              <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
              <div className="delete-confirmation-buttons">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleCloseDeleteDialog}
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteComment}
                  className="px-4"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentThread;