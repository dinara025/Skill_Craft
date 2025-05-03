import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import PostCard from './PostCard';
import '../styles/PostList.css';

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Sample data for when API fails
  const samplePosts = [
    {
      id: 1,
      user: {
        name: "Emma Watson",
        handle: "@emmawcodes",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        verified: true
      },
      content: {
        text: "Just published my new course on Advanced React Patterns! Check it out and let me know what you think. #react #frontend",
        mediaLinks: [
          "https://source.unsplash.com/600x400/?coding,react",
          "https://source.unsplash.com/600x400/?javascript,code",
          "https://source.unsplash.com/600x400/?frontend,dev"
        ],
        likes: 142,
        comments: 28,
        shares: 12,
        isLiked: false,
        isBookmarked: false,
        time: "2 hours ago",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      tags: ["react", "frontend"]
    }
  ];

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/posts', {
          headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text();
        console.log('Raw response:', text);

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
            createdAt: post.createdAt,
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
            tags: post.tags || []
          }));

          transformedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(transformedPosts);
        } else {
          console.log('No posts found, using sample posts');
          const sortedSamplePosts = [...samplePosts].sort((a, b) => b.content.timestamp - a.content.timestamp);
          setPosts(sortedSamplePosts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        const sortedSamplePosts = [...samplePosts].sort((a, b) => b.content.timestamp - a.content.timestamp);
        setPosts(sortedSamplePosts);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown for a specific post
  const toggleDropdown = (postId) => {
    setShowDropdown(showDropdown === postId ? null : postId);
  };

  // Handle edit post
  const handleEditPost = (postId) => {
    console.log(`Edit post ${postId}`);
    setShowDropdown(null);
    navigate(`/update-post/${postId}`);
  };

  // Handle delete post
  const handleDeletePost = (postId) => {
    console.log(`Delete post ${postId}`);
    setShowDropdown(null);
    setPosts(posts.filter(post => post.id !== postId));
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
            handleEditPost={handleEditPost}
            handleDeletePost={handleDeletePost}
            dropdownRef={dropdownRef}
            setPosts={setPosts}
          />
        ))
      )}
    </div>
  );
};

export default PostList;