
import prisma from '../prisma';

export async function getAllUsers({ skip = 0, take = 20 } = {}) {
  return prisma.user.findMany({
    skip,
    take,
    orderBy: { id: 'desc' },
  });
}

export async function getAllUserSummaries() {
  return prisma.user.findMany({
    select: { id: true, username: true, role: true },
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}
