import { Router } from 'express';
import auth from './auth';
import player from './player';
import economy from './economy';
import fleet from './fleet';
import combat from './combat';
import staticData from './staticData';

const router = Router();

router.use('/auth', auth);
router.use('/player', player);
router.use('/economy', economy);
router.use('/fleet', fleet);
router.use('/combat', combat);
router.use('/static', staticData);

export default router;
