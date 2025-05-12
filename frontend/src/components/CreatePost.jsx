import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spinner, Card, Dropdown } from 'react-bootstrap';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { createPost } from '../services/postService';
import '../styles/CreatePost.css';

const CreatePost = ({ user, currentUser }) => {
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_CHARS = 500;
  const MAX_MEDIA = 3;
  const MAX_VIDEO_DURATION = 30;

  // Predefined post templates with default media URLs
  const postTemplates = [
    {
      id: 'learning-progress',
      name: 'Share Learning Progress',
      placeholder: 'Share your learning milestone! What did you achieve? #Learning',
      defaultText: 'I just completed [Your Achievement] in my [Skill/Course] journey! Feeling proud! 🎉 #Learning #Progress',
      defaultMedia: 'https://img.freepik.com/free-vector/man-getting-award-writing_74855-5891.jpg?semt=ais_hybrid&w=740',
    },
    {
      id: 'ask-question',
      name: 'Ask a Question',
      placeholder: 'Ask the community for help! What do you need to know? #Question',
      defaultText: 'I’m stuck on [Topic/Issue]. Can anyone help explain or share tips? #Question #Help',
      defaultMedia: 'https://media.licdn.com/dms/image/v2/C4D12AQF2HyN6MILFGw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1646657644961?e=2147483647&v=beta&t=XmoKnBTIz-dE4JaNiQGWv9VYiWTnovxFgW3MW0VVA8k',
    },
    {
      id: 'general',
      name: 'General Post',
      placeholder: 'Share skills with others...',
      defaultText: '',
      defaultMedia: null,
    },
  ];

  // ------------------ TOKEN EXPIRATION CHECK ------------------
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= (expiry - 5000);
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

  // ------------------ HANDLE FILE CHANGE ------------------
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setErrorMessage('');

    const hasVideo = files.some((file) => file.type.startsWith('video/'));
    const currentHasVideo = mediaFiles.some((file) => file.type && file.type.startsWith('video/'));

    if (hasVideo && (mediaFiles.length > 0 || files.length > 1)) {
      setErrorMessage('You can only upload one video at a time, with no other media.');
      e.target.value = null;
      return;
    }

    if (currentHasVideo && files.length > 0) {
      setErrorMessage('You cannot add more media when a video is already selected.');
      e.target.value = null;
      return;
    }

    if (mediaFiles.length + files.length > MAX_MEDIA) {
      setErrorMessage(`You can upload up to ${MAX_MEDIA} photos or one video.`);
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
      setErrorMessage(`Invalid files: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      setMediaFiles((prev) => [...prev, ...validFiles]);
      setPreviewUrls((prev) => [...prev, ...validFiles.map((file) => URL.createObjectURL(file))]);
    }

    e.target.value = null;
  };

  // ------------------ GET VIDEO DURATION ------------------
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

  // ------------------ REMOVE MEDIA ------------------
  const removeMedia = (index) => {
    const newFiles = [...mediaFiles];
    const newUrls = [...previewUrls];
    newFiles.splice(index, 1);
    if (newUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(newUrls[index]);
    }
    newUrls.splice(index, 1);
    setMediaFiles(newFiles);
    setPreviewUrls(newUrls);
    setErrorMessage('');
  };

  // ------------------ UPLOAD MEDIA TO FIREBASE ------------------
  const uploadMediaToFirebase = async () => {
    const uploadTasks = mediaFiles.map(async (item) => {
      if (typeof item === 'string') {
        return item;
      }
      const fileRef = ref(storage, `posts/${uuidv4()}_${item.name}`);
      const snapshot = await uploadBytes(fileRef, item);
      return await getDownloadURL(snapshot.ref);
    });
    return await Promise.all(uploadTasks);
  };

  // ------------------ HANDLE SUBMIT ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to create a post.');
      return;
    }

    const token = localStorage.getItem('jwtToken');
    if (!token || isTokenExpired(token)) {
      alert('Your session has expired. Please log in again.');
      handleLogout();
      return;
    }

    if (description.trim().length === 0) {
      alert('Post content cannot be empty.');
      return;
    }

    try {
      setUploading(true);
      const mediaLinks = await uploadMediaToFirebase();
      const extractedTags = Array.from(new Set(description.match(/#[\w]+/g))) || [];

      const postPayload = {
        userId: user.id,
        content: description,
        tags: extractedTags.map((tag) => tag.replace('#', '')),
        mediaLinks,
        template: selectedTemplate,
      };

      await createPost(postPayload);
      alert('Post created successfully!');
      setDescription('');
      setMediaFiles([]);
      setPreviewUrls([]);
      setErrorMessage('');
      setCharCount(0);
      setSelectedTemplate(null);
      window.location.reload();
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Your session has expired. Please log in again.');
        handleLogout();
      } else {
        alert('Something went wrong. Try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  // ------------------ HANDLE DESCRIPTION CHANGE ------------------
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setDescription(text);
      setCharCount(text.length);
    }
  };

  // ------------------ TRIGGER FILE INPUT ------------------
  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // ------------------ HANDLE TEMPLATE SELECTION ------------------
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template.id);
    setDescription(template.defaultText);
    setCharCount(template.defaultText.length);
    setMediaFiles([]);
    setPreviewUrls([]);
    if (template.defaultMedia) {
      setMediaFiles([template.defaultMedia]);
      setPreviewUrls([template.defaultMedia]);
    }
  };

  // Set default template on mount
  useEffect(() => {
    const defaultTemplate = postTemplates.find((t) => t.id === 'general');
    setSelectedTemplate(defaultTemplate.id);
    setDescription(defaultTemplate.defaultText);
    setCharCount(defaultTemplate.defaultText.length);
    if (defaultTemplate.defaultMedia) {
      setMediaFiles([defaultTemplate.defaultMedia]);
      setPreviewUrls([defaultTemplate.defaultMedia]);
    }
  }, []);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previewUrls]);

  const currentTemplate = postTemplates.find((t) => t.id === selectedTemplate) || postTemplates[2];

  return (
    <Card className="create-post-card">
      <Form onSubmit={handleSubmit} className="post-editor">
        <div className="post-input-container">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="post-avatar"
          />
          <div className="post-input-wrapper">
            <Dropdown className="mb-2">
              <Dropdown.Toggle variant="outline-secondary" id="template-dropdown">
                {currentTemplate.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {postTemplates.map((template) => (
                  <Dropdown.Item
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    active={selectedTemplate === template.id}
                  >
                    {template.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder={currentTemplate.placeholder}
              className="post-input"
              value={description}
              onChange={handleDescriptionChange}
              disabled={uploading}
            />
            <div className={`char-counter ${charCount > MAX_CHARS * 0.9 ? 'warning' : ''}`}>
              {charCount}/{MAX_CHARS}
            </div>
          </div>
        </div>
        {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
        {previewUrls.length > 0 && (
          <div className="media-preview">
            {previewUrls.map((url, index) => {
              const media = mediaFiles[index];
              const isVideo = media && media.type && media.type.startsWith('video/');
              return (
                <div key={index} className="preview-item">
                  {isVideo ? (
                    <video
                      src={url}
                      controls
                      className="preview-media"
                    />
                  ) : (
                    <img
                      src={url}
                      alt={`Preview ${index}`}
                      className="preview-media"
                    />
                  )}
                  <button
                    type="button"
                    className="remove-media"
                    onClick={() => removeMedia(index)}
                    disabled={uploading}
                    aria-label={`Remove media item ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div className="post-actions">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={triggerFileInput}
            disabled={mediaFiles.length >= MAX_MEDIA || uploading}
          >
            📷 {mediaFiles.length > 0 ? `Add More (Max ${MAX_MEDIA})` : 'Add Media'}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="ms-auto"
            disabled={uploading || description.trim().length === 0}
          >
            {uploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Posting...
              </>
            ) : (
              'Post'
            )}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default CreatePost;