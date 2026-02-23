import prisma from '../src/prisma';

async function main() {
  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin', // In production, hash this!
      role: 'admin',
    },
  });
  await prisma.analytics.create({
    data: {
      metric: 'test_metric',
      value: 123.45,
    },
  });
  console.log('Seed data created.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
