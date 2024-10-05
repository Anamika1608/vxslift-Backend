import express from 'express';
const router = express.Router();

import { login , register , logout , googleLogin} from '../controllers/authController.js';

router.post("/register", register);

router.post("/login", login );

router.get("/logout", logout);

router.post("/googleLogin", googleLogin );

// router.post("/check_auth", checkAuth);

export default router;
