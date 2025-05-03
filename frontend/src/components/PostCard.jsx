import React, { useState } from 'react';
import { Card, Button, Dropdown } from 'react-bootstrap';
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
  parseISO,
  differenceInDays,
  format
} from 'date-fns';
import '../styles/PostCard.css';

const PostCard = ({
  post,
  showDropdown,
  toggleDropdown,
  handleEditPost,
  handleDeletePost,
  dropdownRef,
  setPosts
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Handle like toggle
  const handleLikeToggle = () => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === post.id
          ? {
              ...p,
              content: {
                ...p.content,
                isLiked: !p.content.isLiked,
                likes: p.content.isLiked ? p.content.likes - 1 : p.content.likes + 1
              }
            }
          : p
      )
    );
  };

  // Handle bookmark toggle
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

  // Handle swipe navigation
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

  // Handle touch swipe
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

  // Format time display
  let timeAgo = 'Just now';
  try {
    if (post?.content?.time) {
      const parsedTime = new Date(post.content.time);
      if (!isNaN(parsedTime)) {
        const daysDiff = differenceInDays(new Date(), parsedTime);
        if (daysDiff < 7) {
          timeAgo = formatDistanceToNow(parsedTime, { addSuffix: true });
        } else {
          timeAgo = format(parsedTime, 'dd MMM yyyy');
        }
      }
    }
  } catch (error) {
    console.error('Invalid date format:', post.content.time);
  }

  return (
    <Card className="post-card">
      {/* Post Header */}
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
                <Dropdown.Item onClick={() => handleEditPost(post.id)}>
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
      </Card.Header>

      {/* Post Content */}
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
                  &larr;
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
                  &rarr;
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

      {/* Post Footer */}
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
          <Button variant="link" className="comment-btn">
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
    </Card>
  );
};

export default PostCard;