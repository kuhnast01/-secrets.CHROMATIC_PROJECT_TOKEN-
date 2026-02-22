import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import './App.css';
import { simulateBattle } from './battleApi';
import type { Fleet, BattleResult } from './battleApi';


function App() {
  console.log('React app loaded: JS is running');
  // Failsafe render test removed

  // const [count, setCount] = useState(0)
  const [backendStatus, setBackendStatus] = useState<string | null>(null)
  const [battleLog, setBattleLog] = useState<string[] | null>(null);
  const [battleError, setBattleError] = useState<string | null>(null);


  // TODO: Replace with real user input for fleets, or fetch from backend/user profile
  const [attackerFleet] = useState<Fleet | null>(null);
  const [defenderFleet] = useState<Fleet | null>(null);


  async function handleSimulateBattle() {
    setBattleError(null);
    setBattleLog(null);
    if (!attackerFleet || !defenderFleet) {
      setBattleError('Please provide both attacker and defender fleets.');
      return;
    }
    try {
      const result: BattleResult = await simulateBattle(attackerFleet, defenderFleet, 5);
      setBattleLog(result.log);
    } catch (err: any) {
      setBattleError(err.message || 'Unknown error');
    }
  }

  useEffect(() => {
    fetch('http://localhost:4000/system-health')
      .then((res) => res.ok ? res.text() : 'Backend unavailable')
      .then((text) => setBackendStatus(text))
      .catch(() => setBackendStatus('Backend unavailable'))
  }, [])

  return (
    <>
      <div className="minimal-render-test">
        React Minimal Render Test<br />
        If you see this, React is working.<br />
        If not, check your dev server and browser console for errors.
      </div>
      <div className="backend-status">
        <strong>Backend status:</strong> {backendStatus ?? 'Loading...'}
      </div>
      <div className="card">
        <button onClick={handleSimulateBattle}>
          Simulate Battle
        </button>
        <div className="fleet-selection-info">
          {/* TODO: Add fleet input forms or selectors here for attacker and defender fleets */}
          <em>Fleet selection UI coming soon. Please connect to real user/team data.</em>
        </div>
        {battleError && <div className="battle-error">Error: {battleError}</div>}
        {battleLog && (
          <div className="battle-log-container">
            <strong>Battle Log:</strong>
            <pre className="battle-log">{battleLog.join('\n')}</pre>
          </div>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
