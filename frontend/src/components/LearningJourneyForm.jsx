import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import "../styles/LearningJourneyForm.css";

const LearningJourneyForm = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const entry = location.state?.entry || null;

  const [formData, setFormData] = useState({
    title: entry?.title || "",
    type: entry?.type || "skill",
    date: entry?.date ? new Date(entry.date).toISOString().split("T")[0] : "",
    description: entry?.description || "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("Authentication token not found");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        type: formData.type,
        date: formData.date,
        description: formData.description,
      };

      if (entry) {
        // Update existing entry
        await axios.put(`/api/auth/learning-journey/${entry.id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } else {
        // Create new entry
        await axios.post("/api/auth/learning-journey", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      }

      navigate("/profile");
    } catch (error) {
      console.error("Error submitting learning journey entry:", error);
      setError(
        error.response?.status === 401
          ? "Your session has expired. Please log in again."
          : error.response?.data?.message || "Failed to submit learning journey entry"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="learning-journey-form-container">
      <h2>{entry ? "Edit Learning Journey Entry" : "Add Learning Journey Entry"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select name="type" value={formData.type} onChange={handleChange} required>
            <option value="skill">Skill</option>
            <option value="course">Course</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : entry ? "Update Entry" : "Add Entry"}
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/profile")}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default LearningJourneyForm;