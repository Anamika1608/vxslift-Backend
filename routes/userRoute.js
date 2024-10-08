import express from 'express';
const router = express.Router();

import {getUser} from '../controllers/userController.js';

router.get('/get_user', getUser);

export default router;
