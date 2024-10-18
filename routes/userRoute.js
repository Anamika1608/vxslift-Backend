import express from 'express';
const router = express.Router();

import {getUser , findByEmail, updateStatus , getStatus} from '../controllers/userController.js';

router.get('/get_user', getUser);

router.get('/findUserByMail',findByEmail )

router.post('/updateStatus', updateStatus)

router.post('/getStatus', getStatus)

export default router;
