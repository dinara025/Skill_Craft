import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LearningPlans.css";

const initialForm = {
    title: "",
    description: "",
    topics: "",
    resources: "",
    targetCompletionDate: "",
    completed: false,
};

const LearningPlans = ({ userId }) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);

    const API = "http://localhost:8080/api/learning-plans";

    useEffect(() => {
        if (!userId) return;
        fetchPlans();
    }, [userId]);

    const fetchPlans = () => {
        axios.get(`${API}/user/${userId}`).then(res => {
            setPlans(res.data);
            setLoading(false);
        }).catch(err => console.error(err));
    };

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const openModal = (plan = null) => {
        if (plan) {
            setEditId(plan.id);
            setForm({
                title: plan.title,
                description: plan.description,
                topics: plan.topics.join(", "),
                resources: plan.resources.join(", "),
                targetCompletionDate: plan.targetCompletionDate,
                completed: plan.completed,
            });
        } else {
            setEditId(null);
            setForm(initialForm);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setForm(initialForm);
        setEditId(null);
    };

    const handleSubmit = e => {
        e.preventDefault();
        const payload = {
            ...form,
            userId,
            topics: form.topics.split(",").map(t => t.trim()),
            resources: form.resources.split(",").map(r => r.trim()),
        };

        const req = editId
            ? axios.put(`${API}/${editId}`, payload)
            : axios.post(API, payload);

        req.then(() => {
            fetchPlans();
            closeModal();
        }).catch(err => console.error(err));
    };

    const handleDelete = id => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            axios.delete(`${API}/${id}`).then(() => fetchPlans());
        }
    };

    return (
        <div className="learning-plans-container">
            <h2>Your Learning Plans</h2>
            <button className="create-btn" onClick={() => openModal()}>+ Create New Plan</button>

            {loading ? <p>Loading...</p> : (
                <ul className="plan-list">
                    {plans.map(plan => (
                        <li key={plan.id} className="plan-card">
                            <h3>{plan.title}</h3>
                            <p>{plan.description}</p>
                            <p><strong>Topics:</strong> {plan.topics.join(", ")}</p>
                            <p><strong>Resources:</strong> {plan.resources.join(", ")}</p>
                            <p><strong>Target Date:</strong> {plan.targetCompletionDate}</p>
                            <p><strong>Status:</strong> {plan.completed ? "✅ Completed" : "⌛ In Progress"}</p>
                            <div className="actions">
                                <button onClick={() => openModal(plan)}>Edit</button>
                                <button className="danger" onClick={() => handleDelete(plan.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editId ? "Edit Plan" : "Create Plan"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleInputChange} required />
                            <textarea name="description" placeholder="Description" value={form.description} onChange={handleInputChange} required />
                            <input type="text" name="topics" placeholder="Topics (comma-separated)" value={form.topics} onChange={handleInputChange} />
                            <input type="text" name="resources" placeholder="Resources (comma-separated)" value={form.resources} onChange={handleInputChange} />
                            <input type="date" name="targetCompletionDate" value={form.targetCompletionDate} onChange={handleInputChange} />
                            <label>
                                <input type="checkbox" name="completed" checked={form.completed} onChange={handleInputChange} />
                                Completed
                            </label>
                            <div className="modal-actions">
                                <button type="submit">{editId ? "Update" : "Create"}</button>
                                <button type="button" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningPlans;
