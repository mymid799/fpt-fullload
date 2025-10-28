import express from 'express';
import { getStats } from '../controllers/statsController.js';

const router = express.Router();

// GET /api/stats - Lấy thống kê tổng quan
router.get('/', getStats);

export default router;
