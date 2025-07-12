import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical, faEdit, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './AdminProjects.css';

const API_BASE = 'https://portfoliobackend-i1wy.onrender.com/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech: '',
    image: '',
    github: '',
    live: ''
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/projects`);
      setProjects(res.data);
    } catch (err) {
      setError('Could not load projects.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const techArr = formData.tech.split(',').map(t => t.trim()).filter(Boolean);
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    techArr.forEach(t => submitData.append('tech', t));
    submitData.append('github', formData.github);
    submitData.append('live', formData.live);
    if (formData.image) submitData.append('image', formData.image);

    try {
      if (editId) {
        await axios.put(`${API_BASE}/projects/${editId}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post(`${API_BASE}/projects`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setFormData({ title: '', description: '', tech: '', image: '', github: '', live: '' });
      setEditId(null);
      fetchProjects();
    } catch (err) {
      setError('Could not save project.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = project => {
    setFormData({
      ...project,
      tech: project.tech.join(', '),
      image: ''
    });
    setEditId(project._id);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`${API_BASE}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      setError('Could not delete project.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({ title: '', description: '', tech: '', image: '', github: '', live: '' });
    setError('');
  };

  // Drag and Drop functionality
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === dropIndex) return;

    const newProjects = [...projects];
    const draggedProject = newProjects[draggedItem];
    newProjects.splice(draggedItem, 1);
    newProjects.splice(dropIndex, 0, draggedProject);

    // Update positions
    const positions = newProjects.map((project, index) => ({
      id: project._id,
      position: index
    }));

    try {
      const res = await axios.put(`${API_BASE}/projects/positions/update`, { positions }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      setError('Could not update project order.');
      fetchProjects(); // Revert to original order
    }

    setDraggedItem(null);
  };

  return (
    <div className="admin-projects-section">
      <h2>Manage Projects</h2>

      <form className="admin-projects-form" onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Project Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project Description"
          rows="3"
          required
        />
        <input
          name="tech"
          value={formData.tech}
          onChange={handleChange}
          placeholder="Technologies (comma-separated)"
          required
        />
        <input
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="GitHub URL"
        />
        <input
          name="live"
          value={formData.live}
          onChange={handleChange}
          placeholder="Live Demo URL"
        />
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
        />

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {editId ? 'Update' : 'Add'} Project
          </button>
          {editId && (
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>

        {error && <div className="admin-projects-error">{error}</div>}
      </form>

      <div className="admin-projects-list">
        <h3>Projects ({projects.length})</h3>
        <p className="drag-instructions">
          <FontAwesomeIcon icon={faGripVertical} /> Drag projects to reorder them
        </p>

        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="no-projects">No projects found.</div>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className={`project-item ${draggedItem === index ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="project-header">
                  <div className="drag-handle">
                    <FontAwesomeIcon icon={faGripVertical} />
                  </div>
                  <div className="project-position">#{index + 1}</div>
                  <div className="project-actions">
                    <button onClick={() => handleEdit(project)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(project._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>

                <div className="project-content">
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, i) => (
                      <span key={i}>{tech}</span>
                    ))}
                  </div>
                  {project.image && (
                    <img src={project.image} alt={project.title} className="project-thumbnail" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProjects; 