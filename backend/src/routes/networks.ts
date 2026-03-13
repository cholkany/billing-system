import { Hono } from 'hono';
import { db } from '../db.js';
import { networks } from '../schema.js';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const networksApp = new Hono();

const networkSchema = z.object({
  routerId: z.string().uuid(),
  networkName: z.string(),
  description: z.string().optional(),
  subnet: z.string(),
});

networksApp.get('/', async (c) => {
  const allNetworks = await db.select().from(networks);
  return c.json(allNetworks);
});

networksApp.post('/', zValidator('json', networkSchema), async (c) => {
  const body = c.req.valid('json');
  const newNetwork = await db.insert(networks).values(body).returning();
  return c.json(newNetwork[0]);
});

networksApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(networks).where(eq(networks.id, id));
  return c.json({ success: true });
});

export default networksApp;
