import express from "express";
import { getChildren } from "../controllers/folderController.js";

const router = express.Router();

router.get("/folder/:id", getChildren);

export default router;
