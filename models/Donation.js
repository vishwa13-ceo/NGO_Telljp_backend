import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  paymentId: String, // Razorpay payment id
  orderId: String,   // Razorpay order id
  status: { type: String, default: 'created' }, // created/paid/failed
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', donationSchema);
