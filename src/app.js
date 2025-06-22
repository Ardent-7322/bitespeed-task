import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

// Allow requests from other origins (e.g., frontend hosted separately)
app.use(cors());

// Automatically read JSON from incoming requests (like POST bodies)
app.use(express.json());

// All routes will start with /api (e.g., /api/identify)
app.use('/api', routes);

export default app;
