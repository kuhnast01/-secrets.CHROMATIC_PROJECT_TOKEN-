
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getAnalytics } from '../models/analyticsModel';
import logger from '../utils/logger';
import { toCSV } from '../utils/csvExport';

// GET /analytics - List analytics data (admin/analyst)
// Supports filtering by metric, date range, and CSV export
export async function getAnalyticsData(req: Request, res: Response) {
  try {
    // Optional filtering by metric, date range
    const { metric, from, to, format } = req.query;
    const where: Prisma.AnalyticsWhereInput = {};
    if (typeof metric === 'string' && metric) {
      where.metric = metric;
    }

    const recordedAtFilter: Prisma.DateTimeFilter<'Analytics'> = {};
    if (typeof from === 'string' && from) {
      recordedAtFilter.gte = new Date(from);
    }
    if (typeof to === 'string' && to) {
      recordedAtFilter.lte = new Date(to);
    }
    if (recordedAtFilter.gte || recordedAtFilter.lte) {
      where.recorded_at = recordedAtFilter;
    }
    const analytics = await getAnalytics({ where });
    if (format === 'csv') {
      const csv = toCSV(analytics);
      res.header('Content-Type', 'text/csv');
      res.attachment('analytics.csv');
      return res.send(csv);
    }
    res.json(Array.isArray(analytics) ? analytics : []);
  } catch (err) {
    logger.error({ err }, 'Failed to fetch analytics');
    res.status(500).json({ error: 'Failed to fetch analytics', details: String(err) });
  }
}
