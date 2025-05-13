import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import '../styles/PostCard.css';

const LikeButton = ({ postId, userId, isLiked: initialIsLiked, likes: initialLikes, setPosts }) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleLikeToggle = async () => {
    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikes = newIsLiked ? likes + 1 : likes - 1;

    setIsLiked(newIsLiked);
    setLikes(newLikes);

    console.log('Like toggle initiated:', { postId, userId, newIsLiked, newLikes });

    try {
      const response = await axios.put(`http://localhost:8080/api/auth/posts/${postId}/like/${userId}`);
      const updatedPost = response.data;

      console.log('API response:', updatedPost);

      // Update parent state with server data
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId
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

      // Sync local state with server response
      setIsLiked(updatedPost.likedUsers?.includes(userId) ?? false);
      setLikes(updatedPost.likedUsers?.length ?? 0);
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
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