import React, { useEffect, useState } from 'react';
import { autobattle } from '../api';

export default function Combat() {
  const [result, setResult] = useState<any>(null);
  const [playerPower, setPlayerPower] = useState<number>(() => {
    try { const lf = JSON.parse(localStorage.getItem('lastFleet')||'null'); return (lf?.fleet?.power) ?? 1000; } catch { return 1000; }
  });
  const [enemyPower, setEnemyPower] = useState<number>(800);

  async function runAuto() {
    const res = await autobattle({ playerPower, enemyPower });
    setResult(res);
  }

  async function runFullCombat() {
    const last = JSON.parse(localStorage.getItem('lastFleet') || 'null');
    const fleet = last?.fleet ?? { commander: null, ships: {} };
    const resp = await startCombat(fleet);
    // animate the returned log if present
    if (resp?.log) {
      setResult({ status: 'running', log: [] });
      const entries: any[] = resp.log;
      let i = 0;
      const interval = setInterval(() => {
        i += 1;
        setResult(r => ({ ...(r || {}), log: entries.slice(0, i) }));
        if (i >= entries.length) clearInterval(interval);
      }, 700);
      return;
    }
    setResult(resp);
  }

  return (
    <div>
      <h2>Combat — AutoBattle</h2>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <label>Player power: <input value={playerPower} onChange={e=>setPlayerPower(Number(e.target.value)||0)} /></label>
        <label>Enemy power: <input value={enemyPower} onChange={e=>setEnemyPower(Number(e.target.value)||0)} /></label>
        <button onClick={runAuto}>Run AutoBattle</button>
        <button onClick={runFullCombat} style={{marginLeft:8}}>Run Full Combat (animated)</button>
      </div>

      <div style={{marginTop:12}}>
        {result?.status === 'running' && <div><strong>Animating combat log...</strong></div>}
        <pre style={{marginTop:12}}>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  );
}
