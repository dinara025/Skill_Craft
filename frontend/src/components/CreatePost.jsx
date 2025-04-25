// import React, { useState } from 'react';
// import axios from 'axios';
// import { storage } from '../config/firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { v4 as uuidv4 } from 'uuid'; // for unique file names
// import '../styles/CreatePost.css';

// function CreatePost({ user }) {
//   const [description, setDescription] = useState('');
//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     const images = files.filter(file => file.type.startsWith('image/'));
//     const videos = files.filter(file => file.type.startsWith('video/'));

//     if (images.length > 3 || videos.length > 1 || (images.length && videos.length)) {
//       alert('You can only upload up to 3 images or 1 short video.');
//       return;
//     }

//     setMediaFiles(files);
//   };

//   const uploadMediaToFirebase = async () => {
//     const uploadPromises = mediaFiles.map(async (file) => {
//       const fileRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
//       const snapshot = await uploadBytes(fileRef, file);
//       return await getDownloadURL(snapshot.ref);
//     });

//     return await Promise.all(uploadPromises);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!user || !user.id) {
//       alert('User not logged in!');
//       return;
//     }

//     try {
//       setUploading(true);
//       const mediaLinks = await uploadMediaToFirebase();

//       const extractedTags = Array.from(new Set(description.match(/#[\w]+/g))) || [];

//       const newPost = {
//         userId: user.id,
//         content: description,
//         tags: extractedTags.map(tag => tag.replace('#', '')),
//         mediaLinks,
//       };

//       await axios.post('http://localhost:8080/api/posts', newPost);
//       alert('Post created successfully!');

//       // Reset form
//       setDescription('');
//       setMediaFiles([]);
//     } catch (err) {
//       console.error(err);
//       alert('Error creating post');
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="create-post-container">
//       <h2>Create New Post</h2>
//       <form onSubmit={handleSubmit} className="create-post-form">
//         <textarea
//           placeholder="Write your post here... (use #hashtags)"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         ></textarea>

//         <input
//           type="file"
//           accept="image/*,video/*"
//           multiple
//           onChange={handleFileChange}
//         />
//         {mediaFiles.length > 0 && (
//           <p>{mediaFiles.length} media file(s) selected</p>
//         )}

//         <button type="submit" disabled={uploading}>
//           {uploading ? 'Uploading...' : 'Create Post'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CreatePost;


import React, { useState, useRef } from 'react';
import axios from 'axios';
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import '../styles/CreatePost.css';

function CreatePost({ user }) {
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef(null);
  const MAX_CHARS = 500;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.filter(file => file.type.startsWith('image/'));
    const videos = files.filter(file => file.type.startsWith('video/'));

    if (images.length > 3 || videos.length > 1 || (images.length && videos.length)) {
      alert('You can only upload up to 3 images or 1 video (not both)');
      return;
    }

    if (videos.length > 0 && files[0].size > 50 * 1024 * 1024) { // 50MB limit
      alert('Video file size should be less than 50MB');
      return;
    }

    setMediaFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeMedia = (index) => {
    const newFiles = [...mediaFiles];
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);
    
    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]); // Free memory
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const uploadMediaToFirebase = async () => {
    const uploadPromises = mediaFiles.map(async (file) => {
      const fileRef = ref(storage, `posts/${uuidv4()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      return await getDownloadURL(snapshot.ref);
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

      await axios.post('http://localhost:8080/api/posts', newPost);
      
      // Reset form
      setDescription('');
      setMediaFiles([]);
      setPreviewUrls([]);
      setCharCount(0);
      
      alert('Post created successfully!');
    } catch (err) {
      console.error(err);
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
    fileInputRef.current.click();
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
                <button 
                  type="button" 
                  className="remove-media" 
                  onClick={() => removeMedia(index)}
                  aria-label="Remove media"
                >
                  &times;
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
          >
            <i className="icon-camera"></i> {mediaFiles.length > 0 ? 'Add More' : 'Add Media'}
          </button>
          
          {mediaFiles.length > 0 && (
            <div className="media-info">
              {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} selected
              {mediaFiles.some(f => f.type.startsWith('video/')) && ' (Video)'}
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