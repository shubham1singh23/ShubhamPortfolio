import React, { useState, useEffect } from 'react';
import './AdminEducation.css';

const emptyScore = { examTitle: '', score: '' };

const AdminEducation = () => {
  const [education, setEducation] = useState([]);
  const [formData, setFormData] = useState({
    courseName: '',
    collegeName: '',
    duration: '',
    scores: [{ ...emptyScore }],
    isVisible: true
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => { fetchEducation(); }, []);

  const fetchEducation = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://portfoliobackend-i1wy.onrender.com/api/education/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch education');
      const data = await res.json();
      setEducation(data);
    } catch (err) {
      setError('Could not load education data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleScoreChange = (idx, e) => {
    const newScores = formData.scores.map((s, i) => i === idx ? { ...s, [e.target.name]: e.target.value } : s);
    setFormData({ ...formData, scores: newScores });
  };

  const addScore = () => setFormData({ ...formData, scores: [...formData.scores, { ...emptyScore }] });
  const removeScore = idx => setFormData({ ...formData, scores: formData.scores.filter((_, i) => i !== idx) });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `https://portfoliobackend-i1wy.onrender.com/api/education/${editId}` : 'https://portfoliobackend-i1wy.onrender.com/api/education';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save education');
      setFormData({ courseName: '', collegeName: '', duration: '', scores: [{ ...emptyScore }], isVisible: true });
      setEditId(null);
      fetchEducation();
    } catch (err) {
      setError('Could not save education.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = edu => {
    setFormData({ ...edu, scores: edu.scores.length ? edu.scores : [{ ...emptyScore }] });
    setEditId(edu._id);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://portfoliobackend-i1wy.onrender.com/api/education/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete education');
      fetchEducation();
    } catch (err) {
      setError('Could not delete education.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({ courseName: '', collegeName: '', duration: '', scores: [{ ...emptyScore }], isVisible: true });
    setError('');
  };

  return (
    <div className="admin-education-section">
      <h2>Manage Education</h2>
      <form className="admin-education-form" onSubmit={handleSubmit}>
        <input name="courseName" value={formData.courseName} onChange={handleChange} placeholder="Course Name" required />
        <input name="collegeName" value={formData.collegeName} onChange={handleChange} placeholder="College Name" required />
        <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (e.g. 2020-2024)" />
        <div className="admin-education-scores">
          <label>Scores:</label>
          {formData.scores.map((score, idx) => (
            <div key={idx} className="admin-education-score-row">
              <input name="examTitle" value={score.examTitle} onChange={e => handleScoreChange(idx, e)} placeholder="Exam Title" required />
              <input name="score" value={score.score} onChange={e => handleScoreChange(idx, e)} placeholder="Score" required />
              {formData.scores.length > 1 && <button type="button" onClick={() => removeScore(idx)}>-</button>}
            </div>
          ))}
          <button type="button" onClick={addScore}>+ Add Score</button>
        </div>
        <label>
          <input type="checkbox" checked={formData.isVisible} onChange={e => setFormData({ ...formData, isVisible: e.target.checked })} />
          Visible
        </label>
        <button type="submit" disabled={loading}>{editId ? 'Update' : 'Add'} Education</button>
        {editId && <button type="button" onClick={handleCancel}>Cancel</button>}
        {error && <div className="admin-education-error">{error}</div>}
      </form>
      <div className="admin-education-list">
        {loading ? <div>Loading...</div> : education.length === 0 ? <div>No education entries found.</div> : education.map(edu => (
          <div key={edu._id} className="admin-education-item">
            <div>
              <b>{edu.courseName}</b> at <b>{edu.collegeName}</b> {edu.duration && <>({edu.duration})</>}
              <ul>
                {edu.scores.map((s, i) => <li key={i}>{s.examTitle}: {s.score}</li>)}
              </ul>
              <span className={edu.isVisible ? 'visible' : 'hidden'}>{edu.isVisible ? 'Visible' : 'Hidden'}</span>
            </div>
            <div>
              <button onClick={() => handleEdit(edu)}>Edit</button>
              <button onClick={() => handleDelete(edu._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEducation;
