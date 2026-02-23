"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsData = getAnalyticsData;
const analyticsModel_1 = require("../models/analyticsModel");
const logger_1 = __importDefault(require("../utils/logger"));
const csvExport_1 = require("../utils/csvExport");
// GET /analytics - List analytics data (admin/analyst)
// Supports filtering by metric, date range, and CSV export
async function getAnalyticsData(req, res) {
    try {
        // Optional filtering by metric, date range
        const { metric, from, to, format } = req.query;
        const where = {};
        if (typeof metric === 'string' && metric) {
            where.metric = metric;
        }
        const recordedAtFilter = {};
        if (typeof from === 'string' && from) {
            recordedAtFilter.gte = new Date(from);
        }
        if (typeof to === 'string' && to) {
            recordedAtFilter.lte = new Date(to);
        }
        if (recordedAtFilter.gte || recordedAtFilter.lte) {
            where.recorded_at = recordedAtFilter;
        }
        const analytics = await (0, analyticsModel_1.getAnalytics)({ where });
        if (format === 'csv') {
            const csv = (0, csvExport_1.toCSV)(analytics);
            res.header('Content-Type', 'text/csv');
            res.attachment('analytics.csv');
            return res.send(csv);
        }
        res.json(analytics);
    }
    catch (err) {
        logger_1.default.error({ err }, 'Failed to fetch analytics');
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
}
