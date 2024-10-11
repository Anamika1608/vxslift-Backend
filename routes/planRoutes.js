import express from 'express';
const router = express.Router();

import { createPlan , getPlans } from '../controllers/planController.js';

router.post('/createPlan', createPlan)

router.get('/getPlans', getPlans)

export default router;