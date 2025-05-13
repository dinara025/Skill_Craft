import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Dropdown, Modal } from 'react-bootstrap';
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
  FaTrash,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlay
} from 'react-icons/fa';
import {
  formatDistanceToNow,
  differenceInDays,
  format
} from 'date-fns';
import '../styles/PostCard.css';
import CommentThread from './CommentThread.jsx';

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
  // Log post details to console
  console.log('Post Details:', {
    id: post.id,
    content: {
      text: post.content.text,
      mediaLinks: post.content.mediaLinks,
      likes: post.content.likes,
      comments: post.content.comments,
      shares: post.content.shares,
      isLiked: post.content.isLiked,
      isBookmarked: post.content.isBookmarked,
      time: post.content.time
    },
    user: {
      name: post.user.name,
      avatar: post.user.avatar,
      verified: post.user.verified
    },
    tags: post.tags
  });

  // Function to check if media is a video
  const isVideo = (url) => {
  // Remove query parameters
  const cleanUrl = url.split('?')[0];
  // Check for video extensions
  return cleanUrl.match(/\.(mp4|webm|ogg)$/i);
 };

  // Separate videos and images
  const videos = post.content.mediaLinks ? post.content.mediaLinks.filter(isVideo) : [];
  const images = post.content.mediaLinks ? post.content.mediaLinks.filter(url => !isVideo(url)) : [];
  const allMedia = post.content.mediaLinks || []; // Unified topic for modal

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [modalMediaIndex, setModalMediaIndex] = useState(0);
  const [comments, setComments] = useState(post.content.commentsList || []);
  const [playingVideos, setPlayingVideos] = useState({});
  const videoRefs = useRef({});
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Function to remove hashtags from the description
  const removeHashtags = (text, tags) => {
    let cleanedText = text;
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        const hashtag = `#${tag}`;
        const regex = new RegExp(`\\b${hashtag}\\b`, 'gi');
        cleanedText = cleanedText.replace(regex, '').trim();
      });
    }
    return cleanedText;
  };

  const handleLikeToggle = async () => {
    try {
      const endpoint = post.content.isLiked
        ? `/api/posts/${post.id}/unlike/${userId}`
        : `/api/posts/${post.id}/like/${userId}`;

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

  const handleNextImage = () => {
    if (images.length > 0 && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextVideo = () => {
    if (videos.length > 0 && currentVideoIndex < videos.length - 1) {
      if (playingVideos[currentVideoIndex]) {
        toggleVideoPlay(currentVideoIndex);
      }
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      if (playingVideos[currentVideoIndex]) {
        toggleVideoPlay(currentVideoIndex);
      }
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleModalNext = () => {
    if (modalMediaIndex < allMedia.length - 1) {
      if (isVideo(allMedia[modalMediaIndex]) && playingVideos[`modal-${modalMediaIndex}`]) {
        toggleVideoPlay(modalMediaIndex, true);
      }
      setModalMediaIndex(modalMediaIndex + 1);
    }
  };

  const handleModalPrev = () => {
    if (modalMediaIndex > 0) {
      if (isVideo(allMedia[modalMediaIndex]) && playingVideos[`modal-${modalMediaIndex}`]) {
        toggleVideoPlay(modalMediaIndex, true);
      }
      setModalMediaIndex(modalMediaIndex - 1);
    }
  };

  const openMediaModal = (index, isVideoType = false) => {
    // Map video/image index to allMedia index
    const mediaIndex = isVideoType
      ? post.content.mediaLinks.indexOf(videos[index])
      : post.content.mediaLinks.indexOf(images[index]);
    setModalMediaIndex(mediaIndex);
    setShowMediaModal(true);
  };

  const closeMediaModal = () => {
    if (isVideo(allMedia[modalMediaIndex]) && playingVideos[`modal-${modalMediaIndex}`]) {
      toggleVideoPlay(modalMediaIndex, true);
    }
    setShowMediaModal(false);
  };

  const toggleVideoPlay = (index, isModal = false) => {
    const videoKey = isModal ? `modal-${index}` : index;
    const videoRef = videoRefs.current[videoKey];
    
    if (videoRef) {
      if (playingVideos[videoKey]) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
    }
    
    setPlayingVideos(prev => ({
      ...prev,
      [videoKey]: !prev[videoKey]
    }));
  };

  const [imageTouchStartX, setImageTouchStartX] = useState(null);
  const [videoTouchStartX, setVideoTouchStartX] = useState(null);

  const handleImageTouchStart = (e) => {
    setImageTouchStartX(e.touches[0].clientX);
  };

  const handleImageTouchEnd = (e) => {
    if (imageTouchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - imageTouchStartX;
    if (deltaX > 50) {
      handlePrevImage();
    } else if (deltaX < -50) {
      handleNextImage();
    }
    setImageTouchStartX(null);
  };

  const handleVideoTouchStart = (e) => {
    setVideoTouchStartX(e.touches[0].clientX);
  };

  const handleVideoTouchEnd = (e) => {
    if (videoTouchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - videoTouchStartX;
    if (deltaX > 50) {
      handlePrevVideo();
    } else if (deltaX < -50) {
      handleNextVideo();
    }
    setVideoTouchStartX(null);
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

  const handleCommentsFetched = (fetchedComments) => {
    setComments(fetchedComments);
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p.id === post.id
          ? {
              ...p,
              content: {
                ...p.content,
                comments: fetchedComments.length,
                commentsList: fetchedComments
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
          : format(parsedTime, 'MMM d, yyyy');
      }
    }
  } catch (error) {
    console.error('Invalid date format:', post.content.time);
  }

  // Get the cleaned text without hashtags
  const cleanedText = removeHashtags(post.content.text, post.tags);

  // Render media item (image or video)
  const renderMediaItem = (mediaUrl, index, isModal = false) => {
    if (isVideo(mediaUrl)) {
      return (
        <div className={`video-container ${isModal ? 'modal-video' : ''}`}>
          <video
            ref={el => videoRefs.current[isModal ? `modal-${index}` : index] = el}
            src={mediaUrl}
            className="post-media"
            controls={playingVideos[isModal ? `modal-${index}` : index]}
            onClick={(e) => {
              if (!playingVideos[isModal ? `modal-${index}` : index]) {
                e.stopPropagation();
                toggleVideoPlay(index, isModal);
              }
            }}
            onEnded={() => setPlayingVideos(prev => ({
              ...prev,
              [isModal ? `modal-${index}` : index]: false
            }))}
          />
          {!playingVideos[isModal ? `modal-${index}` : index] && (
            <div 
              className="video-overlay"
              onClick={(e) => {
                e.stopPropagation();
                toggleVideoPlay(index, isModal);
              }}
            >
              <FaPlay className="play-icon" />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <img
          src={mediaUrl}
          alt={`Post media ${index}`}
          className="post-media"
          onError={(e) => (e.target.style.display = 'none')}
        />
      );
    }
  };

  return (
    <Card className="post-card">
      <Card.Header className="post-header">
        <div className="user-info">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="user-avatar"
          />
          <div className="user-details">
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
                <Dropdown.Menu className="dropdown-menu-custom">
                  <Dropdown.Item onClick={handleEditPost} className="dropdown-item-custom">
                    <FaEdit className="me-2" /> Edit Post
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleDeletePost(post.id)}
                    className="dropdown-item-custom text-danger"
                  >
                    <FaTrash className="me-2" /> Delete Post
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        )}
      </Card.Header>

      <Card.Body className="post-body">
        <Card.Text className="post-text">{cleanedText}</Card.Text>
        {/* Video Container */}
        {videos.length > 0 && (
          <div className="post-media-wrapper">
            <div
              className="post-media-container"
              onTouchStart={handleVideoTouchStart}
              onTouchEnd={handleVideoTouchEnd}
            >
              <div 
                className="media-frame"
                onClick={() => openMediaModal(currentVideoIndex, true)}
              >
                {renderMediaItem(videos[currentVideoIndex], currentVideoIndex)}
              </div>
            </div>
            {videos.length > 1 && (
              <div className="media-controls">
                <Button
                  variant="link"
                  className="media-nav prev"
                  onClick={handlePrevVideo}
                  disabled={currentVideoIndex === 0}
                >
                  <span className="nav-arrow">←</span>
                </Button>
                <div className="media-dots">
                  {videos.map((_, index) => (
                    <button
                      key={index}
                      className={`media-dot ${index === currentVideoIndex ? 'active' : ''}`}
                      onClick={() => setCurrentVideoIndex(index)}
                      aria-label={`Go to video ${index + 1}`}
                    />
                  ))}
                </div>
                <Button
                  variant="link"
                  className="media-nav next"
                  onClick={handleNextVideo}
                  disabled={currentVideoIndex === videos.length - 1}
                >
                  <span className="nav-arrow">→</span>
                </Button>
              </div>
            )}
          </div>
        )}
        {/* Image Container */}
        {images.length > 0 && (
          <div className="post-media-wrapper">
            <div
              className="post-media-container"
              onTouchStart={handleImageTouchStart}
              onTouchEnd={handleImageTouchEnd}
            >
              <div 
                className="media-frame"
                onClick={() => openMediaModal(currentImageIndex, false)}
              >
                {renderMediaItem(images[currentImageIndex], currentImageIndex)}
              </div>
            </div>
            {images.length > 1 && (
              <div className="media-controls">
                <Button
                  variant="link"
                  className="media-nav prev"
                  onClick={handlePrevImage}
                  disabled={currentImageIndex === 0}
                >
                  <span className="nav-arrow">←</span>
                </Button>
                <div className="media-dots">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`media-dot ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
                <Button
                  variant="link"
                  className="media-nav next"
                  onClick={handleNextImage}
                  disabled={currentImageIndex === images.length - 1}
                >
                  <span className="nav-arrow">→</span>
                </Button>
              </div>
            )}
          </div>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="tags-container">
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
            className={`action-btn like-btn ${post.content.isLiked ? 'liked' : ''}`}
            onClick={handleLikeToggle}
            aria-label={post.content.isLiked ? 'Unlike post' : 'Like post'}
          >
            {post.content.isLiked ? <FaHeart /> : <FaRegHeart />}
            <span className="action-count">{post.content.likes}</span>
          </Button>
          <Button
            variant="link"
            className="action-btn comment-btn"
            onClick={() => setShowComments(!showComments)}
            aria-label="Comment on post"
          >
            <FaComment />
            <span className="action-count">{comments.length}</span>
          </Button>
          <Button variant="link" className="action-btn share-btn" aria-label="Share post">
            <FaShare />
            <span className="action-count">{post.content.shares}</span>
          </Button>
        </div>
        <Button
          variant="link"
          className={`action-btn bookmark-btn ${post.content.isBookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmarkToggle}
          aria-label={post.content.isBookmarked ? 'Remove bookmark' : 'Bookmark post'}
        >
          {post.content.isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </Button>
      </Card.Footer>

      {showComments && (
        <CommentThread
          postId={post.id}
          userId={userId}
          user={user}
          isPostOwner={isPostOwner}
          onAddComment={handleAddComment}
          onCommentsFetched={handleCommentsFetched}
          onClose={() => setShowComments(false)}
        />
      )}

      <Modal
        show={showMediaModal}
        onHide={closeMediaModal}
        centered
        size="lg"
        className="media-modal"
      >
        <Modal.Header className="media-modal-header">
          <Button
            variant="link"
            onClick={closeMediaModal}
            className="close-button"
          >
            <FaTimes />
          </Button>
        </Modal.Header>
        <Modal.Body className="media-modal-body">
          <div className="modal-media-container">
            {renderMediaItem(allMedia[modalMediaIndex], modalMediaIndex, true)}
          </div>
          {allMedia.length > 1 && (
            <>
              <Button
                variant="link"
                className="modal-nav prev"
                onClick={handleModalPrev}
                disabled={modalMediaIndex === 0}
              >
                <FaChevronLeft />
              </Button>
              <Button
                variant="link"
                className="modal-nav next"
                onClick={handleModalNext}
                disabled={modalMediaIndex === allMedia.length - 1}
              >
                <FaChevronRight />
              </Button>
              <div className="modal-media-dots">
                {allMedia.map((_, index) => (
                  <button
                    key={index}
                    className={`modal-media-dot ${index === modalMediaIndex ? 'active' : ''}`}
                    onClick={() => setModalMediaIndex(index)}
                    aria-label={`Go to media ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default PostCard;