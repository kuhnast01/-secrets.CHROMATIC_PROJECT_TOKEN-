import { getPlayer } from './inMemoryStore';

export const BUILDING_DEFS: Record<string, any> = {
  'Energy Reactor': { baseProductionPerSec: 1.0, storageCap: 5000, upgradeCost: { credits: 200 }, upgradeTimeSec: 10 },
  'Alloy Foundry': { baseProductionPerSec: 0.5, storageCap: 2000, upgradeCost: { credits: 400 }, upgradeTimeSec: 20 },
  'Credit Vault': { baseProductionPerSec: 2.0, storageCap: 20000, upgradeCost: { credits: 600 }, upgradeTimeSec: 30 },
  'Data Nexus': { baseProductionPerSec: 0.1, storageCap: 1000, upgradeCost: { credits: 800 }, upgradeTimeSec: 40 },
  'Shipyard': { baseProductionPerSec: 0, storageCap: 0, upgradeCost: { credits: 1200 }, upgradeTimeSec: 60 },
  'Tech Lab': { baseProductionPerSec: 0, storageCap: 0, upgradeCost: { credits: 1500 }, upgradeTimeSec: 90 },
  'Command Center': { baseProductionPerSec: 0, storageCap: 0, upgradeCost: { credits: 2000 }, upgradeTimeSec: 120 }
};

export function calcProduction(player: any, now = Date.now()) {
  player.resources = player.resources || { energy: 0, alloy: 0, credits: 0, data: 0 };
  player.buildings = player.buildings || {};
  const last = player.lastCollectedAt || now;
  const elapsedSec = Math.max(0, (now - last) / 1000);

  const produced: any = { energy: 0, alloy: 0, credits: 0, data: 0 };

  for (const [name, def] of Object.entries(BUILDING_DEFS)) {
    const b = player.buildings[name] || { level: 1 };
    const level = b.level || 1;
    const rate = (def.baseProductionPerSec || 0) * level;
    if (name === 'Energy Reactor') produced.energy += rate * elapsedSec;
    if (name === 'Alloy Foundry') produced.alloy += rate * elapsedSec;
    if (name === 'Credit Vault') produced.credits += rate * elapsedSec;
    if (name === 'Data Nexus') produced.data += rate * elapsedSec;
  }

  // storage caps per building (per-level)
  const caps: any = {};
  for (const [name, def] of Object.entries(BUILDING_DEFS)) {
    const b = player.buildings[name] || { level: 1 };
    const level = b.level || 1;
    const cap = (def.storageCap || 0) * level;
    caps[name] = cap;
  }

  return { produced, caps };
}

// apply produced resources to player and update lastCollectedAt (clamped to caps)
export function accrueResourcesToPlayer(player: any, now = Date.now()) {
  const { produced } = calcProduction(player, now);
  player.resources = player.resources || { energy: 0, alloy: 0, credits: 0, data: 0 };

  // caps derived from BUILDING_DEFS levels (simplified mapping)
  const energyCap = ((player.buildings?.['Energy Reactor']?.level) || 1) * (BUILDING_DEFS['Energy Reactor'].storageCap || 0);
  const alloyCap = ((player.buildings?.['Alloy Foundry']?.level) || 1) * (BUILDING_DEFS['Alloy Foundry'].storageCap || 0);
  const creditsCap = ((player.buildings?.['Credit Vault']?.level) || 1) * (BUILDING_DEFS['Credit Vault'].storageCap || 0);
  const dataCap = ((player.buildings?.['Data Nexus']?.level) || 1) * (BUILDING_DEFS['Data Nexus'].storageCap || 0);

  player.resources.energy = Math.min((player.resources.energy || 0) + produced.energy, Math.max(energyCap, 0));
  player.resources.alloy = Math.min((player.resources.alloy || 0) + produced.alloy, Math.max(alloyCap, 0));
  player.resources.credits = Math.min((player.resources.credits || 0) + produced.credits, Math.max(creditsCap, 0));
  player.resources.data = Math.min((player.resources.data || 0) + produced.data, Math.max(dataCap, 0));

  player.lastCollectedAt = now;
  return { produced };
}

export function applyCompletedBuildingUpgrades(player: any, now = Date.now()) {
  player.buildings = player.buildings || {};
  const applied: string[] = [];
  for (const [name, b] of Object.entries(player.buildings) as [string, any][]) {
    if (b.upgradeCompleteAt && b.upgradeCompleteAt <= now) {
      b.level = (b.level || 1) + 1;
      delete b.upgradeCompleteAt;
      applied.push(name);
    }
  }
  return applied;
}

export function applyCompletedResearch(player: any, now = Date.now()) {
  player.researchQueue = player.researchQueue || [];
  const completed: any[] = [];
  const remaining: any[] = [];
  for (const q of player.researchQueue) {
    if ((q.endAt || 0) <= now) {
      player.tech = player.tech || {};
      Object.entries(q.effect || {}).forEach(([k, v]) => { player.tech[k] = (player.tech[k] || 0) + (v as number); });
      completed.push(q);
    } else {
      remaining.push(q);
    }
  }
  player.researchQueue = remaining;
  return completed.map(c => c.id || c.techId || null).filter(Boolean);
}
