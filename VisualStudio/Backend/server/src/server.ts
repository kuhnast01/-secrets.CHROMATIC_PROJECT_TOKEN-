import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { startTick } from './lib/tickWorker';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Galaxy Ascendant API listening on port ${PORT}`);
  // start background economy tick
  startTick();
});
