import { Router } from 'express';
import {
  adminDashboard,
  facultyDashboard,
  studentDashboard,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/admin', authorize('admin'), adminDashboard);
router.get('/faculty', authorize('faculty', 'admin'), facultyDashboard);
router.get('/student', authorize('student'), studentDashboard);
export default router;
