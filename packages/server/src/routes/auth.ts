import { Router, Request, Response } from 'express';
import { userStore } from '../context/users';
import * as jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'your-secret-key'; // Replace with env var in production

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = await userStore.findByEmail(email);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful', token });
});

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password are required' });
  const existingUser = await userStore.findByEmail(email);
  if (existingUser) return res.status(409).json({ error: 'Email already registered' });

  const newUser = await userStore.create(username, email, password);
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ message: 'Registration successful', token });
});

export default router;