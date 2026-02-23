import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const templatesDir = path.join(path.dirname(new URL(import.meta.url).pathname), '../store_items/enemy_templates');
async function autoSync() {
    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf-8'));
        await prisma.enemyTemplate.upsert({
            where: { id: data.id },
            update: data,
            create: data
        });
        console.log(`Auto-synced ${data.id}`);
    }
    await prisma.$disconnect();
}
setInterval(autoSync, 60000); // Sync every 60 seconds
