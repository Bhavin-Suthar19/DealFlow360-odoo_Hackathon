import express from 'express';
import cors from 'cors';
import routes from './routes/index.route.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes mounted with NO /api prefix
app.use('/', routes);

app.use(errorHandler);

export default app;
