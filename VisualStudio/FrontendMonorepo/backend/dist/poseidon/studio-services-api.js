"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Player-facing AI features
const player_ai_features_1 = require("./player-ai-features");
// Phase 4 Pillar 2: Studio Services API entry point
// Exposes Poseidon, LiveOps, Admin, Content, and Monitoring as independent, multi-tenant APIs
const express_1 = __importDefault(require("express"));
const agent_1 = require("./agent");
const liveops_validator_1 = require("./liveops-validator");
const content_pipeline_1 = require("./content-pipeline");
const backend_monitor_1 = require("./backend-monitor");
const agents = {};
const liveOpsValidators = {};
const contentPipelines = {};
const backendMonitors = {};
function getTenant(req) {
    return req.headers['x-tenant-id'] || 'default';
}
function getAgent(tenant) {
    if (!agents[tenant])
        agents[tenant] = new agent_1.PoseidonAgent({ user: tenant, sandboxRoot: `/tmp/${tenant}`, allowWrites: true });
    return agents[tenant];
}
function getLiveOpsValidator(tenant) {
    if (!liveOpsValidators[tenant])
        liveOpsValidators[tenant] = new liveops_validator_1.LiveOpsValidator();
    return liveOpsValidators[tenant];
}
function getContentPipeline(tenant) {
    if (!contentPipelines[tenant])
        contentPipelines[tenant] = new content_pipeline_1.ContentPipeline();
    return contentPipelines[tenant];
}
function getBackendMonitor(tenant) {
    if (!backendMonitors[tenant])
        backendMonitors[tenant] = new backend_monitor_1.BackendMonitor();
    return backendMonitors[tenant];
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Player-Facing AI Features endpoint
app.post('/api/player-ai/:featureId', async (req, res) => {
    const { featureId } = req.params;
    const userId = req.headers['x-user-id'] || 'anonymous';
    const feature = player_ai_features_1.playerAIFeatureRegistry.getFeature(featureId);
    if (!feature)
        return res.status(404).json({ error: 'Unknown AI feature' });
    if (!feature.isEnabledForUser(userId, req.body?.context)) {
        return res.status(403).json({ error: 'Feature not enabled for user' });
    }
    try {
        const result = await feature.run(req.body?.input, userId, req.body?.context);
        return res.json({ result });
    }
    catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        return res.status(500).json({ error: error.message });
    }
});
app.post('/api/:service/:action', async (req, res) => {
    const tenant = getTenant(req);
    const { service, action } = req.params;
    try {
        switch (service) {
            case 'poseidon':
                if (action === 'run') {
                    const agent = getAgent(tenant);
                    // ...call agent methods as needed
                    return res.json({ ok: true });
                }
                break;
            case 'liveops':
                if (action === 'validate') {
                    const validator = getLiveOpsValidator(tenant);
                    const result = validator.validate(req.body);
                    return res.json({ valid: result });
                }
                break;
            case 'content':
                if (action === 'validate') {
                    const pipeline = getContentPipeline(tenant);
                    const result = pipeline.validateSchema(req.body);
                    return res.json({ valid: result.valid, errors: result.errors });
                }
                break;
            case 'monitor':
                if (action === 'ingest') {
                    const monitor = getBackendMonitor(tenant);
                    monitor.ingestLog(req.body);
                    return res.json({ ok: true });
                }
                if (action === 'summarize') {
                    const monitor = getBackendMonitor(tenant);
                    const summary = monitor.summarizeIncidents();
                    return res.json({ summary });
                }
                break;
            default:
                return res.status(404).json({ error: 'Unknown service or action' });
        }
        return res.status(404).json({ error: 'Unknown service or action' });
    }
    catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        return res.status(500).json({ error: error.message });
    }
});
exports.default = app;
