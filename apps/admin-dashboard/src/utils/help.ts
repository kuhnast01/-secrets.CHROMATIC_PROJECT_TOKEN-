// help.ts - Inline help and documentation (scaffold)
export const helpContent: Record<string, string> = {
  dashboard: 'This is your main admin dashboard. Use the navigation to manage users, shop, events, and more.',
  users: 'View, add, edit, or remove users. Assign roles and reset passwords.',
  shop: 'Manage shop items, prices, and promotions.',
  events: 'Schedule and edit in-game events.',
  auditLog: 'View all admin actions for accountability.',
  analytics: 'See key metrics and trends for your game.',
};

export function getHelp(section: string): string {
  return helpContent[section] || 'No help available for this section.';
}
