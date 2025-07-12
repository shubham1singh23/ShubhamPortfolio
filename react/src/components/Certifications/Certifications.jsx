import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Certifications.css';

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/data/portfolio.json')
      .then(res => res.json())
      .then(data => {
        setCertifications(data.certifications || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load certifications');
        setLoading(false);
      });
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <section id="certifications" className="certifications-section">
        <div className="container">
          <motion.h2
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Certifications
          </motion.h2>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading certifications...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="certifications" className="certifications-section">
        <div className="container">
          <motion.h2
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Certifications
          </motion.h2>
          <motion.div
            className="error-container"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  if (!Array.isArray(certifications) || certifications.length === 0) {
    return (
      <section id="certifications" className="certifications-section">
        <div className="container">
          <motion.h2
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Certifications
          </motion.h2>
          <motion.div
            className="no-certifications-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="empty-icon">📜</div>
            <p>No certifications available at the moment.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="certifications-section">
      <div className="container">
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Certifications
        </motion.h2>

        <motion.div
          className="certifications-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {certifications.map((certification, index) => (
            <motion.div
              key={certification._id || index}
              className="certification-card"
              variants={cardVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="certification-header">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {certification.certificationName}
                </motion.h3>
                <motion.span
                  className="organization"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                >
                  {certification.issuingOrganization}
                </motion.span>
              </div>

              <motion.div
                className="certification-details"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <div className="date-info">
                  <span className="issue-date">
                    <strong>Issued:</strong> {certification.issueDate}
                  </span>
                  <span className="expiry-date">
                    <strong>Expires:</strong> {certification.expiryDate}
                  </span>
                </div>

                {certification.credentialId && (
                  <div className="credential-id">
                    <strong>Credential ID:</strong> {certification.credentialId}
                  </div>
                )}

                {certification.description && (
                  <p className="description">{certification.description}</p>
                )}
              </motion.div>

              {certification.verificationLink && (
                <motion.div
                  className="certification-actions"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                >
                  <motion.a
                    href={certification.verificationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="verify-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>View Certificate</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" />
                    </svg>
                  </motion.a>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;