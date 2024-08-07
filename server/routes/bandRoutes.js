import express from 'express';
import { getAllBands, createBand, updatedBand, deleteBand } from '../controllers/bandController.js';

const router = express.Router();

router.get('/bands', getAllBands);
router.post('/band', createBand);
router.put('/band/:id', updatedBand);
router.delete('/band/:id', deleteBand);

export default router;
