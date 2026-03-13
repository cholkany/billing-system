import { Hono } from 'hono';
import { db } from '../db.js';
import { vouchers, profiles } from '../schema.js';
import { eq } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const vouchersApp = new Hono();

const generateSchema = z.object({
  routerId: z.string().uuid(),
  profileId: z.string().uuid(),
  count: z.number().min(1).max(500),
  batchName: z.string(),
});

function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

vouchersApp.get('/', async (c) => {
  const allVouchers = await db.select().from(vouchers);
  return c.json(allVouchers);
});

vouchersApp.post('/generate', zValidator('json', generateSchema), async (c) => {
  const body = c.req.valid('json');
  
  const profileList = await db.select().from(profiles).where(eq(profiles.id, body.profileId));
  if (profileList.length === 0) return c.json({ error: 'Profile not found' }, 404);
  
  const price = profileList[0].price;
  const newVouchers = [];
  
  for (let i = 0; i < body.count; i++) {
    newVouchers.push({
      routerId: body.routerId,
      profileId: body.profileId,
      batch: body.batchName,
      price,
      code: generateRandomCode(),
      status: 'unused',
    });
  }
  
  const inserted = await db.insert(vouchers).values(newVouchers).returning();
  return c.json({ success: true, count: inserted.length, batch: body.batchName });
});

vouchersApp.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(vouchers).where(eq(vouchers.id, id));
  return c.json({ success: true });
});

export default vouchersApp;
