// Script to generate a summary of recent admin actions from audit logs
// Usage: node backend/scripts/admin-action-log-summary.js
const fs = require('fs');
const path = require('path');

// TODO: Replace with DB query in production
const auditLogPath = path.join(__dirname, '../tmp/audit-log.json');
if (!fs.existsSync(auditLogPath)) {
  console.error('No audit log found.');
  process.exit(1);
}
const logs = JSON.parse(fs.readFileSync(auditLogPath, 'utf-8'));

console.log('Recent Admin Actions:');
logs.filter(log => log.userRole === 'admin').forEach(log => {
  console.log(`- [${log.timestamp}] ${log.user}: ${log.action} (${log.status})`);
  if (log.reason) console.log(`  Reason: ${log.reason}`);
});
