import express, { type Express, type Request, type Response } from 'express';
import tableRouter from './routes/table.js';
import { apiKeyAuth } from './middleware/auth.js';

const app: Express = express();
app.use(express.json());
console.log('Applying table router with auth middleware');
const port = process.env.PORT || 3001;

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});

app.use('/api/v1/tables', apiKeyAuth, tableRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Shadowgres Backend!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
