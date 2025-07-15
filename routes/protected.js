import express from 'express';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';

const router = express.Router();

// 👇 This is your protected route
router.get('/', ensureAuthenticated, (req, res) => {
  res.json({ message: 'You are logged in!', user: req.user });
});

export default router;
