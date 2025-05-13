import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuthHeaders } from '../services/authService'; // Adjust path based on your project structure
import '../styles/ProfileEdit.css';

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    bio: '',
    profilePhoto: '',
    education: '',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState(''); // Assuming username is available

  // Fetch current user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Please log in to edit your profile');
          return;
        }

        // Decode JWT to get username (assumes JWT contains username in payload)
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userUsername = decoded.sub; // Adjust based on your JWT structure
        setUsername(userUsername);

        // Fetch user details
        const response = await axios.get(`http://localhost:8080/api/auth/userDetails/${userUsername}`, getAuthHeaders());
        const user = response.data;
        setFormData({
          bio: user.bio || '',
          profilePhoto: user.profilePhoto || '',
          education: user.education || '',
          skills: user.skills || [],
        });
      } catch (err) {
        setError('Failed to load profile: ' + (err.response?.data || err.message));
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new skill
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  // Remove a skill
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/profile',
        null,
        {
          params: {
            username,
            bio: formData.bio,
            profilePhoto: formData.profilePhoto,
            education: formData.education,
            skills: formData.skills,
          },
          ...getAuthHeaders(),
        }
      );
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="profile-edit-container">
      <h2 className="profile-edit-title">Edit Profile</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="form-group">
          <label htmlFor="bio" className="form-label">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Tell us about yourself"
          />
        </div>
        <div className="form-group">
          <label htmlFor="profilePhoto" className="form-label">Profile Photo URL</label>
          <input
            id="profilePhoto"
            name="profilePhoto"
            type="url"
            value={formData.profilePhoto}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <div className="form-group">
          <label htmlFor="education" className="form-label">Education</label>
          <input
            id="education"
            name="education"
            type="text"
            value={formData.education}
            onChange={handleChange}
            className="form-input"
            placeholder="Your education"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Skills</label>
          <div className="skill-input-group">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="form-input skill-input"
              placeholder="Add a skill"
            />
            <button
              type="button"
              onClick={addSkill}
              className="button button-primary"
            >
              Add
            </button>
          </div>
          <ul className="skills-list">
            {formData.skills.map((skill, index) => (
              <li key={index} className="skill-item">
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="button button-remove"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="submit"
          className="button button-submit"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;