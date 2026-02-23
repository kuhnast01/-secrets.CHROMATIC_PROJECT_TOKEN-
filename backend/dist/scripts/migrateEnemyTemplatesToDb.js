import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const templatesDir = path.join(path.dirname(new URL(import.meta.url).pathname), '../store_items/enemy_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
async function migrate() {
    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf-8'));
        await prisma.enemyTemplate.upsert({
            where: { id: data.id },
            update: data,
            create: data
        });
        console.log(`Migrated ${data.id}`);
    }
    await prisma.$disconnect();
}
migrate().catch(e => {
    console.error(e);
    process.exit(1);
});
