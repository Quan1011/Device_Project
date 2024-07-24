import express from 'express';
import { getAllConfig ,addConfig, updateConfig, deleteConfig } from '../controllers/configController.js';

const router = express.Router();

router.get('/configs/:deviceId', getAllConfig);
router.post('/configs', addConfig);
router.put('/configs/:configId', updateConfig);
router.delete('/configs/:configId', deleteConfig);

export default router;
