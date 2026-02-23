"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = getEvents;
exports.addEvent = addEvent;
const eventModel_1 = require("../models/eventModel");
const logger_1 = __importDefault(require("../utils/logger"));
const validate_1 = require("../utils/validate");
async function getEvents(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const events = await (0, eventModel_1.getAllEvents)({ skip, take: limit });
        res.json(events);
    }
    catch (err) {
        logger_1.default.error({ err }, 'Failed to fetch events');
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
async function addEvent(req, res) {
    try {
        const parse = validate_1.eventSchema.safeParse({ ...req.body, created_by: req.user?.id });
        if (!parse.success) {
            logger_1.default.warn({ issues: parse.error.issues }, 'Validation failed');
            return res.status(400).json({ error: 'Validation failed', issues: parse.error.issues });
        }
        const event = await (0, eventModel_1.createEvent)(parse.data);
        res.status(201).json(event);
    }
    catch (err) {
        logger_1.default.error({ err }, 'Failed to create event');
        res.status(500).json({ error: 'Failed to create event' });
    }
}
