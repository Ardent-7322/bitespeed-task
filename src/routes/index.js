import express from 'express';
import identifyRoute from './identify.route.js';

const router = express.Router();

// If someone hits /api/identify, send them to the identify route logic
router.use('/identify', identifyRoute);

export default router;
