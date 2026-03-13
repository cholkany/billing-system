import { Hono } from 'hono';
import { db } from '../db.js';
import { hotspotUsers, routers } from '../schema.js';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { MikroTikClient } from '../mikrotik.js';

const usersApp = new Hono();

const userSchema = z.object({
  routerId: z.string().uuid(),
  username: z.string(),
  password: z.string(),
  profileId: z.string().uuid().optional(),
});

usersApp.get('/', async (c) => {
  const allUsers = await db.select().from(hotspotUsers);
  return c.json(allUsers);
});

usersApp.post('/', zValidator('json', userSchema), async (c) => {
  const body = c.req.valid('json');
  const newUser = await db.insert(hotspotUsers).values(body).returning();
  return c.json(newUser[0]);
});

usersApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(hotspotUsers).where(eq(hotspotUsers.id, id));
  return c.json({ success: true });
});

usersApp.post('/sync/:routerId', async (c) => {
  const routerId = c.req.param('routerId');
  const router = await db.select().from(routers).where(eq(routers.id, routerId));
  if (router.length === 0) return c.json({ error: 'Router not found' }, 404);
  
  const r = router[0];
  const client = new MikroTikClient({
    host: r.ipAddress,
    port: r.apiPort,
    user: r.username,
    password: r.password,
  });
  
  try {
    const mikrotikUsers = await client.getHotspotUsers();
    // A complete implementation would diff local users against router users and update.
    // Simplifying here to just return the results.
    return c.json({ success: true, count: mikrotikUsers.length, users: mikrotikUsers });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

export default usersApp;
