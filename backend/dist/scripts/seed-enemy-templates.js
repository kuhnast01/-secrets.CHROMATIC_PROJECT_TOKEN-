// Seed enemy templates from static data into DB
import { PrismaClient } from '@prisma/client';
import { ENEMY_TEMPLATES } from '../src/models/EnemyTemplates';
const prisma = new PrismaClient();
async function seedEnemyTemplates() {
    for (const template of ENEMY_TEMPLATES) {
        await prisma.enemyTemplate.upsert({
            where: { id: template.id },
            update: template,
            create: template,
        });
    }
    console.log('Enemy templates seeded successfully.');
}
seedEnemyTemplates()
    .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
