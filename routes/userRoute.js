import express from 'express';
const router = express.Router();

import {getUser , findByEmail} from '../controllers/userController.js';

router.get('/get_user', getUser);

router.get('/findUserByMail',findByEmail )

export default router;
