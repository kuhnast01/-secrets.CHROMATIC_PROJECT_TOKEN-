import React, { useEffect, useState } from 'react';
import { getTech, startTech } from '../api';

export default function Tech() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    getTech().then(r => setNodes(r.tech || []));
    (async () => { const p = await (await fetch((import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000') + '/api/player/profile')).json(); setPlayer(p); })();
    const iv = setInterval(async () => { const p = await (await fetch((import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000') + '/api/player/profile')).json(); setPlayer(p); }, 1000);
    return () => clearInterval(iv);
  }, []);

  async function onResearch(id: string) {
    const res = await startTech(id);
    if (res?.queued) {
      setStatus('queued');
      // optimistic UI: update local player.researchQueue
      setPlayer((prev:any) => ({ ...(prev||{}), researchQueue: [...(prev?.researchQueue||[]), { techId: id, endAt: res.endAt }] }));
    } else if (res?.player) {
      setStatus('research-applied');
      setPlayer(res.player);
      setTimeout(() => window.location.reload(), 600);
    } else if (res?.error) setStatus(res.error);
  }

  return (
    <div>
      <h2>Tech Tree (MVP)</h2>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {nodes.map(n => {
          const queued = (player?.researchQueue || []).find((q:any) => q.techId === n.id);
          const owned = !!player?.tech?.[n.id];
          const unmet = (n.prereqs || []).filter((p:any) => !player?.tech?.[p]);
          return (
            <div key={n.id} style={{padding:12,background:'#071023',borderRadius:8,opacity: owned ? 0.6 : 1}}>
              <strong>{n.name}</strong>
              <div style={{fontSize:12,marginTop:6}}>{n.description}</div>
              <div style={{marginTop:8}}>Cost (Data): <strong>{n.costData}</strong></div>
              {unmet.length>0 && <div style={{color:'#ffb86b',marginTop:6}}>Requires: {unmet.join(', ')}</div>}
              {owned ? <div style={{marginTop:6}}>Already researched</div> : queued ? (
                <div style={{marginTop:8}}>Researching — completes at {new Date(queued.endAt).toLocaleTimeString()}</div>
              ) : (
                <button style={{marginTop:8}} onClick={() => onResearch(n.id)} disabled={unmet.length>0}>Research</button>
              )}
            </div>
          );
        })}
      </div>
      {status && <div style={{marginTop:12}}><em>{status}</em></div>}
    </div>
  );
}
