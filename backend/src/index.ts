import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';

import authApp from './routes/auth.js';
import routersApp from './routes/routers.js';
import networksApp from './routes/networks.js';
import profilesApp from './routes/profiles.js';
import usersApp from './routes/users.js';
import vouchersApp from './routes/vouchers.js';
import statsApp from './routes/stats.js';

const app = new Hono();

app.use('*', cors({
  origin: ['http://localhost:3000'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
}));

app.get('/', (c) => {
  return c.text('MikroTik Billing System API');
});

// Public Routes
app.route('/auth', authApp);

// Protected Routes setup
app.use('/api/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.JWT_SECRET || 'supersecret123',
    alg: 'HS256'
  });
  return jwtMiddleware(c, next);
});

app.route('/api/routers', routersApp);
app.route('/api/networks', networksApp);
app.route('/api/profiles', profilesApp);
app.route('/api/users', usersApp);
app.route('/api/vouchers', vouchersApp);
app.route('/api/stats', statsApp);

const port = process.env.PORT ? parseInt(process.env.PORT) : 8787;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
