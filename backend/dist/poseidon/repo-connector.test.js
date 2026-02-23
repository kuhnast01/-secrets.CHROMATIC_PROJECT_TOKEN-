"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Phase 2 Pillar 1: Repo Integration tests for Poseidon
const repo_connector_1 = require("./repo-connector");
describe('RepoConnector', () => {
    const config = {
        type: 'web',
        name: 'web-app',
        path: '/repos/web',
        allowWriteBranches: ['dev', 'staging'],
        prTargetBranch: 'dev',
    };
    let connector;
    beforeEach(() => {
        connector = new repo_connector_1.RepoConnector(config);
    });
    it('should allow writes only to allowed branches', () => {
        expect(connector.canWriteToBranch('dev')).toBe(true);
        expect(connector.canWriteToBranch('main')).toBe(false);
    });
    it('should return the correct PR target branch', () => {
        expect(connector.getPRTargetBranch()).toBe('dev');
    });
    it('should open a PR only on allowed branches', async () => {
        await expect(connector.openPullRequest('diff', 'dev', 'title', 'desc')).resolves.toHaveProperty('prUrl');
        await expect(connector.openPullRequest('diff', 'main', 'title', 'desc')).rejects.toThrow('Write not allowed');
    });
    it('should summarize a diff', async () => {
        const summary = await connector.summarizeDiff('diff content here');
        expect(summary).toContain('Summary:');
    });
});
