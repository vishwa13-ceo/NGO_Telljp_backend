import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';

const router = express.Router();

// Razorpay client
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Endpoint to create an order (user initiates donation)
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt = 'receipt#1' } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // in paise
      currency,
      receipt,
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// 📡 Webhook endpoint: Razorpay calls this after payment is successful
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers['x-razorpay-signature'];
  const body = req.body;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(req.body.toString())
    .digest('hex');

  if (signature !== expectedSignature) {
    console.log('Invalid signature');
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const payload = JSON.parse(req.body.toString());
  console.log('Webhook payload:', payload);

  const { email, amount, donorName } = extractDonationDetails(payload);

  // 🎯 Send email & PDF
  await sendDonationReceipt(email, donorName, amount);

  res.json({ status: 'ok' });
});

function extractDonationDetails(payload) {
  const donorName = 'Donor';
  const email = payload.payload?.payment?.entity?.email || 'no-reply@example.com';
  const amount = payload.payload?.payment?.entity?.amount / 100;
  return { donorName, email, amount };
}

async function sendDonationReceipt(email, donorName, amount) {
  const pdfPath = `./invoices/donation-${Date.now()}.pdf`;
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.fontSize(20).text('Donation Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Donor Name: ${donorName}`);
  doc.text(`Email: ${email}`);
  doc.text(`Amount: ₹${amount}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.end();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for your donation',
    text: 'Please find your donation receipt attached.',
    attachments: [
      {
        filename: 'donation-receipt.pdf',
        path: pdfPath,
      },
    ],
  });

  console.log('Donation receipt emailed to', email);
}

export default router;
