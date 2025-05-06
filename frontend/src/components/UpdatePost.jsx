import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaImage, FaVideo, FaFileAlt, FaTimes } from 'react-icons/fa';
import Header from '../components/Header';
import '../styles/UpdatePost.css';

const UpdatePost = ({ user }) => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [mediaLinks, setMediaLinks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        // In a real app, you would fetch the post from your API
        // const response = await fetch(`http://localhost:8080/api/posts/${postId}`);
        // const data = await response.json();
        
        // For demo purposes, we'll use a mock post
        const mockPost = {
          id: postId,
          content: {
            text: "This is the post content that will be edited. Just published my new course on Advanced React Patterns! Check it out and let me know what you think. #react #frontend",
            mediaLinks: [
              "https://source.unsplash.com/600x400/?coding,react",
              "https://source.unsplash.com/600x400/?javascript,code"
            ]
          }
        };
        
        setPost(mockPost);
        setContent(mockPost.content.text);
        setMediaLinks(mockPost.content.mediaLinks || []);
      } catch (err) {
        setError('Failed to load post');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // In a real app, you would send the updated post to your API
      // const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     content: content,
      //     mediaLinks: mediaLinks
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update post');
      // }

      // For demo purposes, we'll just log and navigate back
      console.log('Post updated:', { content, mediaLinks });
      navigate('/');
    } catch (err) {
      setSubmitError(err.message || 'Failed to update post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveMedia = (index) => {
    const newMediaLinks = [...mediaLinks];
    newMediaLinks.splice(index, 1);
    setMediaLinks(newMediaLinks);
  };

  const handleAddMedia = (e) => {
    // In a real app, you would upload the file to your server
    // and get back a URL to add to mediaLinks
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaLinks([...mediaLinks, event.target.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="update-post-page">
        <Header />
        <Container className="mt-4 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p>Loading post...</p>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="update-post-page">
        <Header />
        <Container className="mt-4">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="update-post-page">
      <Header />
      
      <Container className="mt-4">
        <Card className="update-post-card">
          <Card.Header>
            <h4>Edit Post</h4>
          </Card.Header>
          
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="post-content-input"
                />
              </Form.Group>
              
              {/* Media preview */}
              {mediaLinks.length > 0 && (
                <div className="media-preview-container">
                  {mediaLinks.map((link, index) => (
                    <div key={index} className="media-preview-item">
                      <img 
                        src={link} 
                        alt={`Media ${index}`} 
                        className="media-preview"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <button 
                        type="button" 
                        className="remove-media-btn"
                        onClick={() => handleRemoveMedia(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Media upload buttons */}
              <div className="media-upload-buttons">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleAddMedia}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline-secondary"
                  as="label"
                  htmlFor="image-upload"
                  className="upload-btn"
                >
                  <FaImage className="me-2" /> Add Image
                </Button>
                
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleAddMedia}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline-secondary"
                  as="label"
                  htmlFor="video-upload"
                  className="upload-btn ms-2"
                >
                  <FaVideo className="me-2" /> Add Video
                </Button>
                
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleAddMedia}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline-secondary"
                  as="label"
                  htmlFor="file-upload"
                  className="upload-btn ms-2"
                >
                  <FaFileAlt className="me-2" /> Add File
                </Button>
              </div>
              
              {submitError && (
                <Alert variant="danger" className="mt-3">
                  {submitError}
                </Alert>
              )}
              
              <div className="post-actions mt-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="ms-2"
                  disabled={isSubmitting || !content.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Updating...
                    </>
                  ) : (
                    'Update Post'
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default UpdatePost;