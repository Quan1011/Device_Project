import express from 'express';
import { getAllConfig ,addConfig, updateConfig, deleteConfig, applyConfig, applyAllConfig } from '../controllers/configController.js';

const router = express.Router();

router.get('/configs/:deviceId', getAllConfig);
router.post('/configs', addConfig);
router.put('/configs/:configId', updateConfig);
router.delete('/configs/:configId', deleteConfig);
router.post("/configs/:configId/apply", applyConfig);
router.post("/device/:deviceId/apply", applyAllConfig);

export default router;
