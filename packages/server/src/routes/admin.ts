import { Router, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { userStore } from '../context/users';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware to check superuser
const isSuperuser = async (req: Request, res: Response, next: Function) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string; isSuperuser: boolean };
    const user = await userStore.findByEmail(decoded.email);
    if (!user || !user.isSuperuser) {
      return res.status(403).json({ error: 'Superuser access required' });
    }
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload video
router.post('/upload/video', isSuperuser, async (req: Request, res: Response) => {
  const { title, filePath } = req.body; // Simulate file upload (real implementation needs multer)
  if (!title || !filePath) return res.status(400).json({ error: 'Title and file required' });

  // Simulate saving video metadata
  const video = { id: Date.now(), title, filePath };
  res.status(201).json({ message: 'Video uploaded', video });
});

// Upload post
router.post('/upload/post', isSuperuser, async (req: Request, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  // Simulate saving post
  const post = { id: Date.now(), title, content };
  res.status(201).json({ message: 'Post created', post });
});

export default router;