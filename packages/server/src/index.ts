import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';

const app: Express = express();
const PORT: number = 3001;

app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // Allow cookies
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});