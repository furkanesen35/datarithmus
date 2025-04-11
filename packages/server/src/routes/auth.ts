import { Router, Request, Response } from 'express';

const router = Router();

// Login Endpoint
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Placeholder logic (replace with real auth later)
  console.log('Login attempt:', { email, password });
  res.status(200).json({ message: 'Login successful', user: { email } });
});

// Register Endpoint
router.post('/register', (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  // Placeholder logic (replace with real registration later)
  console.log('Register attempt:', { username, email, password });
  res.status(201).json({ message: 'Registration successful', user: { username, email } });
});

export default router;