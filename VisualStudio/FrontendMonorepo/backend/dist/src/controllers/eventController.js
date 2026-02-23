import { getAllEvents, createEvent } from '../models/eventModel';
import logger from '../utils/logger';
import { eventSchema } from '../utils/validate';
export async function getEvents(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const events = await getAllEvents({ skip, take: limit });
        res.json(events);
    }
    catch (err) {
        logger.error({ err }, 'Failed to fetch events');
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
export async function addEvent(req, res) {
    try {
        const parse = eventSchema.safeParse({ ...req.body, created_by: req.user?.id });
        if (!parse.success) {
            logger.warn({ issues: parse.error.issues }, 'Validation failed');
            return res.status(400).json({ error: 'Validation failed', issues: parse.error.issues });
        }
        const event = await createEvent(parse.data);
        res.status(201).json(event);
    }
    catch (err) {
        logger.error({ err }, 'Failed to create event');
        res.status(500).json({ error: 'Failed to create event' });
    }
}
