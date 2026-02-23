import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ajv = new Ajv();

const schema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    faction: { type: 'string' },
    fleet: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          count: { type: 'integer' },
          level: { type: 'integer' }
        },
        required: ['type', 'count', 'level']
      }
    },
    modifiers: { type: 'object' },
    anomaly: { type: 'object' },
    bossAbility: { type: 'object' },
    commander: { type: ['object', 'null'] }
  },
  required: ['id', 'faction', 'fleet']
};

const templatesDir = path.join(__dirname, '../store_items/enemy_templates');
const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const data = JSON.parse(fs.readFileSync(path.join(templatesDir, file), 'utf-8'));
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    console.error(`Schema validation failed for ${file}:`, validate.errors);
    process.exitCode = 1;
  } else {
    console.log(`Schema valid for ${file}`);
  }
});
