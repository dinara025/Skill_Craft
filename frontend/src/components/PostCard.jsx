import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaShare,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import {
  formatDistanceToNow,
  differenceInDays,
  format
} from 'date-fns';
import '../styles/PostCard.css';
import CommentThread from './CommentThread'; // Import the CommentThread component

const PostCard = ({
  post,
  showDropdown,
  toggleDropdown,
  handleDeletePost,
  setPosts,
  userId,
  isPostOwner,
  user
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.content.commentsList || []);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLikeToggle = async () => {
    try {
      const endpoint = post.content.isLiked
        ? `/api/posts/${post.id}/unlike/${userId}`
        : `/api/posts/${post.id}/like/${userId}`;

      console.log("Calling endpoint:", `http://localhost:8080/api/auth/posts/${post.id}/like/${userId}`);
      const response = await axios.put(`http://localhost:8080/api/auth/posts/${post.id}/like/${userId}`);
      const updatedPost = response.data;

      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === post.id
            ? {
                ...p,
                content: {
                  ...p.content,
                  isLiked: updatedPost.likedUsers?.includes(userId) ?? false,
                  likes: updatedPost.likedUsers?.length ?? 0
                }
              }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleBookmarkToggle = () => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === post.id
          ? {
              ...p,
              content: {
                ...p.content,
                isBookmarked: !p.content.isBookmarked
              }
            }
          : p
      )
    );
  };

  const handleEditPost = () => {
    if (!isPostOwner) {
      console.warn(`User ${userId} is not authorized to edit post ${post.id}`);
      return;
    }
    toggleDropdown(null);
    navigate(`/update-post/${post.id}`, { state: { post } });
  };

  const handleNextMedia = () => {
    if (post.content.mediaLinks && currentMediaIndex < post.content.mediaLinks.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const [touchStartX, setTouchStartX] = useState(null);
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 50) {
      handlePrevMedia();
    } else if (deltaX < -50) {
      handleNextMedia();
    }
    setTouchStartX(null);
  };

  const handleAddComment = (newComment) => {
    setComments(prev => [...prev, newComment]);
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === post.id
          ? {
              ...p,
              content: {
                ...p.content,
                comments: (p.content.comments || 0) + 1,
                commentsList: [...(p.content.commentsList || []), newComment]
              }
            }
          : p
      )
    );
  };

  let timeAgo = 'Just now';
  try {
    if (post?.content?.time) {
      const parsedTime = new Date(post.content.time);
      if (!isNaN(parsedTime)) {
        const daysDiff = differenceInDays(new Date(), parsedTime);
        timeAgo = daysDiff < 7
          ? formatDistanceToNow(parsedTime, { addSuffix: true })
          : format(parsedTime, 'dd MMM yyyy');
      }
    }
  } catch (error) {
    console.error('Invalid date format:', post.content.time);
  }

  return (
    <Card className="post-card">
      <Card.Header className="post-header">
        <div className="user-info">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="user-avatar"
          />
          <div>
            <h6 className="user-name">
              {post.user.name}
              {post.user.verified && <span className="verified-badge">✓</span>}
            </h6>
            <p className="user-handle">{timeAgo}</p>
          </div>
        </div>
        {isPostOwner && (
          <div className="post-options-container" ref={dropdownRef}>
            <Button
              variant="link"
              className="post-options"
              onClick={() => toggleDropdown(post.id)}
            >
              <FaEllipsisH />
            </Button>
            {showDropdown === post.id && (
              <Dropdown show className="post-dropdown-menu">
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleEditPost}>
                    <FaEdit className="me-2" /> Edit Post
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleDeletePost(post.id)}
                    className="text-danger"
                  >
                    <FaTrash className="me-2" /> Delete Post
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        )}
      </Card.Header>

      <Card.Body>
        <Card.Text className="post-text">{post.content.text}</Card.Text>
        {post.content.mediaLinks && post.content.mediaLinks.length > 0 && (
          <div className="post-media-wrapper">
            <div
              className="post-media-container"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={post.content.mediaLinks[currentMediaIndex]}
                alt={`Post media ${currentMediaIndex}`}
                className="post-media"
                onError={(e) => (e.target.style.display = 'none')}
              />
            </div>
            {post.content.mediaLinks.length > 1 && (
              <div className="media-controls">
                <Button
                  variant="link"
                  className="media-nav prev"
                  onClick={handlePrevMedia}
                  disabled={currentMediaIndex === 0}
                >
                  ←
                </Button>
                <div className="media-dots">
                  {post.content.mediaLinks.map((_, index) => (
                    <span
                      key={index}
                      className={`media-dot ${index === currentMediaIndex ? 'active' : ''}`}
                      onClick={() => setCurrentMediaIndex(index)}
                    ></span>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="media-nav next"
                  onClick={handleNextMedia}
                  disabled={currentMediaIndex === post.content.mediaLinks.length - 1}
                >
                  →
                </Button>
              </div>
            )}
          </div>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        )}
      </Card.Body>

      <Card.Footer className="post-footer">
        <div className="engagement-actions">
          <Button
            variant="link"
            className={`like-btn ${post.content.isLiked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
          >
            {post.content.isLiked ? <FaHeart /> : <FaRegHeart />}
            <span>{post.content.likes}</span>
          </Button>
          <Button
            variant="link"
            className="comment-btn"
            onClick={() => setShowComments(!showComments)}
          >
            <FaComment />
            <span>{post.content.comments}</span>
          </Button>
          <Button variant="link" className="share-btn">
            <FaShare />
            <span>{post.content.shares}</span>
          </Button>
        </div>
        <Button
          variant="link"
          className={`bookmark-btn ${post.content.isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkToggle}
        >
          {post.content.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </Button>
      </Card.Footer>

      {showComments && (
        <CommentThread
          postId={post.id}
          comments={comments}
          userId={userId}
          user={user}
          onAddComment={handleAddComment}
          onClose={() => setShowComments(false)}
        />
      )}
    </Card>
  );
};

export default PostCard;
