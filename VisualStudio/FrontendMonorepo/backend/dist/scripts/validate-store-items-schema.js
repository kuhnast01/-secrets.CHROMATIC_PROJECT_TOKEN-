"use strict";
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
// Example schema for store items (customize as needed)
const storeItemSchema = {
    type: 'object',
    required: ['id', 'type', 'contents', 'visibility'],
    properties: {
        id: { type: 'string' },
        type: { type: 'string', enum: ['bundle', 'resource_pack', 'speedup', 'cosmetic', 'dynamic_offer'] },
        priceSoft: { type: 'number' },
        pricePremium: { type: 'number' },
        contents: { type: 'object' },
        visibility: { type: 'object' },
    },
    additionalProperties: true,
};
const storeItemsDir = path.join(__dirname, '../store_items');
const files = fs.readdirSync(storeItemsDir).filter(f => f.endsWith('.json'));
let hasError = false;
for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(storeItemsDir, file), 'utf-8'));
    const valid = ajv.validate(storeItemSchema, data);
    if (!valid) {
        hasError = true;
        console.error(`Schema error in ${file}:`, ajv.errors);
    }
}
if (hasError) {
    process.exit(1);
}
else {
    console.log('All store items passed schema validation.');
}
