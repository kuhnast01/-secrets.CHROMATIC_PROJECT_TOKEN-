import React, { createContext, useContext, useState } from 'react';
import { Player } from '@models';

const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  const logout = () => { setPlayer(null); };
  return (
    <PlayerContext.Provider value={{ player, setPlayer, logout }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
};
