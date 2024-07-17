import express from 'express';
import { signUp, signOut, logIn } from '../controllers/auth.js';

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/signout", signOut)

export default router;


