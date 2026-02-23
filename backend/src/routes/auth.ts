import express from 'express';
// import bcrypt from 'bcryptjs'; // Disabled for local dev
import jwt from 'jsonwebtoken';

const router = express.Router();

// Single admin user with plain-text password for local dev
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123', // plain text for local dev
    role: 'admin',
  },
];

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

export default router;
