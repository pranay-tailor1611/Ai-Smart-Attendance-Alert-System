import { Router } from 'express';
import {
  markAttendance,
  markBulk,
  getRecords,
  getMyAttendance,
  getTodaySummary,
  getAllStats,
} from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/stats', authorize('admin', 'faculty'), getAllStats);
router.get('/today', authorize('faculty', 'admin'), getTodaySummary);
router.get('/my', authorize('student'), getMyAttendance);
router.get('/', authorize('admin', 'faculty', 'student'), getRecords);
router.post('/', authorize('faculty', 'admin'), markAttendance);
router.post('/bulk', authorize('faculty', 'admin'), markBulk);
export default router;
