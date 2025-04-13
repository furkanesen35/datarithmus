import { Router, Request, Response } from 'express';
import { userStore } from '../context/users';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is not defined');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = await userStore.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, isSuperuser: user.isSuperuser }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.status(200).json({ message: 'Login successful', email: user.email, isSuperuser: user.isSuperuser });
});

router.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password are required' });
  const existingUser = await userStore.findByEmail(email);
  if (existingUser) return res.status(409).json({ error: 'Email already registered' });

  const newUser = await userStore.create(username, email, password);
  const token = jwt.sign({ id: newUser.id, email: newUser.email, isSuperuser: newUser.isSuperuser }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
  res.status(201).json({ message: 'Registration successful', email: newUser.email, isSuperuser: newUser.isSuperuser });
});

router.post('/google', async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'No token provided' });

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
      const username = payload.name || email.split('@')[0];
      user = await userStore.create(username, email, 'google-auth-placeholder');
    }

    const jwtToken = jwt.sign({ id: user.id, email: user.email, isSuperuser: user.isSuperuser }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', jwtToken, { httpOnly: true, secure: false, sameSite: 'lax' });
    res.status(200).json({ message: 'Google authentication successful', email: user.email, isSuperuser: user.isSuperuser });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
});

router.get('/me', async (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; isSuperuser: boolean };
    const user = await userStore.findByEmail(decoded.email);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.status(200).json({ email: user.email, isSuperuser: user.isSuperuser });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'lax' });
  res.status(200).json({ message: 'Logout successful' });
});

export default router;