import type { Request, Response, NextFunction } from 'express';

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
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
