import { getEnemyTemplateById } from '../models/EnemyTemplates';
import { generateMissionEnemies } from '../mission/missionGenerator';
import { applyCombatModifiers } from '../combat/combatEngine';

export function integrateEnemyTemplate(templateId: string, missionId: string, options?: {
  difficulty?: 'easy' | 'normal' | 'hard';
  customModifiers?: Record<string, number>;
  bossOverride?: boolean;
}) {
  const template = getEnemyTemplateById(templateId);
  if (!template) throw new Error('Template not found');
  // Generate mission enemies
  let missionEnemies = generateMissionEnemies(template, missionId);
  // Apply difficulty scaling
  if (options?.difficulty) {
    missionEnemies = missionEnemies.map(enemy => ({
      ...enemy,
      level: enemy.level + (options.difficulty === 'hard' ? 2 : options.difficulty === 'easy' ? -1 : 0)
    }));
  }
  // Apply custom modifiers
  const modifiers = {
    ...template.modifiers,
    ...(options?.customModifiers || {})
  };
  // Boss override logic
  if (options?.bossOverride && template.bossAbility) {
    missionEnemies = missionEnemies.map(enemy => ({
      ...enemy,
      bossAbility: template.bossAbility
    }));
  }
  // Apply combat modifiers
  const combatReadyEnemies = applyCombatModifiers(missionEnemies, modifiers);
  return combatReadyEnemies;
}
