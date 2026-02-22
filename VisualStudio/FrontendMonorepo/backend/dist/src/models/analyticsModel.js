import prisma from '../prisma';
export async function getAnalytics(args = {}) {
    return prisma.analytics.findMany(args);
}
