import Appointment from '../models/Appointment.js';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';


export async function bookAppointment(req, res) {
  const { name, email, date, time, counselor } = req.body;

  try {
    // save appointment in DB
    const appointment = await Appointment.create({ name, email, date, time, counselor });

    // generate PDF invoice
    const pdfPath = `./invoices/appointment-${appointment._id}.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(25).text('Appointment Confirmation', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${name}`);
    doc.text(`Email: ${email}`);
    doc.text(`Date: ${date}`);
    doc.text(`Time: ${time}`);
    doc.text(`Counselor: ${counselor}`);
    doc.end();

    // send email with PDF
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Appointment Confirmation',
      text: 'Please find attached your appointment confirmation.',
      attachments: [
        {
          filename: `appointment-${appointment._id}.pdf`,
          path: pdfPath
        }
      ]
    });

    res.json({ message: 'Appointment booked & email sent!', appointment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
