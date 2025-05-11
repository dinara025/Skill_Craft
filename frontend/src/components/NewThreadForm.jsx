import React, { useState } from 'react';
import axios from 'axios';

const NewThreadForm = ({ onThreadCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const token = localStorage.getItem('jwtToken');
  const createdBy = localStorage.getItem('jwtUsername');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const res = await axios.post('http://localhost:8080/api/threads', {
        title,
        description,
        tags: tags.split(',').map(t => t.trim()),
        createdBy
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      onThreadCreated(res.data);
      setTitle('');
      setDescription('');
      setTags('');
    } catch (err) {
      console.error('Error creating thread:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Start a New Thread</h3>
      <input
        className="form-control mb-2"
        type="text"
        placeholder="Title (e.g., Python index error)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="form-control mb-2"
        rows="3"
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="form-control mb-2"
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button type="submit" className="btn btn-success">Create Thread</button>
    </form>
  );
};

export default NewThreadForm;
