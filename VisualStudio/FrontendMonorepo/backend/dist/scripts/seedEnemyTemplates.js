"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * EnemyTemplate Seeder
 * Usage: pnpm exec tsx src/scripts/seedEnemyTemplates.ts
 *
 * Ensures all ENEMY_TEMPLATES are present in the DB (idempotent).
 */
const client_1 = require("@prisma/client");
const EnemyTemplates_1 = require("../models/EnemyTemplates");
const prisma = new client_1.PrismaClient();
async function seedEnemyTemplates() {
    for (const template of EnemyTemplates_1.ENEMY_TEMPLATES) {
        await prisma.enemyTemplate.upsert({
            where: { id: template.id },
            update: template,
            create: template,
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
