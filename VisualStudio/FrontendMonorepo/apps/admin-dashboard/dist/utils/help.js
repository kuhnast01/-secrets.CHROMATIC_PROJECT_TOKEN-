"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpContent = void 0;
exports.getHelp = getHelp;
// help.ts - Inline help and documentation (scaffold)
exports.helpContent = {
    dashboard: 'This is your main admin dashboard. Use the navigation to manage users, shop, events, and more.',
    users: 'View, add, edit, or remove users. Assign roles and reset passwords.',
    shop: 'Manage shop items, prices, and promotions.',
    events: 'Schedule and edit in-game events.',
    auditLog: 'View all admin actions for accountability.',
    analytics: 'See key metrics and trends for your game.',
};
function getHelp(section) {
    return exports.helpContent[section] || 'No help available for this section.';
}
