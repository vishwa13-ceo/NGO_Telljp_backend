import bcrypt from 'bcrypt';
import User from '../models/User.js';

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user' // fallback to user if no role provided
    });
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
}


export const logout = (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
};
