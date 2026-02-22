import { MongoClient } from 'mongodb';

type EventRecord = { id: string; type: string; ts: number; payload?: any };

const events: EventRecord[] = [];
let mongoClient: MongoClient | null = null;

async function getClient() {
  if (mongoClient) return mongoClient;
  const url = process.env.MONGO_URL;
  if (!url) return null;
  mongoClient = new MongoClient(url);
  await mongoClient.connect();
  return mongoClient;
}

export async function logEvent(type: string, payload?: any) {
  const rec: EventRecord = { id: `${Date.now()}-${Math.random().toString(36).slice(2,9)}`, type, ts: Date.now(), payload };
  events.push(rec);
  // also print to console for server logs
  // eslint-disable-next-line no-console
  console.log('[analytics]', rec.type, JSON.stringify(rec.payload || {}));

  const client = await getClient();
  if (client) {
    try {
      const col = client.db().collection('analytics');
      await col.insertOne(rec);
    } catch (err) {
      // ignore persistence errors
    }
  }
  return rec;
}

export async function getEvents(sinceTs?: number) {
  const client = await getClient();
  if (client) {
    const col = client.db().collection('analytics');
    const q: any = {};
    if (sinceTs) q.ts = { $gte: sinceTs };
    const docs = await col.find(q).sort({ ts: 1 }).toArray();
    return (docs as any[]) as EventRecord[];
  }
  if (!sinceTs) return events.slice();
  return events.filter(e => e.ts >= sinceTs);
}

export async function clearEvents() {
  events.length = 0;
  const client = await getClient();
  if (client) {
    try {
      const col = client.db().collection('analytics');
      await col.deleteMany({});
    } catch (err) {
      // ignore
    }
  }
}
