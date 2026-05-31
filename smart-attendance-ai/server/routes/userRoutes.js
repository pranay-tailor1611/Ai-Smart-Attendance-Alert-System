import { Router } from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.use(protect, authorize('admin'));

router.get('/faculty', async (_req, res) => {
  const faculty = await User.find({ role: 'faculty' }).select('-password');
  res.json(faculty);
});

router.post('/faculty', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: 'faculty' });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
