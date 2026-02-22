
import prisma from '../prisma';
import { PrismaClient, type EventUncheckedCreateInput } from '@prisma/client';

export async function getAllEvents({ skip = 0, take = 20 } = {}) {
  return prisma.event.findMany({
    skip,
    take,
    orderBy: { id: 'desc' },
  });
}


export async function createEvent(event: EventUncheckedCreateInput) {
  const { name, config, created_by } = event;
  return prisma.event.create({
    data: {
      name,
      config,
      created_by,
    },
  });
}
