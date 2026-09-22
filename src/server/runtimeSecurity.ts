import type { Express, NextFunction, Request, Response } from 'express';
import { timingSafeEqual } from 'node:crypto';

const MUTATION_PATHS = new Set([
  '/api/blockchain/mine',
  '/api/faucet/drip',
  '/api/agent/execute-plan',
  '/api/sdk/execute'
]);

function sameToken(header: string | undefined, token: string): boolean {
  const expected = Buffer.from(`Bearer ${token}`);
  const actual = Buffer.from(header || '');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function allowedOrigins(): Set<string> {
  const values = (process.env.QMOOSA_CORS_ALLOWED_ORIGINS || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
  if (process.env.APP_URL?.trim()) values.push(process.env.APP_URL.trim());
  return new Set(values);
}

export function applyRuntimeSecurity(app: Express): void {
  const production = process.env.NODE_ENV === 'production';
  const mutationsEnabled = process.env.QMOOSA_ENABLE_SIMULATION_MUTATIONS === 'true';
  const adminToken = process.env.QMOOSA_ADMIN_TOKEN?.trim() || '';
  const origins = allowedOrigins();

  if (
    production &&
    mutationsEnabled &&
    (adminToken.length < 32 || /^change[_-]?me/i.test(adminToken))
  ) {
    throw new Error('QMOOSA_ADMIN_TOKEN must be a non-placeholder secret of at least 32 characters when production simulation mutations are enabled');
  }

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    const origin = req.headers.origin;
    if (origin) {
      if (origins.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      } else if (production) {
        return res.status(403).json({ error: 'origin not allowed' });
      }
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!production || req.method !== 'POST' || !MUTATION_PATHS.has(req.path)) return next();

    if (!mutationsEnabled) {
      return res.status(503).json({
        error: 'simulation mutation API is disabled in production',
        mode: 'READ_ONLY_PRODUCTION_PREVIEW'
      });
    }

    if (!sameToken(req.headers.authorization, adminToken)) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    next();
  });
}
