import { Router, Request, Response } from 'express';
import { userStore } from '../context/users';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const router = Router();
const JWT_SECRET = 'your-secret-key';
const GOOGLE_CLIENT_ID = '512313453952-p1kc0emice0hshj0kv3e976plkeffk7e.apps.googleusercontent.com';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = await userStore.findByEmail(email);
  if (!user || user.password !== password) return res.status(401).json({ error: 'Invalid email or password' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.status(200).json({ message: 'Login successful', email: user.email });
});

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password are required' });
  const existingUser = await userStore.findByEmail(email);
  if (existingUser) return res.status(409).json({ error: 'Email already registered' });

  const newUser = await userStore.create(username, email, password);
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.status(201).json({ message: 'Registration successful', email: newUser.email });
});

router.post('/google', async (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const email = payload.email;
    let user = await userStore.findByEmail(email);
    if (!user) {
      // Register new user
      const username = payload.name || email.split('@')[0];
      user = await userStore.create(username, email, 'google-auth'); // No password for Google users
    }

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', jwtToken, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.status(200).json({ message: 'Google authentication successful', email: user.email });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

export default router;