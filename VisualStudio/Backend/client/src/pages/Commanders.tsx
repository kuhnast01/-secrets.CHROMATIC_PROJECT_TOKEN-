import React, { useEffect, useState } from 'react';
import { getCommanders, recruitCommander, grantCommanderShards, upgradeCommander } from '../api';


export default function Commanders() {
  const [list, setList] = useState<any[]>([]);
  const [mine, setMine] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem('myCommanders') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    getCommanders().then(r => setList(r.commanders || []));
  }, []);

  function saveMine(arr: any[]) { setMine(arr); localStorage.setItem('myCommanders', JSON.stringify(arr)); }

  return (
    <div>
      <h2>Commanders</h2>
      <div style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <h3>Available</h3>
          <ul>
            {list.map(c => (
              <li key={c.id} style={{marginBottom:8}}>
                <strong>{c.name}</strong> <em>({c.rarity})</em>
                <div style={{fontSize:12}}>Power ×{c.powerMultiplier}</div>
                <div style={{marginTop:6,display:'flex',gap:8}}>
                  <button onClick={async () => {
                    const res = await recruitCommander(c.id);
                    if (res?.commander) { saveMine([...mine, res.commander]); }
                  }}>Recruit</button>
                  <button onClick={async () => {
                    const res = await grantCommanderShards(c.id, 5);
                    if (res?.commander) {
                      // if commander already recruited locally, update shard count
                      const idx = mine.findIndex(m=>m.id===res.commander.id);
                      if (idx>=0) { const copy = [...mine]; copy[idx] = res.commander; saveMine(copy); }
                    }
                  }}>Grant +5 shards (dev)</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div style={{flex:1}}>
          <h3>Your Commanders</h3>
          <ul>
            {mine.length === 0 && <div><em>No commanders recruited yet.</em></div>}
            {mine.map((c:any) => (
              <li key={c.id} style={{marginBottom:8}}>
                <strong>{c.name}</strong> <em>({c.rarity})</em>
                <div style={{fontSize:12}}>Level {c.level ?? 1} • Shards {c.shards ?? 0}</div>
                <div style={{marginTop:6}}>
                  <button onClick={async () => {
                    const res = await upgradeCommander(c.id);
                    if (res?.commander) {
                      const copy = [...mine];
                      const idx = copy.findIndex(x=>x.id===res.commander.id);
                      if (idx>=0) { copy[idx] = res.commander; saveMine(copy); }
                    } else if (res?.error) {
                      alert(res.error + (res.required ? ` (required ${res.required})` : ''));
                    }
                  }}>Upgrade</button>
                  <button style={{marginLeft:8}} onClick={async () => {
                    const res = await grantCommanderShards(c.id, 5);
                    if (res?.commander) {
                      const copy = [...mine];
                      const idx = copy.findIndex(x=>x.id===res.commander.id);
                      if (idx>=0) { copy[idx] = res.commander; saveMine(copy); }
                    }
                  }}>+5 shards</button>
                  <button style={{marginLeft:8}} onClick={async () => {
                    // purchase 1 shard via store (costs credits)
                    const res = await fetch((import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000') + '/api/store/purchase', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'shards', commanderId: c.id, amount: 1 }) });
                    const data = await res.json();
                    if (data?.commander) {
                      const copy = [...mine];
                      const idx = copy.findIndex(x=>x.id===data.commander.id);
                      if (idx>=0) { copy[idx] = data.commander; saveMine(copy); }
                      alert('Purchased 1 shard (credits deducted)');
                    } else if (data?.error) alert(data.error || 'purchase failed');
                  }}>Buy shard (100 credits)</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
