import { Router } from 'express';
import {
  runWorkflow,
  runBulk,
  getAlerts,
  markAlertRead,
  getRecommendations,
} from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/alerts', getAlerts);
router.patch('/alerts/:id/read', markAlertRead);
router.get('/recommendations', getRecommendations);
router.post('/workflow/:studentId', authorize('admin', 'faculty'), runWorkflow);
router.post('/workflow/bulk', authorize('admin'), runBulk);
export default router;
