import Counselor from '../models/Counselor.js';

export async function checkDuplicateCounselor(req, res, next) {
  try {
    const { email } = req.body;
    const exists = await Counselor.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Counselor with this email already exists' });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error checking counselor' });
  }
}
