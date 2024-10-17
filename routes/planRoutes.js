import express from 'express';
const router = express.Router();

import { checkPurchasedPlan, createPlan , getPlans , getPurchasedPlan } from '../controllers/planController.js';

router.post('/createPlan', createPlan)

router.get('/getPlans', getPlans)

router.post('/checkPurchasedPlan' , checkPurchasedPlan)

router.post('/getPurchasedPlan' , getPurchasedPlan)

export default router;