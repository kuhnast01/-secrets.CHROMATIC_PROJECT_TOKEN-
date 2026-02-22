import { Router } from 'express';
import auth from './auth';
import player from './player';
import economy from './economy';
import fleet from './fleet';
import combat from './combat';
import staticData from './staticData';
import commanders from './commanders';
import tech from './tech';
import admin from './admin';
import adminMigrate from './admin_migrate';
import adminTick from './admin_tick';

const router = Router();

router.use('/auth', auth);
router.use('/player', player);
router.use('/economy', economy);
router.use('/fleet', fleet);
router.use('/combat', combat);
router.use('/static', staticData);
router.use('/commanders', commanders);
router.use('/tech', tech);
router.use('/admin', admin);
router.use('/admin-migrate', adminMigrate);
router.use('/admin-analytics', require('./admin_analytics').default);
router.use('/admin/tick', adminTick);
router.use('/store', require('./store').default);

export default router;
