import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import PostCard from './PostCard';
import '../styles/PostList.css';

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

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
        time: "1 hour ago",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      tags: ["react", "frontend"],
      userId: String(userId), // Ensure userId is a string
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      user: {
        name: "John Doe",
        handle: "@johndoe",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
        verified: false
      },
      content: {
        text: "Exploring new CSS tricks today! #webdev #css",
        mediaLinks: ["https://source.unsplash.com/600x400/?css,code"],
        likes: 85,
        comments: 15,
        shares: 7,
        isLiked: false,
        isBookmarked: false,
        time: "2 hours ago",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      tags: ["webdev", "css"],
      userId: "otherUser",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ];

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
            userId: String(post.userId || 'unknown') // Normalize userId to string
          }));

          transformedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(transformedPosts);
          console.log('Transformed posts:', transformedPosts);
          console.log('Logged-in userId:', userId);
        } else {
          console.log('No posts found, using sample posts');
          const sortedSamplePosts = [...samplePosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setPosts(sortedSamplePosts);
          console.log('Sample posts:', sortedSamplePosts);
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

    if (userId) {
      fetchPosts();
    } else {
      console.warn('No userId provided, using sample posts');
      setPosts(samplePosts);
      setLoading(false);
    }
  }, [userId]);

  const toggleDropdown = (postId) => {
    setShowDropdown(prev => (prev === postId ? null : postId));
    console.log('Toggled dropdown for post:', postId, 'showDropdown:', showDropdown);
  };

  const handleDeletePost = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) {
      console.error('Post not found:', postId);
      setError('Post not found');
      return;
    }

    if (post.userId !== String(userId)) {
      console.warn(`User ${userId} is not authorized to delete post ${postId} (owned by ${post.userId})`);
      setError('You are not authorized to delete this post');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(prevPosts => {
        const updatedPosts = prevPosts.filter(p => p.id !== postId);
        console.log('Updated posts after deletion:', updatedPosts);
        return updatedPosts;
      });
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
            userId={String(userId)} // Ensure userId is a string
            isPostOwner={post.userId === String(userId)}
          />
        ))
      )}
    </div>
  );
};

export default PostList;