import express from 'express';
import { getAllDevices, getDevice, createDevice, getAllDevice, updateDevice, deleteDevice, getAllDeviceLabels } from '../controllers/deviceController.js';

const router = express.Router();

router.get('/devices-tree', getAllDevices);
router.get('/device-labels', getAllDeviceLabels);
router.get('/device-tree', getAllDevice);
router.post('/device', createDevice);
router.get('/devices/:id', getDevice);
router.put('/devices/:id', updateDevice);
router.delete('/devices/:id', deleteDevice);

export default router;

