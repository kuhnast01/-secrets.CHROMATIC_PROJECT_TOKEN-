import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import routes from './routes';

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

export default app;
