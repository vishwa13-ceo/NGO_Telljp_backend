import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { // will be null for Google users
    type: String
  },
  googleId: { // only for Google OAuth users
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  role: {
  type: String,
  enum: ['user', 'admin', 'counselor'],
  default: 'user'
}
});

export default mongoose.model('User', userSchema);
