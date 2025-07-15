import express from 'express';
import { ensureAdmin, ensureCounselor, ensureAuthenticated } from '../middleware/ensureAuthenticated.js';
import { checkDuplicateCounselor } from '../middleware/checkDuplicateCounselor.js';
import Counselor from '../models/Counselor.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

// Add counselor ✅
router.post('/add', ensureAdmin, checkDuplicateCounselor, async (req, res) => {
  const { name, email, specialty, experience, photo } = req.body;

  try {
    const counselor = await Counselor.create({ name, email, specialty, experience, photo });
    res.status(201).json({ message: 'Counselor added', counselor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add counselor' });
  }
});

// Edit counselor ✅
router.put('/:id', ensureAdmin, async (req, res) => {
  let{ id } = req.params;
  console.log('Received ID:', id);
 id = id.replace(/"/g, '');
  console.log('Sanitized ID:', id);

  const updates = req.body;

  try {
    const updated = await Counselor.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Counselor not found' });
    }
    res.json({ message: 'Counselor updated', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update counselor' });
  }
});

// Delete counselor ✅
router.delete('/:id', ensureAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Counselor.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Counselor not found' });
    }
    res.json({ message: 'Counselor deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete counselor' });
  }
});

// View all counselors ✅
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const counselors = await Counselor.find();
    res.json(counselors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch counselors' });
  }
});

// Counselors see their own appointments ✅
router.get('/my-appointments', ensureCounselor, async (req, res) => {
  try {
    const appointments = await Appointment.find({ counselor: req.user._id });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

export default router;
