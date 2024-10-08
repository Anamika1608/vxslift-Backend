import express from 'express';
const router = express.Router();

import { checkout , paymentVerification } from '../controllers/paymentController.js'

router.post('/checkout', checkout)

router.post('/paymentVerification', paymentVerification)

export default router;