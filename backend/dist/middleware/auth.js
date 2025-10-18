import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const apiKey = fs.readFileSync(path.join(__dirname, '../../key.md'), 'utf-8').trim();
export const apiKeyAuth = (req, res, next) => {
    const providedApiKey = req.headers['x-api-key'];
    console.log('Provided API Key:', providedApiKey);
    console.log('Expected API Key:', apiKey);
    if (!providedApiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }
    if (providedApiKey !== apiKey) {
        return res.status(403).json({ error: 'Invalid API key' });
    }
    next();
};
//# sourceMappingURL=auth.js.map