import 'jest';
// Sprint 7: Security, Audit, and Compliance tests
import 'jest';
import { AuditLogger, AuditLogEntry, canPerformAction, User } from './audit';

describe('AuditLogger', () => {
  let logger: AuditLogger;
  const now = Date.now();

  beforeEach(() => {
    logger = new AuditLogger();
  });

  it('should log and retrieve entries by user', () => {
    const entry: AuditLogEntry = {
      timestamp: now,
      user: 'alice',
      actionType: 'plan',
      description: 'Created a plan',
    };
    logger.log(entry);
    const logs = logger.getLogsByUser('alice');
    expect(logs.length).toBe(1);
    expect(logs[0].description).toBe('Created a plan');
  });

  it('should retrieve entries by action type', () => {
    logger.log({ timestamp: now, user: 'bob', actionType: 'feedback', description: 'Feedback' });
    logger.log({ timestamp: now, user: 'carol', actionType: 'step', description: 'Step' });
    const feedbackLogs = logger.getLogsByAction('feedback');
    expect(feedbackLogs.length).toBe(1);
    expect(feedbackLogs[0].user).toBe('bob');
  });

  it('should retrieve all logs', () => {
    logger.log({ timestamp: now, user: 'a', actionType: 'plan', description: '' });
    logger.log({ timestamp: now, user: 'b', actionType: 'step', description: '' });
    expect(logger.getAllLogs().length).toBe(2);
  });
});

describe('canPerformAction', () => {
  it('should allow admin all actions', () => {
    const user: User = { username: 'admin', role: 'admin' };
    expect(canPerformAction(user, 'plan')).toBe(true);
    expect(canPerformAction(user, 'access')).toBe(true);
  });

  it('should restrict guest from all actions', () => {
    const user: User = { username: 'guest', role: 'guest' };
    expect(canPerformAction(user, 'plan')).toBe(false);
    expect(canPerformAction(user, 'feedback')).toBe(false);
  });

  it('should allow engineer to plan and step, not access', () => {
    const user: User = { username: 'eng', role: 'engineer' };
    expect(canPerformAction(user, 'plan')).toBe(true);
    expect(canPerformAction(user, 'access')).toBe(false);
  });
});
