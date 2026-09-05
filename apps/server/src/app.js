import express from 'express';
import cors from 'cors';
import routes from './routes/index.route.js';
import { auditMiddleware } from './middlewares/audit.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Global audit logging middleware for mutating requests
app.use(auditMiddleware);

// Mount main routes under both /api and / for maximum flexibility
app.use('/api', routes);
app.use('/', routes);

// Central error handler
app.use(errorHandler);

export default app;
