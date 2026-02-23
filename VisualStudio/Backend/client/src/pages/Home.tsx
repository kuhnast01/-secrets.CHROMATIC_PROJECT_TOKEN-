import React, { useEffect, useState } from 'react';
import { getHealth } from '../api';

export default function Home() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    getHealth().then(setStatus).catch(() => setStatus({ error: 'unreachable' }));
  }, []);

  return (
    <div>
      <h2>Health</h2>
      <pre>{JSON.stringify(status, null, 2)}</pre>
      <p>This demo client shows example API calls for the backend.</p>
    </div>
  );
}
