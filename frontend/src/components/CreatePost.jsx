import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreatePost.css';

function CreatePost({ user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [type, setType] = useState('normal');
  const [mediaLinks, setMediaLinks] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.username) {
      alert('User not logged in!');
      return;
    }

    const newPost = {
      userId: user.username, // assumes username is used as userId
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()),
      type,
      mediaLinks: mediaLinks.split(',').map(link => link.trim())
    };

    try {
      const res = await axios.post('http://localhost:8080/api/posts', newPost);
      alert('Post created successfully!');
      setTitle('');
      setContent('');
      setTags('');
      setType('normal');
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
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <input
          type="text"
          placeholder="Media Links (comma separated URLs)"
          value={mediaLinks}
          onChange={(e) => setMediaLinks(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="normal">Normal</option>
          <option value="template">Template</option>
          <option value="learningUpdate">Learning Update</option>
        </select>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
