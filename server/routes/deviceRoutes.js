import express from 'express';
import { getAllDevices, createDevice, getAllDevice } from '../controllers/deviceController.js';

const router = express.Router();

router.get('/devices-tree', getAllDevices);
router.get('/device-tree', getAllDevice);
router.post('/device', createDevice);

export default router;
