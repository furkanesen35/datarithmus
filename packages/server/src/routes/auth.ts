import { Router, Request, Response } from 'express';
import { userStore } from '../context/users';
import * as jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = 'your-secret-key';

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = await userStore.findByEmail(email);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' }); // secure: true in production
  res.status(200).json({ message: 'Login successful', email: user.email });
});

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password are required' });
  const existingUser = await userStore.findByEmail(email);
  if (existingUser) return res.status(409).json({ error: 'Email already registered' });

  const newUser = await userStore.create(username, email, password);
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' }); // secure: true in production
  res.status(201).json({ message: 'Registration successful', email: newUser.email });
});

export default router;