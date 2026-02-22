import React, { createContext, useContext, useState, useCallback } from 'react';
import { getBattlePass } from '@api';

export const BattlePassContext = createContext(null);

export const BattlePassProvider = ({ children }) => {
  const [battlePass, setBattlePass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStars, setShowStars] = useState(false);

  const fetchBattlePass = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getBattlePass();
      setBattlePass(data);
    } catch (err) {
      setError(err.message || 'Failed to load Battle Pass');
    } finally {
      setLoading(false);
    }
  }, []);

  const triggerXPAnimation = useCallback(() => {
    setShowStars(true);
    setTimeout(() => { setShowStars(false); }, 1800);
  }, []);

  return (
    <BattlePassContext.Provider value={{ battlePass, setBattlePass, loading, error, fetchBattlePass, showStars, triggerXPAnimation }}>
      {children}
    </BattlePassContext.Provider>
  );
};

export const useBattlePass = () => {
  const context = useContext(BattlePassContext);
  if (!context) throw new Error('useBattlePass must be used within a BattlePassProvider');
  return context;
};
