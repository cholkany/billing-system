import { Hono } from 'hono';
import { db } from '../db.js';
import { routers } from '../schema.js';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { MikroTikClient } from '../mikrotik.js';

const routersApp = new Hono();

const routerSchema = z.object({
  name: z.string(),
  ipAddress: z.string(),
  apiPort: z.number().default(8728),
  username: z.string(),
  password: z.string(),
  location: z.string().optional(),
});

routersApp.get('/', async (c) => {
  const allRouters = await db.select().from(routers);
  return c.json(allRouters);
});

routersApp.post('/', zValidator('json', routerSchema), async (c) => {
  const body = c.req.valid('json');
  const newRouter = await db.insert(routers).values(body).returning();
  return c.json(newRouter[0]);
});

routersApp.get('/:id', async (c) => {
  const id = c.req.param('id');
  const router = await db.select().from(routers).where(eq(routers.id, id));
  if (router.length === 0) return c.json({ error: 'Not found' }, 404);
  return c.json(router[0]);
});

routersApp.put('/:id', zValidator('json', routerSchema), async (c) => {
  const id = c.req.param('id');
  const body = c.req.valid('json');
  const updatedRouter = await db.update(routers).set(body).where(eq(routers.id, id)).returning();
  return c.json(updatedRouter[0]);
});

routersApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(routers).where(eq(routers.id, id));
  return c.json({ success: true });
});

routersApp.post('/:id/test', async (c) => {
  const id = c.req.param('id');
  const router = await db.select().from(routers).where(eq(routers.id, id));
  if (router.length === 0) return c.json({ error: 'Not found' }, 404);
  
  const r = router[0];
  const client = new MikroTikClient({
    host: r.ipAddress,
    port: r.apiPort,
    user: r.username,
    password: r.password,
  });
  
  const result = await client.testConnection();
  
  // Update router status based on result
  await db.update(routers)
    .set({ status: result.success ? 'online' : 'offline' })
    .where(eq(routers.id, id));
    
  return c.json(result);
});

export default routersApp;
