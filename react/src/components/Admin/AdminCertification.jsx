import React, { useState, useEffect } from 'react';
import './AdminCertification.css';

const AdminCertification = () => {
  const [certifications, setCertifications] = useState([]);
  const [formData, setFormData] = useState({
    certificationName: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: 'No expiry',
    credentialId: '',
    verificationLink: '',
    description: '',
    isVisible: true
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('adminToken');

  useEffect(() => { fetchCertifications(); }, []);

  const fetchCertifications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('https://portfoliobackend-i1wy.onrender.com/api/certifications/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch certifications');
      const data = await res.json();
      setCertifications(data);
    } catch (err) {
      setError('Could not load certification data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `https://portfoliobackend-i1wy.onrender.com/api/certifications/${editId}` : 'https://portfoliobackend-i1wy.onrender.com/api/certifications';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save certification');
      setFormData({
        certificationName: '',
        issuingOrganization: '',
        issueDate: '',
        expiryDate: 'No expiry',
        credentialId: '',
        verificationLink: '',
        description: '',
        isVisible: true
      });
      setEditId(null);
      fetchCertifications();
    } catch (err) {
      setError('Could not save certification.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = cert => {
    setFormData({ ...cert });
    setEditId(cert._id);
  };

  const handleDelete = async id => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://portfoliobackend-i1wy.onrender.com/api/certifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete certification');
      fetchCertifications();
    } catch (err) {
      setError('Could not delete certification.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({
      certificationName: '',
      issuingOrganization: '',
      issueDate: '',
      expiryDate: 'No expiry',
      credentialId: '',
      verificationLink: '',
      description: '',
      isVisible: true
    });
    setError('');
  };

  return (
    <div className="admin-certification-section">
      <h2>Manage Certifications</h2>
      <form className="admin-certification-form" onSubmit={handleSubmit}>
        <input
          name="certificationName"
          value={formData.certificationName}
          onChange={handleChange}
          placeholder="Certification Name"
          required
        />
        <input
          name="issuingOrganization"
          value={formData.issuingOrganization}
          onChange={handleChange}
          placeholder="Issuing Organization"
          required
        />
        <input
          name="issueDate"
          value={formData.issueDate}
          onChange={handleChange}
          placeholder="Issue Date (e.g., June 2024)"
          required
        />
        <input
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
          placeholder="Expiry Date (e.g., June 2025 or No expiry)"
        />
        <input
          name="credentialId"
          value={formData.credentialId}
          onChange={handleChange}
          placeholder="Credential ID (optional)"
        />
        <input
          name="verificationLink"
          value={formData.verificationLink}
          onChange={handleChange}
          placeholder="Verification Link (optional)"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short Description (optional)"
          rows="3"
        />
        <label>
          <input
            type="checkbox"
            checked={formData.isVisible}
            onChange={e => setFormData({ ...formData, isVisible: e.target.checked })}
          />
          Visible
        </label>
        <button type="submit" disabled={loading}>
          {editId ? 'Update' : 'Add'} Certification
        </button>
        {editId && <button type="button" onClick={handleCancel}>Cancel</button>}
        {error && <div className="admin-certification-error">{error}</div>}
      </form>

      <div className="admin-certification-list">
        {loading ? <div>Loading...</div> : certifications.length === 0 ? <div>No certifications found.</div> : certifications.map(cert => (
          <div key={cert._id} className="admin-certification-item">
            <div>
              <b>{cert.certificationName}</b> from <b>{cert.issuingOrganization}</b>
              <p>Issued: {cert.issueDate} | Expires: {cert.expiryDate}</p>
              {cert.credentialId && <p>Credential ID: {cert.credentialId}</p>}
              {cert.description && <p>{cert.description}</p>}
              {cert.verificationLink && (
                <a href={cert.verificationLink} target="_blank" rel="noopener noreferrer">
                  View Certificate
                </a>
              )}
              <span className={cert.isVisible ? 'visible' : 'hidden'}>
                {cert.isVisible ? 'Visible' : 'Hidden'}
              </span>
            </div>
            <div>
              <button onClick={() => handleEdit(cert)}>Edit</button>
              <button onClick={() => handleDelete(cert._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCertification; 