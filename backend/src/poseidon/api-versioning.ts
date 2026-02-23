// Poseidon API Versioning and Extensibility
// Professional, robust, and future-proof for world-class platforms

import express, { Request, Response, NextFunction } from 'express';

export function apiVersionMiddleware(req: Request, res: Response, next: NextFunction) {
  const version = req.headers['x-api-version'] || 'v1';
  req['apiVersion'] = version;
  next();
}

export function registerApiRoutes(app: express.Application) {
  // Example: Register v1 and v2 endpoints
  app.use(apiVersionMiddleware);

  app.get('/api/:version/resource', (req, res) => {
    const version = req.params.version || req['apiVersion'];
    if (version === 'v1') {
      res.json({ message: 'Resource v1', version });
    } else if (version === 'v2') {
      res.json({ message: 'Resource v2', version });
    } else {
      res.status(400).json({ error: 'Unsupported API version', version });
    }
  });

  // Extensibility: Add new endpoints and versions here
}

// Example usage:
// const app = express();
// registerApiRoutes(app);
