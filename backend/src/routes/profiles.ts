import { Hono } from 'hono';
import { db } from '../db.js';
import { profiles } from '../schema.js';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const profilesApp = new Hono();

const profileSchema = z.object({
  routerId: z.string().uuid(),
  name: z.string(),
  rateLimit: z.string().optional(),
  sharedUsers: z.number().default(1),
  sessionTimeout: z.string().optional(),
  validity: z.string().optional(),
  price: z.number(),
  description: z.string().optional(),
});

profilesApp.get('/', async (c) => {
  const allProfiles = await db.select().from(profiles);
  return c.json(allProfiles);
});

profilesApp.post('/', zValidator('json', profileSchema), async (c) => {
  const body = c.req.valid('json');
  const newProfile = await db.insert(profiles).values(body).returning();
  return c.json(newProfile[0]);
});

profilesApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(profiles).where(eq(profiles.id, id));
  return c.json({ success: true });
});

export default profilesApp;
