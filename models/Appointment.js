import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor' },
  date: Date,
  notes: String
});

export default mongoose.model('Appointment', appointmentSchema);
