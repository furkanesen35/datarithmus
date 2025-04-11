import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';

const app: Express = express();
const PORT: number = 3001;

app.use(cors()); // Add this
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});