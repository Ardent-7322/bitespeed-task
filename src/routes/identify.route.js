import express from 'express';
import { identifyController } from '../controllers/identify.controller.js';

const router = express.Router();

// When someone sends a POST request to /api/identify, this function handles it
router.post('/', identifyController);

export default router;
