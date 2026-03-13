import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sign } from 'hono/jwt';

const authApp = new Hono();

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

authApp.post('/login', zValidator('json', loginSchema), async (c) => {
  const { username, password } = c.req.valid('json');
  
  // Simple hardcoded admin check for lightweight system
  if (username === 'admin' && password === 'admin') {
    const payload = {
      username,
      role: 'admin',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    };
    const secret = process.env.JWT_SECRET || 'supersecret123';
    const token = await sign(payload, secret);
    
    return c.json({ token, user: { username, role: 'admin' } });
  }
  
  return c.json({ error: 'Invalid credentials' }, 401);
});

export default authApp;
