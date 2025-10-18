import express from 'express';
import { generateReport, saveReport, getReportByProductId } from '../controllers/reportController.js';

const router = express.Router();

router.get('/generate/:productId', generateReport);
router.post('/', saveReport);
router.get('/:productId', getReportByProductId);

export default router;
