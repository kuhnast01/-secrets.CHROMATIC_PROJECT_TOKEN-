"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
// Sprint 7: Security, Audit, and Compliance tests
require("jest");
const audit_1 = require("./audit");
describe('AuditLogger', () => {
    let logger;
    const now = Date.now();
    beforeEach(() => {
        logger = new audit_1.AuditLogger();
    });
    it('should log and retrieve entries by user', () => {
        const entry = {
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
        const user = { username: 'admin', role: 'admin' };
        expect((0, audit_1.canPerformAction)(user, 'plan')).toBe(true);
        expect((0, audit_1.canPerformAction)(user, 'access')).toBe(true);
    });
    it('should restrict guest from all actions', () => {
        const user = { username: 'guest', role: 'guest' };
        expect((0, audit_1.canPerformAction)(user, 'plan')).toBe(false);
        expect((0, audit_1.canPerformAction)(user, 'feedback')).toBe(false);
    });
    it('should allow engineer to plan and step, not access', () => {
        const user = { username: 'eng', role: 'engineer' };
        expect((0, audit_1.canPerformAction)(user, 'plan')).toBe(true);
        expect((0, audit_1.canPerformAction)(user, 'access')).toBe(false);
    });
});
