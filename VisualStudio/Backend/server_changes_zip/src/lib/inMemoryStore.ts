export const inMemory = {
  players: new Map<string, any>(),
  fleets: new Map<string, any>(),
};

export function savePlayer(id: string, payload: any) {
  inMemory.players.set(id, payload);
}

export function getPlayer(id: string) {
  return inMemory.players.get(id) || null;
}
