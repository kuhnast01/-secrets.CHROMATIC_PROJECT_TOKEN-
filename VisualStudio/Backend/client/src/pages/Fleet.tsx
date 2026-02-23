import React, { useEffect, useState } from 'react';
import { getStaticShips, getCommanders, buildShip, saveFleet } from '../api';

export default function Fleet() {
  const [shipsCatalog, setShipsCatalog] = useState<any[]>([]);
  const [commanders, setCommanders] = useState<any[]>([]);
  const [selectedCommander, setSelectedCommander] = useState<any | null>(null);
  const [composition, setComposition] = useState<Record<string, number>>({});
  const [shipLevels, setShipLevels] = useState<Record<string, number>>({});
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [builds, setBuilds] = useState<any[]>([]);
  const [saved, setSaved] = useState<any>(null);

  useEffect(() => {
    getStaticShips().then(r => setShipsCatalog(r.ships || []));
    getCommanders().then(r => setCommanders(r.commanders || []));
    // fetch player profile for tech modifiers
    (async () => {
      const p = await (await fetch((import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000') + '/api/player/profile')).json();
      setPlayerProfile(p);
    })();
  }, []);

  function addShip(type: string) {
    setComposition(s => ({ ...s, [type]: (s[type] || 0) + 1 }));
    setShipLevels(l => ({ ...l, [type]: l[type] ?? 1 }));
  }

  function removeShip(type: string) {
    setComposition(s => {
      const copy = { ...s };
      if (!copy[type]) return copy;
      copy[type] = Math.max(0, copy[type] - 1);
      if (copy[type] === 0) delete copy[type];
      return copy;
    });
  }

  function setLevel(type: string, level: number) {
    setShipLevels(l => ({ ...l, [type]: Math.max(1, level) }));
  }

  function calcPower() {
    const ships = Object.entries(composition);
    const shipsTotal = ships.reduce((acc, [type, qty]) => {
      const info = shipsCatalog.find(s => s.type === type);
      if (!info) return acc;
      const level = shipLevels[type] ?? 1;
      // simple level scaling: +8% atk per level
      const levelScale = 1 + (level - 1) * 0.08;
      acc += info.atk * (qty as number) * levelScale;
      return acc;
    }, 0 as number);
    const commanderMul = selectedCommander?.powerMultiplier ?? 1;
    const techMul = 1 + ((playerProfile?.tech?.shipAtkPercent) ?? 0);
    return Math.round(shipsTotal * commanderMul * techMul);
  }

  async function onBuild(shipType: string) {
    const res = await buildShip(shipType);
    setBuilds(b => [...b, res]);
  }

  async function onSave() {
    const fleetObj = { commander: selectedCommander, ships: composition, power: calcPower() };
    const res = await saveFleet(fleetObj);
    if (res?.fleetId) {
      setSaved(res);
      localStorage.setItem('lastFleet', JSON.stringify(res));
    }
  }

  const power = calcPower();

  return (
    <div>
      <h2>Fleet Builder</h2>
      <div style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <h3>Commanders</h3>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {commanders.map(c => (
              <button key={c.id} onClick={() => setSelectedCommander(c)} style={{background: selectedCommander?.id===c.id? '#6ee7b7':'#fff8'}}>{c.name} <small>({c.rarity})</small></button>
            ))}
          </div>

          <h3 style={{marginTop:16}}>Ship Catalog</h3>
          <ul>
            {shipsCatalog.map(s => (
              <li key={s.type} style={{marginBottom:8}}>
                <strong>{s.type}</strong> — ATK {s.atk} • DEF {s.def} • HP {s.hp}
                <div style={{marginTop:6}}>
                  <label style={{marginRight:8}}>Level <input style={{width:56}} type="number" min={1} value={shipLevels[s.type] ?? 1} onChange={e => setLevel(s.type, Number(e.target.value)||1)} /></label>
                  <button onClick={() => addShip(s.type)}>Add</button>
                  <button onClick={() => removeShip(s.type)} style={{marginLeft:8}}>Remove</button>
                  <button onClick={() => onBuild(s.type)} style={{marginLeft:8}}>Build</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={{flex:1}}>
          <h3>Composition</h3>
          <pre>{JSON.stringify(composition, null, 2)}</pre>
          <div>Selected Commander: {selectedCommander ? `${selectedCommander.name} (${selectedCommander.rarity})` : '—'}</div>
          <div style={{marginTop:8}}>Fleet Power: <strong>{power}</strong></div>

          <div style={{marginTop:12}}>
            <button onClick={onSave} disabled={!selectedCommander || Object.keys(composition).length===0}>Save Fleet</button>
            {saved && <div style={{marginTop:8}}>Saved fleetId: <code>{saved.fleetId}</code></div>}
          </div>

          <h3 style={{marginTop:16}}>Build Queue</h3>
          <ul>
            {builds.map((b, i) => <li key={i}>{b.shipType} — {b.status} (id: {b.shipId})</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
