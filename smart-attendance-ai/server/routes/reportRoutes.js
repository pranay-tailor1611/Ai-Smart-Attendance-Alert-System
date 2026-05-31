import { Router } from 'express';
import { downloadPdf, downloadExcel, listReports } from '../controllers/reportController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect);
router.get('/', authorize('admin', 'faculty'), listReports);
router.get('/pdf', authorize('admin', 'faculty'), downloadPdf);
router.get('/excel', authorize('admin', 'faculty'), downloadExcel);
export default router;
