import { MongoClient } from 'mongodb';

export const inMemory = {
  players: new Map<string, any>(),
  fleets: new Map<string, any>(),
};

let mongoClient: MongoClient | null = null;
async function getMongoClient() {
  if (mongoClient) return mongoClient;
  const url = process.env.MONGO_URL;
  if (!url) return null;
  mongoClient = new MongoClient(url);
  await mongoClient.connect();
  return mongoClient;
}

export async function savePlayer(id: string, payload: any) {
  const client = await getMongoClient();
  if (client) {
    const col = client.db().collection('players');
    await col.updateOne({ id }, { $set: { ...payload, id } }, { upsert: true });
    return;
  }
  inMemory.players.set(id, payload);
}

export async function getPlayer(id: string) {
  const client = await getMongoClient();
  if (client) {
    const col = client.db().collection('players');
    const doc = await col.findOne({ id });
    return doc || null;
  }
  return inMemory.players.get(id) || null;
}

export async function getAllPlayers() {
  const client = await getMongoClient();
  if (client) {
    const col = client.db().collection('players');
    const docs = await col.find({}).toArray();
    return docs || [];
  }
  return Array.from(inMemory.players.values());
}

export async function saveFleet(id: string, payload: any) {
  const client = await getMongoClient();
  if (client) {
    const col = client.db().collection('fleets');
    await col.updateOne({ id }, { $set: { ...payload, id } }, { upsert: true });
    return;
  }
  inMemory.fleets.set(id, payload);
}

export async function getFleet(id: string) {
  const client = await getMongoClient();
  if (client) {
    const col = client.db().collection('fleets');
    const doc = await col.findOne({ id });
    return doc || null;
  }
  return inMemory.fleets.get(id) || null;
}
