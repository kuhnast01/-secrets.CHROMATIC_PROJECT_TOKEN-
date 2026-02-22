import prisma from '../prisma';
export async function getAuditLogs() {
    return prisma.auditLog.findMany({
        orderBy: { timestamp: 'desc' },
    });
}
