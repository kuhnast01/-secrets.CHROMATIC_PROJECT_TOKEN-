/**
 * EnemyTemplate Seeder
 * Usage: pnpm exec tsx src/scripts/seedEnemyTemplates.ts
 *
 * Ensures all ENEMY_TEMPLATES are present in the DB (idempotent).
 */
import { PrismaClient } from '@prisma/client';
import { ENEMY_TEMPLATES } from '../models/EnemyTemplates';

const prisma = new PrismaClient();

async function seedEnemyTemplates() {
  for (const template of ENEMY_TEMPLATES) {
    await prisma.enemyTemplate.upsert({
      where: { id: template.id },
      update: {
        ...template,
        ships: JSON.parse(JSON.stringify(template.ships)),
        anomaly: JSON.parse(JSON.stringify(template.anomaly ?? {})),
        bossAbility: JSON.parse(JSON.stringify(template.bossAbility ?? {})),
      },
      create: {
        ...template,
        ships: JSON.parse(JSON.stringify(template.ships)),
        anomaly: JSON.parse(JSON.stringify(template.anomaly ?? {})),
        bossAbility: JSON.parse(JSON.stringify(template.bossAbility ?? {})),
      },
    });
    console.log(`Seeded: ${template.id}`);
  }
  console.log('Enemy templates seed complete.');
}

seedEnemyTemplates()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
