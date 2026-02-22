import React, { useEffect, useState } from 'react';

export default function Store() {
  const [player, setPlayer] = useState<any>(null);
  const [receipt, setReceipt] = useState('valid-test-001');

  useEffect(() => { (async () => { const p = await (await fetch((import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000') + '/api/player/profile')).json(); setPlayer(p); })(); }, []);

  async function buyPremium(amount: number) {
    const res = await fetch((import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000') + '/api/store/purchase', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'premiumPack', amount, receipt }) });
    const data = await res.json();
    if (data?.player) {
      setPlayer(data.player);
      // fire a client-side analytics ping (best-effort)
      try { await fetch((import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000') + '/api/admin-analytics', { method: 'GET' }); } catch {}
    } else alert(data.error || 'purchase failed');
  }

  return (
    <div>
      <h2>Store (MVP)</h2>
      <div style={{display:'flex',gap:12}}>
        <div style={{flex:1, padding:12, background:'#071023', borderRadius:8}}>
          <strong>Premium Packs</strong>
          <div style={{marginTop:8}}>Receipt (dev): <input value={receipt} onChange={e=>setReceipt(e.target.value)} style={{width:360}} /></div>
          <div style={{marginTop:8}}>
            <button onClick={() => buyPremium(50)}>Buy 50 gems (simulate)</button>
            <button style={{marginLeft:8}} onClick={() => buyPremium(200)}>Buy 200 gems (simulate)</button>
          </div>
        </div>
        <div style={{flex:1, padding:12, background:'#071023', borderRadius:8}}>
          <strong>Your Balances</strong>
          <div style={{marginTop:8}}>Credits: <strong>{player?.resources?.credits ?? '-'}</strong></div>
          <div style={{marginTop:8}}>Gems: <strong>{player?.resources?.gems ?? 0}</strong></div>
        </div>
      </div>
    </div>
  );
}
