
import prisma from '../prisma';
import { PrismaClient } from '@prisma/client';

export async function getAnalytics(args: { where?: Prisma.AnalyticsWhereInput } = {}) {
  return prisma.analytics.findMany(args);
}
