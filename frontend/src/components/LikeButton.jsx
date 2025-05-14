import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import '../styles/PostCard.css';

const LikeButton = ({ postId, userId, isLiked: initialIsLiked, likeCount: initialLikes, setPosts }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleLikeToggle = async () => {
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;

    setIsLiked(newIsLiked);
    setLikes(newLikes);

    console.log('Like toggle initiated:', { postId, userId, newIsLiked, newLikes });

    try {
      const endpoint = newIsLiked
        ? `/api/auth/posts/${postId}/like/${userId}`
        : `/api/auth/posts/${postId}/unlike/${userId}`;
      const response = await axios.post(`http://localhost:8080${endpoint}`);
      const updatedPost = response.data;

      console.log('API response:', updatedPost);

      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId
            ? {
                ...p,
                isLiked: updatedPost.likes.includes(userId),
                likeCount: updatedPost.likeCount,
                likes: updatedPost.likes
              }
            : p
        )
      );

      setIsLiked(updatedPost.likes.includes(userId));
      setLikes(updatedPost.likeCount);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setIsLiked(initialIsLiked);
      setLikes(initialLikes);
    }
  };

  return (
    <button
      className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
      onClick={handleLikeToggle}
      aria-label={isLiked ? 'Unlike post' : 'Like post'}
    >
      {isLiked ? <FaHeart className="like-icon" /> : <FaRegHeart className="like-icon" />}
      <span className="action-count">{likes}</span>
    </button>
  );
};

export default LikeButton;