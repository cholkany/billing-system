import { Hono } from 'hono';
import { db } from '../db.js';
import { routers, hotspotUsers, vouchers } from '../schema.js';
import { eq } from 'drizzle-orm';

const statsApp = new Hono();

statsApp.get('/', async (c) => {
  const allRouters = await db.select().from(routers);
  const allUsers = await db.select().from(hotspotUsers);
  const allVouchers = await db.select().from(vouchers);

  const stats = {
    totalRouters: allRouters.length,
    onlineRouters: allRouters.filter(r => r.status === 'online').length,
    activeHotspotUsers: allUsers.filter(u => u.status === 'active').length,
    totalUsers: allUsers.length,
    totalVouchers: allVouchers.length,
    usedVouchers: allVouchers.filter(v => v.status === 'used').length,
  };

  return c.json(stats);
});

export default statsApp;
