import dotenv from 'dotenv';
dotenv.config();
import Razorpay from 'razorpay';
import Donation from '../models/Donation.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export async function createDonation(req, res) {
  const { name, email, amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // ₹ → paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const donation = await Donation.create({
      name,
      email,
      amount,
      orderId: order.id
    });

    res.json({
      message: 'Donation order created',
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create donation' });
  }
}

export async function verifyDonation(req, res) {
  const { orderId, paymentId, status } = req.body;

  try {
    const donation = await Donation.findOne({ orderId });
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    donation.paymentId = paymentId;
    donation.status = status;
    await donation.save();

    res.json({ message: 'Donation verified', donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to verify donation' });
  }
}
