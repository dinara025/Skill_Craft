import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreatePost.css';

function CreatePost({ user }) {
  const [description, setDescription] = useState('');
  const [mediaLinks, setMediaLinks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      alert('User not logged in!');
      return;
    }

    // Extract hashtags from the description
    const extractedTags = Array.from(new Set(description.match(/#[\w]+/g))) || [];

    const newPost = {
      userId: user.id,
      content: description,
      tags: extractedTags.map(tag => tag.replace('#', '')),
      mediaLinks: mediaLinks.split(',').map(link => link.trim()).filter(link => link)
    };

    try {
      await axios.post('http://localhost:8080/api/posts', newPost);
      alert('Post created successfully!');
      setDescription('');
      setMediaLinks('');
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    }
  };

  return (
    <div className="create-post-container">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          placeholder="Write your post here... (use #hashtags to tag)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Media Links (comma separated URLs)"
          value={mediaLinks}
          onChange={(e) => setMediaLinks(e.target.value)}
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
