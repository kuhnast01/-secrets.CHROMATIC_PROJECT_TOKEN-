"use client";
import React from 'react';
import styles from './SecurityCompliancePanel.module.css';

const SecurityCompliancePanel: React.FC = () => (
  <section className={styles['security-compliance-panel']} aria-labelledby="security-compliance-heading">
    <h2 id="security-compliance-heading">Security & Compliance</h2>
    <ul>
      <li>End-to-end encryption (TLS/HTTPS everywhere)</li>
      <li>2FA/MFA support for all users</li>
      <li>GDPR/CCPA compliance (data export, right to be forgotten)</li>
      <li>Role-based access control (RBAC)</li>
      <li>Audit trails for all actions</li>
      <li>Penetration testing and vulnerability scanning</li>
      <li>Automated backups and disaster recovery</li>
      <li>Security monitoring and alerting</li>
      <li>Data residency and region controls</li>
      {/* Add more compliance features as needed */}
    </ul>
    <div className={styles['security-compliance-note']} role="note">
      <strong>Note:</strong> These features are critical for enterprise and publisher requirements.
    </div>
  </section>
);

export default SecurityCompliancePanel;
