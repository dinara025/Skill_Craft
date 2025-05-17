import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import PostCard from './PostCard';
import { getAuthHeaders } from '../services/authService';
import { fetchCommentsByPostId } from '../services/commentService';
import '../styles/PostList.css';

const PostList = ({ userId, user, searchQuery }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  // ------------------ TOKEN EXPIRATION CHECK ------------------
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry - 5000;
    } catch (error) {
      return true;
    }
  };

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('jwtUsername');
    window.location.href = '/login';
  };

  // ------------------ AUTO-LOGOUT ON TOKEN EXPIRY ------------------
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token && !isTokenExpired(token)) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const timeLeft = expiry - Date.now();
      if (timeLeft > 0) {
        const timeout = setTimeout(() => {
          alert('Your session has expired. Please log in again.');
          handleLogout();
        }, timeLeft);
        return () => clearTimeout(timeout);
      } else {
        alert('Your session has expired. Please log in again.');
        handleLogout();
      }
    }
  }, []);

  // ------------------ FETCH POSTS AND COMMENTS ------------------
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token || isTokenExpired(token)) {
          alert('Your session has expired. Please log in again.');
          handleLogout();
          return;
        }

        // Determine the API endpoint based on searchQuery
        const baseUrl = 'http://localhost:8080/api/auth';
        const endpoint = searchQuery
          ? `${baseUrl}/posts/search?tag=${encodeURIComponent(searchQuery)}&currentUserId=${userId}`
          : `${baseUrl}/posts?currentUserId=${userId}`;

        // Fetch posts
        const response = await fetch(endpoint, {
          headers: {
            ...getAuthHeaders().headers,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            alert('Your session has expired. Please log in again.');
            handleLogout();
            return;
          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const text = await response.text();
        console.log('Raw API response:', text);

        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid JSON response');
        }

        if (Array.isArray(data) && data.length > 0) {
          // Transform posts to match PostCard.jsx expectations
          const transformedPosts = await Promise.all(data.map(async post => {
            let commentsList = [];
            let commentCount = 0;
            try {
              const commentResponse = await fetchCommentsByPostId(post.id);
              commentsList = commentResponse.data.map(comment => ({
                id: comment.id,
                user: { id: comment.userId, name: comment.username || `User_${comment.userId}` },
                text: comment.content,
                timeAgo: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
              }));
              commentCount = commentsList.length;
            } catch (commentError) {
              console.error(`Error fetching comments for post ${post.id}:`, commentError);
            }

            return {
              id: post.id || Math.random().toString(36).substr(2, 9),
              title: post.title || '',
              content: post.content || '',
              mediaLinks: post.mediaLinks || [],
              tags: post.tags || [],
              template: post.template || 'general',
              createdAt: post.createdAt || new Date().toISOString(),
              userId: String(post.userId || 'unknown'),
              username: post.username || 'Unknown User',
              avatar: post.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
              likeCount: post.likeCount || 0,
              likes: post.likes || [],
              isLiked: post.isLiked || false,
              isBookmarked: false,
              comments: commentCount,
              commentsList
            };
          }));

          // Sort by createdAt in descending order
          transformedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(transformedPosts);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, searchQuery]);

  // ------------------ TOGGLE DROPDOWN ------------------
  const toggleDropdown = (postId) => {
    setShowDropdown(prev => (prev === postId ? null : postId));
  };

  // ------------------ DELETE POST ------------------
  const handleDeletePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) {
      setError('Post not found');
      return;
    }

    if (post.userId !== String(userId)) {
      setError('You are not authorized to delete this post');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token || isTokenExpired(token)) {
        alert('Your session has expired. Please log in again.');
        handleLogout();
        return;
      }

      const response = await fetch(`http://localhost:8080/api/auth/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          ...getAuthHeaders().headers,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert('Your session has expired. Please log in again.');
          handleLogout();
          return;
        }
        throw new Error('Failed to delete post');
      }

      setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      setShowDropdown(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post');
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="post-list-container">
      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading posts...</p>
        </div>
      ) : error ? (
        <Card className="error-card my-3">
          <Card.Body>
            <div className="text-center text-danger">
              <h5>Error loading posts</h5>
              <p>{error}</p>
            </div>
          </Card.Body>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="my-3">
          <Card.Body>
            <div className="text-center">
              <h5>No posts found</h5>
              <p>{searchQuery ? `No posts found for "${searchQuery}"` : 'Be the first to share something!'}</p>
            </div>
          </Card.Body>
        </Card>
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            showDropdown={showDropdown}
            toggleDropdown={toggleDropdown}
            handleDeletePost={handleDeletePost}
            setPosts={setPosts}
            userId={String(userId)}
            isPostOwner={post.userId === String(userId)}
            user={user}
          />
        ))
      )}
    </div>
  );
};

export default PostList;