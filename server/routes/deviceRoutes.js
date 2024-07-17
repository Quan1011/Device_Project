import express from 'express';
import { getDeviceTree, createDevice } from '../controllers/deviceController.js';

const router = express.Router();

router.get('/device-tree', getDeviceTree);
router.post('/devices', createDevice);

export default router;
