import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import PostCard from './PostCard';
import { getAuthHeaders } from '../services/authService';
import '../styles/PostList.css';

const PostList = ({ userId, user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  const samplePosts = []; // Assuming samplePosts is empty or defined elsewhere

  // ------------------ TOKEN EXPIRATION CHECK ------------------
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert seconds to milliseconds
      // Add a 5-second buffer to account for clock skew
      return Date.now() >= (expiry - 5000);
    } catch (error) {
      return true; // Assume expired if token is invalid
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
      const expiry = payload.exp * 1000; // Convert to milliseconds
      const timeLeft = expiry - Date.now();
      if (timeLeft > 0) {
        const timeout = setTimeout(() => {
          // Consider using react-toastify for better UX
          alert('Your session has expired. Please log in again.');
          handleLogout();
        }, timeLeft);
        return () => clearTimeout(timeout); // Cleanup on unmount
      } else {
        alert('Your session has expired. Please log in again.');
        handleLogout();
      }
    }
  }, []);

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

        const response = await fetch('http://localhost:8080/api/auth/posts', {
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
          const transformedPosts = data.map(post => ({
            id: post.id || Math.random().toString(36).substr(2, 9),
            createdAt: post.createdAt || new Date().toISOString(),
            user: {
              name: post.username || 'Unknown User',
              handle: `@${(post.userId || 'user').toLowerCase()}`,
              avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
              verified: false
            },
            content: {
              text: post.content || '',
              mediaLinks: post.mediaLinks || [],
              likes: post.likes || 0,
              comments: post.comments || 0,
              shares: post.shares || 0,
              isLiked: false,
              isBookmarked: false,
              time: post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Recently',
              timestamp: post.createdAt ? new Date(post.createdAt) : new Date()
            },
            tags: post.tags || [],
            userId: String(post.userId || 'unknown')
          }));

          transformedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(transformedPosts);
        } else {
          const sortedSamplePosts = [...samplePosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(sortedSamplePosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        const sortedSamplePosts = [...samplePosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedSamplePosts);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const toggleDropdown = (postId) => {
    setShowDropdown(prev => (prev === postId ? null : postId));
  };

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
              <p>Be the first to share something!</p>
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