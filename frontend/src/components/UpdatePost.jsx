import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeaders } from '../services/authService';
import '../styles/UpdatePost.css';

const API_BASE = 'http://localhost:8080/api/auth/posts';
const MAX_MEDIA = 3;
const MAX_VIDEO_DURATION = 30;

const UpdatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    content: '',
    mediaLinks: [],
    template: 'general'
  });
  const [newMediaFiles, setNewMediaFiles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${API_BASE}/${id}`, {
          headers: getAuthHeaders().headers
        });
        setPostData({
          content: response.data.content || '',
          mediaLinks: response.data.mediaLinks || [],
          template: response.data.template || 'general'
        });
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch post');
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve(video.duration);
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    });
  };

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    setError('');

    const totalMediaCount = postData.mediaLinks.length + newMediaFiles.length + files.length;
    const hasVideoInExisting = postData.mediaLinks.some(link => link.includes('.mp4') || link.includes('.webm'));
    const hasVideoInNew = newMediaFiles.some(file => file.type.startsWith('video/'));
    const hasVideoInUpload = files.some(file => file.type.startsWith('video/'));

    if (hasVideoInUpload && (postData.mediaLinks.length > 0 || newMediaFiles.length > 0 || files.length > 1)) {
      setError('You can only upload one video at a time, with no other media.');
      e.target.value = null;
      return;
    }

    if ((hasVideoInExisting || hasVideoInNew) && files.length > 0) {
      setError('You cannot add more media when a video is already selected.');
      e.target.value = null;
      return;
    }

    if (totalMediaCount > MAX_MEDIA) {
      setError(`You can upload up to ${MAX_MEDIA} photos or one video.`);
      e.target.value = null;
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    for (const file of files) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        invalidFiles.push(`${file.name} (invalid type)`);
        continue;
      }

      if (file.type.startsWith('video/')) {
        try {
          const duration = await getVideoDuration(file);
          if (duration > MAX_VIDEO_DURATION) {
            invalidFiles.push(`${file.name} (video exceeds ${MAX_VIDEO_DURATION} seconds)`);
            continue;
          }
        } catch {
          invalidFiles.push(`${file.name} (error reading video)`);
          continue;
        }
      }

      validFiles.push(file);
    }

    if (invalidFiles.length > 0) {
      setError(`Invalid files: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      setNewMediaFiles(prev => [...prev, ...validFiles]);
    }

    e.target.value = null;
  };

  const removeMedia = (index, isExisting = false) => {
    if (isExisting) {
      setPostData(prev => ({
        ...prev,
        mediaLinks: prev.mediaLinks.filter((_, i) => i !== index)
      }));
    } else {
      setNewMediaFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // In a real application, you'd upload new media files to a storage service
      // and get URLs. For now, we'll simulate this with local file names
      const newMediaLinks = newMediaFiles.map(file => URL.createObjectURL(file));
      
      const updatedPost = {
        content: postData.content,
        mediaLinks: [...postData.mediaLinks, ...newMediaLinks],
        template: postData.template
      };

      await axios.put(`${API_BASE}/${id}`, updatedPost, {
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'application/json'
        }
      });

      navigate('/posts');
    } catch (err) {
      setError('Failed to update post');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error && !postData.content) return <div>{error}</div>;

  return (
    <div className="update-post-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="update-post-card card">
              <div className="card-header">
                Update Post
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea
                      className="form-control post-content-input"
                      id="content"
                      name="content"
                      rows="5"
                      value={postData.content}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Media</label>
                    <div className="media-preview-container">
                      {postData.mediaLinks.map((link, index) => (
                        <div key={`existing-${index}`} className="media-preview-item">
                          {link.includes('.mp4') || link.includes('.webm') ? (
                            <video
                              src={link}
                              controls
                              className="media-preview"
                            />
                          ) : (
                            <img
                              src={link}
                              alt="Media preview"
                              className="media-preview"
                            />
                          )}
                          <button
                            type="button"
                            className="remove-media-btn"
                            onClick={() => removeMedia(index, true)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {newMediaFiles.map((file, index) => (
                        <div key={`new-${index}`} className="media-preview-item">
                          {file.type.startsWith('video/') ? (
                            <video
                              src={URL.createObjectURL(file)}
                              controls
                              className="media-preview"
                            />
                          ) : (
                            <img
                              src={URL.createObjectURL(file)}
                              alt="Media preview"
                              className="media-preview"
                            />
                          )}
                          <button
                            type="button"
                            className="remove-media-btn"
                            onClick={() => removeMedia(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="media-upload-buttons">
                      <label className="btn btn-outline-primary upload-btn">
                        Upload Media
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          hidden
                          onChange={handleMediaUpload}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="template" className="form-label">Template</label>
                    <select
                      className="form-select"
                      id="template"
                      name="template"
                      value={postData.template}
                      onChange={handleInputChange}
                      disabled
                    >
                      <option value="general">General</option>
                      <option value="learning-progress">Learning Progress</option>
                      <option value="ask-question">Ask Question</option>
                    </select>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="post-actions">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => navigate('/posts')}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;