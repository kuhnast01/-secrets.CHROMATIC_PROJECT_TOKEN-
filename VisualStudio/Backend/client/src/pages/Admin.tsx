import React, { useEffect, useState } from 'react';
import { adminTriggerTick, getTickMetrics, getAdminEvents, clearAdminEvents } from '../api';

export default function Admin() {
  const [metrics, setMetrics] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>(localStorage.getItem('adminToken') || '');

  async function refresh() {
    try {
      const m = await getTickMetrics(token);
      if (m.error) { setMetrics(null); setEvents([]); return; }
      setMetrics(m.metrics);
      const ev = await getAdminEvents(undefined, token);
      setEvents(ev.events || []);
    } catch (err) {
      // noop
    }
  }

  useEffect(() => { if (token) localStorage.setItem('adminToken', token); }, [token]);
  useEffect(() => { refresh(); const iv = setInterval(() => refresh(), 3000); return () => clearInterval(iv); }, [token]);

  // build a simple sparkline from recent tick.run events
  const tickRuns = (events || []).filter(e => e.type === 'tick.run').map(e => e.payload?.ticksRun || 0).slice(-20);
  const sparkMax = Math.max(1, ...tickRuns);

  async function onTrigger() {
    setLoading(true);
    try {
      await adminTriggerTick(token);
      await refresh();
    } catch (err) {
      // noop
    }
    setLoading(false);
  }

  async function onClear() {
    await clearAdminEvents(token);
    await refresh();
  }

  if (!token) return (
    <div>
      <h2>Admin Console</h2>
      <div style={{maxWidth:400}}>
        <p>Enter admin secret token:</p>
        <input type="password" placeholder="Admin secret" value={token} onChange={(e) => setToken(e.target.value)} style={{width:'100%',padding:8,marginBottom:8}} />
        <button onClick={() => refresh()}>Authenticate</button>
      </div>
    </div>
  );

  return (
    <div>
      <h2>Admin Console</h2>
      <section style={{display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <h3>Tick Metrics</h3>
          {!metrics ? <div>loading...</div> : (
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{flex:1}}>
                  <div>Ticks run: {metrics.ticksRun}</div>
                  <div>Players processed: {metrics.playersProcessed}</div>
                  <div>Errors: {metrics.errors}</div>
                  <div>Last run: {metrics.lastRunTs ? new Date(metrics.lastRunTs).toLocaleString() : 'never'}</div>
                </div>
                <div style={{width:120,height:40,border:'1px solid #eee',display:'flex',alignItems:'flex-end',padding:4}}>
                  {tickRuns.length === 0 ? <div style={{fontSize:12,color:'#888'}}>no data</div> : (
                    tickRuns.map((v,i) => <div key={i} style={{flex:1,height:`${(v/sparkMax)*100}%`,background:'#3b82f6',marginLeft:4}} />)
                  )}
                </div>
              </div>
              <div style={{marginTop:8}}><button onClick={onTrigger} disabled={loading}>{loading ? 'Triggering...' : 'Trigger Tick'}</button></div>
            </div>
          )}
        </div>
        <div style={{flex:2}}>
          <h3>Analytics Events</h3>
          <div style={{marginBottom:8}}>
            <button onClick={onClear}>Clear Events</button>
          </div>
          <div style={{maxHeight:400,overflow:'auto',border:'1px solid #ddd', padding:8}}>
            {events.length === 0 ? <div>No events</div> : (
              events.slice().reverse().map((e:any) => (
                <div key={e.id} style={{borderBottom:'1px solid #eee',padding:6}}>
                  <div><strong>{e.type}</strong> — {new Date(e.ts).toLocaleTimeString()}</div>
                  <div style={{fontFamily:'monospace',fontSize:12}}>{JSON.stringify(e.payload || {}, null, 2)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
