import { Router } from 'express';
import {
  listStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentDetail,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', authorize('admin', 'faculty'), listStudents);
router.post('/', authorize('admin'), createStudent);
router.get('/:id', authorize('admin', 'faculty'), getStudentDetail);
router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);
export default router;
