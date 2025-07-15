import mongoose from 'mongoose';

const counselorSchema = new mongoose.Schema({
  name: String,
  email:String,
  specialty: String,
  experience: Number,
  photo: String // URL
});

export default mongoose.model('Counselor', counselorSchema);
