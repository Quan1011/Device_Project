import express from 'express';
import { getAllDevices, createDevice, getAllDevice, updateDevice, deleteDevice } from '../controllers/deviceController.js';

const router = express.Router();

router.get('/devices-tree', getAllDevices);
router.get('/device-tree', getAllDevice);
router.post('/device', createDevice);
router.put('/devices/:id', updateDevice);
router.delete('/devices/:id', deleteDevice);

export default router;

