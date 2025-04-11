import express, { Express } from 'express';
import authRoutes from './routes/auth';

const app: Express = express();
const PORT: number = 3001;

app.use(express.json()); // Parse JSON bodies

app.use('/api/auth', authRoutes); // Mount auth routes

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});