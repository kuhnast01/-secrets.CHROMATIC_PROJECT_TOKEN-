import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import routes from './routes';
import { router as missionsRoutes } from './routes/missions';
import { router as liveopsRoutes } from './routes/liveops';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use('/api', missionsRoutes);
app.use('/api', liveopsRoutes);
app.use('/', liveopsRoutes);

export default app;
