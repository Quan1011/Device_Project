import express from 'express';
import { signUp, signOut, logIn, logInWithPassword2 } from '../controllers/auth.js';

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/logout", signOut);
router.post("/verify-password2", logInWithPassword2);

export default router;


