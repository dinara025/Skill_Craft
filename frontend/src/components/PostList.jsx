import React, { useState, useEffect } from 'react';
import '../styles/PostList.css';

const PostList = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/posts', {
          headers: {
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const text = await response.text(); // Get raw response
        console.log('Raw response:', text); // Log raw response
        try {
          const data = JSON.parse(text); // Attempt to parse
          const transformedPosts = data.map(post => ({
            id: post.id,
            userId: post.userId,
            createdAt: post.createdAt,
            user: {
              name: post.userId,
              handle: `@${post.userId.toLowerCase()}`,
              avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
              verified: false
            },
            content: {
              text: post.content,
              image: post.mediaLinks && post.mediaLinks.length > 0 ? post.mediaLinks[0] : null,
              likes: 0,
              comments: 0,
              shares: 0,
              isLiked: false,
              isBookmarked: false,
              time: new Date(post.createdAt).toLocaleString()
            },
            mediaLinks: post.mediaLinks || [],
            tags: post.tags || []
          }));

          // Sort posts by createdAt in descending order (latest first)
          transformedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setPosts(transformedPosts);
          setLoading(false);
        } catch (jsonError) {
          console.error('JSON parse error:', jsonError);
          throw new Error('Invalid JSON response');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list-container">
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p className="no-posts">No posts available.</p>
      ) : (
        <div className="posts">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <p className="post-content">{post.content.text}</p>
              {post.mediaLinks && post.mediaLinks.length > 0 && (
                <div className="media">
                  {post.mediaLinks.map((link, index) => (
                    <img
                      key={index}
                      src={link}
                      alt={`Media ${index}`}
                      className="media-image"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ))}
                </div>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="post-meta">
                Posted by User {post.userId} on{' '}
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;