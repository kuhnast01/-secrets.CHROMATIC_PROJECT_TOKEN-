import React, { useEffect, useState } from 'react';
import { getEconomyResources, collectEconomy, getBuildings, upgradeBuilding, getPlayer } from '../api';

export default function Base() {
  const [resources, setResources] = useState<any>(null);
  const [buildings, setBuildings] = useState<any>({});
  const [defs, setDefs] = useState<any>({});
  const [player, setPlayer] = useState<any>(null);
  const [now, setNow] = useState<number>(Date.now());

  async function refresh() {
    const r = await getEconomyResources();
    setResources(r);
    const b = await getBuildings();
    setBuildings(b.buildings || {});
    setDefs(b.defs || {});
    const p = await getPlayer();
    setPlayer(p);
  }

  useEffect(() => { refresh(); const iv = setInterval(() => refresh(), 3000); return () => clearInterval(iv); }, []);
  // clock tick for countdowns
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  async function onCollect() {
    await collectEconomy();
    await refresh();
  }

  async function onUpgrade(name: string) {
    // optimistic UI: predict completion time so UI shows countdown instantly
    const b = buildings[name] || { level: 1 };
    const def = defs[name] || { upgradeTimeSec: 10 };
    const durationMs = (def.upgradeTimeSec || 10) * ((b.level || 1) + 1) * 1000;
    const predicted = Date.now() + durationMs;
    setBuildings((prev: any) => ({ ...prev, [name]: { ...(prev[name] || {}), upgradeCompleteAt: predicted } }));

    try {
      await upgradeBuilding(name);
    } catch (err) {
      // revert optimistic state on error
      setBuildings((prev: any) => ({ ...prev, [name]: { ...(prev[name] || {}), upgradeCompleteAt: undefined } }));
    }

    await refresh();
  }

  return (
    <div>
      <h2>Base & Economy</h2>
      <section style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <h3>Resources</h3>
          {!resources ? <div>loading...</div> : (
            <div>
              <div>Energy: {Math.floor(resources.resources.energy)} (+{Math.floor(resources.produced.energy || 0)})</div>
              <div>Alloy: {Math.floor(resources.resources.alloy)} (+{Math.floor(resources.produced.alloy || 0)})</div>
              <div>Credits: {Math.floor(resources.resources.credits)} (+{Math.floor(resources.produced.credits || 0)})</div>
              <div>Data: {Math.floor(resources.resources.data)} (+{Math.floor(resources.produced.data || 0)})</div>
              <button onClick={onCollect}>Collect</button>
            </div>
          )}
        </div>
        <div style={{flex:1}}>
          <h3>Buildings</h3>
          {Object.keys(defs).length === 0 ? <div>loading...</div> : (
            <div>
              {Object.entries(defs).map(([name, def]: any) => {
                const b = buildings[name] || { level: 1 };
                const upgradingAt = b.upgradeCompleteAt;
                const remainingSec = upgradingAt ? Math.max(0, Math.ceil((upgradingAt - now) / 1000)) : 0;
                return (
                  <div key={name} style={{border:'1px solid #444', padding:8, marginBottom:8}}>
                    <strong>{name}</strong> — level {b.level || 1}
                    <div>Production/sec: {def.baseProductionPerSec || 0} × level</div>
                    <div>Storage cap per level: {def.storageCap || 0}</div>
                    <div>Upgrade cost (credits × level+1): {(def.upgradeCost?.credits || 0) * ((b.level || 1) + 1)}</div>
                    <div>Upgrade time (sec × level+1): {def.upgradeTimeSec * (((b.level || 1) + 1))}</div>
                    {upgradingAt ? (
                      <div>Upgrading — completes in {remainingSec}s (at {new Date(upgradingAt).toLocaleTimeString()})</div>
                    ) : (
                      <button onClick={() => onUpgrade(name)}>Upgrade</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      <section>
        <h3>Player</h3>
        <pre style={{whiteSpace:'pre-wrap'}}>{player ? JSON.stringify(player, null, 2) : 'loading...'}</pre>
      </section>
    </div>
  );
}
