import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';


import './config/passport.js';

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import appointmentRoutes from './routes/appointment.js';
import counselorRoutes from './routes/counselor.js';
import donationRoutes from './routes/donation.js';

app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/appointment', appointmentRoutes);
app.use('/counselor', counselorRoutes);
app.use('/donation', donationRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('🌟 Welcome to the Mental Health NGO API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
