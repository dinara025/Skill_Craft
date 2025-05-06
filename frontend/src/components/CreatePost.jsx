import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import '../styles/CreatePost.css';
import { createPost } from '../services/postService'; // ✅ use postService for JWT

function CreatePost({ user }) {
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const MAX_CHARS = 500;
  const MAX_MEDIA = 3;
  const MAX_VIDEO_DURATION = 30;

  

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (mediaFiles.length + files.length > MAX_MEDIA) {
      alert(`You can upload up to ${MAX_MEDIA} media files.`);
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
            invalidFiles.push(`${file.name} (video too long)`);
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
      alert(`Invalid files:\n${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      setMediaFiles(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...validFiles.map(file => URL.createObjectURL(file))]);
    }

    if (e.target) e.target.value = null;
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

  const removeMedia = (index) => {
    const newFiles = [...mediaFiles];
    const newUrls = [...previewUrls];
    newFiles.splice(index, 1);
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setMediaFiles(newFiles);
    setPreviewUrls(newUrls);
  };

  const uploadMediaToFirebase = async () => {
    const uploadTasks = mediaFiles.map(async (file) => {
      const fileRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      return await getDownloadURL(snapshot.ref);
    });
    return await Promise.all(uploadTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to create a post.');
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
        userId: user,
        content: description,
        tags: extractedTags.map(tag => tag.replace('#', '')),
        mediaLinks,
      };

      await createPost(postPayload); // ✅ send with JWT headers
      alert('Post created successfully!');
      setDescription('');
      setCharCount(0);
      setMediaFiles([]);
      setPreviewUrls([]);
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Something went wrong. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setDescription(text);
      setCharCount(text.length);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="post-editor">
          <textarea
            placeholder="What's on your mind? (Use #hashtags to categorize)"
            value={description}
            onChange={handleDescriptionChange}
            required
            rows="5"
          ></textarea>
          <div className={`char-counter ${charCount > MAX_CHARS * 0.9 ? 'warning' : ''}`}>
            {charCount}/{MAX_CHARS}
          </div>
        </div>

        {previewUrls.length > 0 && (
          <div className="media-preview">
            {previewUrls.map((url, index) => (
              <div key={index} className="preview-item">
                {mediaFiles[index].type.startsWith('image/') ? (
                  <img src={url} alt={`Preview ${index}`} />
                ) : (
                  <video controls>
                    <source src={url} type={mediaFiles[index].type} />
                  </video>
                )}
                <button type="button" className="remove-media" onClick={() => removeMedia(index)}>×</button>
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button type="button" className="upload-btn" onClick={triggerFileInput} disabled={mediaFiles.length >= MAX_MEDIA || uploading}>
            📷 {mediaFiles.length > 0 ? 'Add More' : 'Add Media'}
          </button>
          {mediaFiles.length > 0 && (
            <div className="media-info">
              {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
            </div>
          )}
          <button type="submit" className="submit-btn" disabled={uploading || description.trim().length === 0}>
            {uploading ? <><span className="spinner"></span> Posting...</> : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
