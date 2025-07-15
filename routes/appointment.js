import express from 'express';
import { bookAppointment } from '../controllers/appointmentController.js';
import Appointment from '../models/Appointment.js';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated.js';

const router = express.Router();
const app = express();

app.post('/appointments', ensureAuthenticated, async (req, res) => {
  const { counselorId, date, notes } = req.body;

  const appointment = await Appointment.create({
    userId: req.user._id,
    counselorId,
    date,
    notes
  });

  res.json({ message: 'Appointment booked', appointment });
});

router.post('/book', bookAppointment);

export default router;
