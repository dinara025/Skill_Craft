import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import '../styles/CreatePost.css';

// Preconditions:
// - The user must be logged in to create a post.
// - The post content (description) cannot be empty.
// - Users can upload up to 3 photos or short videos (max: 30 seconds) per post.

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
  const MAX_VIDEO_DURATION = 30; // seconds

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      console.log('No files selected in handleFileChange');
      return;
    }

    console.log('Files selected:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
    console.log('Current mediaFiles before update:', mediaFiles.map(f => ({ name: f.name, type: f.type })));

    // Check total media count
    const totalMedia = mediaFiles.length + files.length;
    if (totalMedia > MAX_MEDIA) {
      alert(`You can upload up to ${MAX_MEDIA} photos or videos in total. Currently, you have ${mediaFiles.length} file(s) selected.`);
      return;
    }

    // Validate file types and videos
    const invalidFiles = [];
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        invalidFiles.push(`${file.name} (unsupported file type)`);
        continue;
      }

      if (file.type.startsWith('video/')) {
        try {
          const duration = await getVideoDuration(file);
          console.log(`Video duration for ${file.name}: ${duration} seconds`);
          if (duration > MAX_VIDEO_DURATION) {
            invalidFiles.push(`${file.name} (video exceeds ${MAX_VIDEO_DURATION} seconds)`);
            continue;
          }
        } catch (error) {
          console.error('Error checking video duration for', file.name, error);
          invalidFiles.push(`${file.name} (error processing video)`);
          continue;
        }
      }

      validFiles.push(file);
    }

    if (invalidFiles.length > 0) {
      alert(`Invalid files: ${invalidFiles.join(', ')}`);
      return;
    }

    if (validFiles.length === 0) {
      console.log('No valid files to add after validation');
      return;
    }

    // Append new files to existing ones
    const newFiles = [...mediaFiles, ...validFiles];
    console.log('New mediaFiles after update:', newFiles.map(f => ({ name: f.name, type: f.type })));
    setMediaFiles(newFiles);

    // Generate preview URLs for new files
    const newUrls = validFiles.map(file => {
      const url = URL.createObjectURL(file);
      console.log(`Generated preview URL for ${file.name}: ${url}`);
      return url;
    });
    setPreviewUrls(prev => {
      const updatedUrls = [...prev, ...newUrls];
      console.log('Updated previewUrls:', updatedUrls);
      return updatedUrls;
    });

    // Clear the file input to allow new selections
    if (e.target) {
      e.target.value = null;
      console.log('File input cleared');
    }
  };

  // Helper function to get video duration
  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        reject(new Error('Error loading video metadata'));
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMedia = (index) => {
    console.log(`Removing media at index ${index}`);
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);

    const newUrls = [...previewUrls];
    if (newUrls[index]) {
      URL.revokeObjectURL(newUrls[index]);
      console.log(`Revoked URL: ${newUrls[index]}`);
    }
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);

    console.log('MediaFiles after removal:', newFiles.map(f => ({ name: f.name, type: f.type })));
    console.log('PreviewUrls after removal:', newUrls);
  };

  const uploadMediaToFirebase = async () => {
    console.log('Starting upload to Firebase:', mediaFiles.map(f => ({ name: f.name, type: f.type })));
    const uploadPromises = mediaFiles.map(async (file) => {
      const fileRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      console.log(`Uploaded ${file.name} to Firebase, URL: ${url}`);
      return url;
    });

    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      alert('Please login to create a post');
      return;
    }

    if (description.trim().length === 0) {
      alert('Post content cannot be empty');
      return;
    }

    try {
      setUploading(true);
      const mediaLinks = mediaFiles.length > 0 ? await uploadMediaToFirebase() : [];

      const extractedTags = Array.from(new Set(description.match(/#[\w]+/g))) || [];

      const newPost = {
        userId: user.id,
        content: description,
        tags: extractedTags.map(tag => tag.replace('#', '')),
        mediaLinks,
      };

      console.log('Submitting post:', newPost);
      await axios.post('http://localhost:8080/api/posts', newPost);

      // Reset form
      setDescription('');
      setMediaFiles([]);
      setPreviewUrls([]);
      setCharCount(0);

      alert('Post created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('Error creating post. Please try again.');
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
    if (fileInputRef.current) {
      console.log('Triggering file input click');
      fileInputRef.current.click();
    } else {
      console.error('File input ref is not set');
    }
  };

  // Log the disabled state of the upload button for debugging
  const isUploadButtonDisabled = mediaFiles.length >= MAX_MEDIA || uploading;
  console.log(`Upload button disabled state: ${isUploadButtonDisabled}, mediaFiles.length: ${mediaFiles.length}, uploading: ${uploading}`);

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
                {mediaFiles[index] && mediaFiles[index].type.startsWith('image/') ? (
                  <img src={url} alt={`Preview ${index}`} onError={() => console.log(`Error loading image preview ${index}: ${url}`)} />
                ) : (
                  <video controls onError={() => console.log(`Error loading video preview ${index}: ${url}`)}>
                    <source src={url} type={mediaFiles[index]?.type} />
                  </video>
                )}
                <button
                  type="button"
                  className="remove-media"
                  onClick={() => removeMedia(index)}
                  aria-label="Remove media"
                >
                  ×
                </button>
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
          <button
            type="button"
            className="upload-btn"
            onClick={triggerFileInput}
            disabled={isUploadButtonDisabled}
          >
            <i className="icon-camera"></i> {mediaFiles.length > 0 ? 'Add More' : 'Add Media'}
          </button>
          {mediaFiles.length > 0 && (
            <div className="media-info">
              {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
            </div>
          )}
          <button
            type="submit"
            className="submit-btn"
            disabled={uploading || description.trim().length === 0}
          >
            {uploading ? (
              <>
                <span className="spinner"></span> Posting...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;