import React, { useState } from 'react';
import { getPlayer } from '../api';

export default function Player() {
  const [result, setResult] = useState<any>(null);
  return (
    <div>
      <h2>Player</h2>
      <button onClick={() => getPlayer().then(setResult).catch(e => setResult({ error: e.message }))}>Fetch player</button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
