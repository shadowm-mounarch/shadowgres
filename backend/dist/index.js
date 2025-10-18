import express, {} from 'express';
import tableRouter from './routes/table.js';
import { apiKeyAuth } from './middleware/auth.js';
const app = express();
app.use(express.json());
console.log('Applying table router with auth middleware');
const port = process.env.PORT || 3000;
app.use('/api/v1/tables', apiKeyAuth, tableRouter);
app.get('/', (req, res) => {
    res.send('Hello from Shadowgres Backend!');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map