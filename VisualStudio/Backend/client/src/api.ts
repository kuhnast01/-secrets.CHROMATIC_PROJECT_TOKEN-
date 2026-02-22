
// --- VIP System API ---
export async function getVIPStatus() {
  const res = await fetch(`${BASE}/api/vip`);
  return res.json();
}

export async function getVIPDailyRewards() {
  const res = await fetch(`${BASE}/api/vip/daily-rewards`);
  return res.json();
}

export async function claimVIPDaily() {
  const res = await fetch(`${BASE}/api/vip/claim-daily`, { method: 'POST' });
  return res.json();
}

export async function getVIPPerks() {
  const res = await fetch(`${BASE}/api/vip/perks`);
  return res.json();
}

export async function getVIPCosmetics() {
  const res = await fetch(`${BASE}/api/vip/cosmetics`);
  return res.json();
}
// --- Summoning System API ---
export async function getSummonBanners(userId?: string) {
  const url = userId ? `${BASE}/api/summon/banners?userId=${encodeURIComponent(userId)}` : `${BASE}/api/summon/banners`;
  const res = await fetch(url);
  return res.json();
}

export async function summonPull({ userId, bannerId, count }: { userId: string; bannerId: string; count: number }) {
  const res = await fetch(`${BASE}/api/summon/pull`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId, bannerId, count })
  });
  return res.json();
}

export async function getSummonHistory(userId: string) {
  const res = await fetch(`${BASE}/api/summon/history?userId=${encodeURIComponent(userId)}`);
  return res.json();
}
const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export async function getHealth() {
  const res = await fetch(`${BASE}/health`);
  return res.json();
}

export async function getPlayer() {
  const res = await fetch(`${BASE}/api/player/profile`);
  return res.json();
}

export async function getStaticShips() {
  const res = await fetch(`${BASE}/api/static/ships`);
  return res.json();
}

export async function getCommanders() {
  const res = await fetch(`${BASE}/api/commanders`);
  return res.json();
}

export async function recruitCommander(commandId: string) {
  const res = await fetch(`${BASE}/api/commanders/recruit`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ commanderId: commandId }) });
  return res.json();
}

export async function saveFleet(fleet: any) {
  const res = await fetch(`${BASE}/api/fleet/save`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ fleet }) });
  return res.json();
}

export async function buildShip(shipType: string) {
  const res = await fetch(`${BASE}/api/fleet/ships/build`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ shipType }) });
  return res.json();
}

export async function autobattle(payload: { playerPower: number, enemyPower?: number }) {
  const res = await fetch(`${BASE}/api/combat/autobattle`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
  return res.json();
}

export async function startCombat(fleet: any, missionId = 'mission-1') {
  const res = await fetch(`${BASE}/api/combat/start`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ fleet, missionId }) });
  return res.json();
}

// Commanders
export async function upgradeCommander(commandId: string) {
  const res = await fetch(`${BASE}/api/commanders/upgrade`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ commanderId: commandId }) });
  return res.json();
}

export async function grantCommanderShards(commandId: string, amount = 1) {
  const res = await fetch(`${BASE}/api/commanders/grantShards`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ commanderId: commandId, amount }) });
  return res.json();
}

// Tech
export async function getTech() {
  const res = await fetch(`${BASE}/api/tech`);
  return res.json();
}

export async function startTech(techId: string) {
  const res = await fetch(`${BASE}/api/tech/start`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ techId }) });
  return res.json();
}

// Economy
export async function getEconomyResources() {
  const res = await fetch(`${BASE}/api/economy/resources`);
  return res.json();
}

export async function collectEconomy() {
  const res = await fetch(`${BASE}/api/economy/collect`, { method: 'POST' });
  return res.json();
}

export async function getBuildings() {
  const res = await fetch(`${BASE}/api/economy/buildings`);
  return res.json();
}

export async function upgradeBuilding(building: string) {
  const res = await fetch(`${BASE}/api/economy/buildings/upgrade`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ building }) });
  return res.json();
}

// Admin
export async function adminSeed() {
  const res = await fetch(`${BASE}/api/admin/seed`, { method: 'POST' });
  return res.json();
}

export async function adminTriggerTick(token?: string) {
  const res = await fetch(`${BASE}/api/admin/tick/trigger`, { method: 'POST', headers: { 'x-admin-secret': token || '' } });
  return res.json();
}

export async function getTickMetrics(token?: string) {
  const res = await fetch(`${BASE}/api/admin/tick/metrics`, { headers: { 'x-admin-secret': token || '' } });
  return res.json();
}

export async function getAdminEvents(since?: number, token?: string) {
  const q = since ? `?since=${since}` : '';
  const res = await fetch(`${BASE}/api/admin/analytics${q}`, { headers: { 'x-admin-secret': token || '' } });
  return res.json();
}

export async function clearAdminEvents(token?: string) {
  const res = await fetch(`${BASE}/api/admin/analytics/clear`, { method: 'POST', headers: { 'x-admin-secret': token || '' } });
  return res.json();
}

