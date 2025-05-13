import React, { useState } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaSpinner, FaTags } from 'react-icons/fa';
import '../styles/newThreadForm.css';

const NewThreadForm = ({ onThreadCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem('jwtToken');
  const createdBy = localStorage.getItem('jwtUsername');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await axios.post('http://localhost:8080/api/threads', {
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        createdBy
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onThreadCreated(res.data);
      setFormData({
        title: '',
        description: '',
        tags: ''
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error creating thread:', err);
      setError(err.response?.data?.message || 'Failed to create thread. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-thread-container">
      <form onSubmit={handleSubmit} className="thread-form">
        <div className="form-header">
          <FaPlusCircle className="header-icon" />
          <h3>Start a New Discussion</h3>
        </div>

        <div className="form-group">
          <label htmlFor="title">Thread Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g., 'How to fix Python index error?'"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            disabled={isSubmitting}
            maxLength="100"
          />
          <small className="character-count">
            {formData.title.length}/100
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="description">Detailed Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            placeholder="Provide detailed information about your question or topic..."
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            disabled={isSubmitting}
          />
          <small className="character-count">
            {formData.description.length}/1000
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="tags">
            <FaTags className="tag-icon" />
            Tags (comma separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            placeholder="e.g., python, debugging, error-handling"
            value={formData.tags}
            onChange={handleChange}
            className="form-input"
            disabled={isSubmitting}
          />
          <small className="hint">Add relevant tags to help others find your thread</small>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Thread created successfully!</div>}

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="spinner-icon" />
              Creating...
            </>
          ) : (
            'Create Thread'
          )}
        </button>
      </form>
    </div>
  );
};

export default NewThreadForm;