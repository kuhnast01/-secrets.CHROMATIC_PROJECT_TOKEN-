// Battle API client for frontend integration
export interface Fleet {
  commander: any;
  ships: any[];
  totalPower: number;
}

export interface BattleResult {
  result: string;
  log: string[];
}

export async function simulateBattle(attackerFleet: Fleet, defenderFleet: Fleet, maxRounds?: number): Promise<BattleResult> {
  const response = await fetch('/api/battle/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ attackerFleet, defenderFleet, maxRounds }),
  });
  if (!response.ok) {
    throw new Error('Battle simulation failed');
  }
  return response.json();
}
