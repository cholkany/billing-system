import { Hono } from 'hono';
import { db } from '../db.js';
import { routers } from '../schema.js';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const provisionApp = new Hono();

const WG_NETWORK = process.env.WIREGUARD_NETWORK || '10.100.0.0/24';
const WG_SERVER_PUBLIC_KEY = process.env.WIREGUARD_SERVER_PUBLIC_KEY || '';
const WG_SERVER_ENDPOINT = process.env.WIREGUARD_SERVER_ENDPOINT || '';

function nextVpnAddress(used: string[]): string {
  const [network, prefix] = WG_NETWORK.split('/');
  const octets = network.split('.');
  octets.pop();
  const base = octets.join('.');
  const prefixLen = parseInt(prefix || '24', 10);
  const lastOctets = used
    .map((a) => parseInt(a.replace(/^.*\./, '').replace(/\/\d+$/, ''), 10))
    .filter((n) => !Number.isNaN(n));
  const max = lastOctets.length ? Math.max(...lastOctets) : 1;
  const next = max + 1;
  return `${base}.${next}/${prefixLen}`;
}

const provisionSchema = z.object({
  name: z.string().min(1),
  location: z.string().optional(),
  apiPort: z.number().default(8728),
  username: z.string().min(1),
  password: z.string(),
  wireguardPublicKey: z.string().min(1),
  ipAddress: z.string().optional(),
});

provisionApp.post('/router', zValidator('json', provisionSchema), async (c) => {
  const key = c.req.header('X-Provision-Key');
  const expected = process.env.PROVISION_API_KEY;
  if (!expected || key !== expected) {
    return c.json({ error: 'Invalid or missing provision key' }, 401);
  }

  const body = c.req.valid('json');
  const allRouters = await db.select({ wireguardVpnAddress: routers.wireguardVpnAddress }).from(routers);
  const used = allRouters
    .map((r) => r.wireguardVpnAddress)
    .filter((a): a is string => !!a);
  const assignedAddress = nextVpnAddress(used);

  const [inserted] = await db
    .insert(routers)
    .values({
      name: body.name,
      ipAddress: body.ipAddress ?? '0.0.0.0',
      apiPort: body.apiPort,
      username: body.username,
      password: body.password,
      location: body.location ?? null,
      wireguardPublicKey: body.wireguardPublicKey,
      wireguardVpnAddress: assignedAddress,
    })
    .returning();

  const payload = {
    routerId: inserted.id,
    wireguardAddress: assignedAddress,
    wireguardServerPublicKey: WG_SERVER_PUBLIC_KEY,
    wireguardServerEndpoint: WG_SERVER_ENDPOINT,
  };

  const format = c.req.query('format')?.toLowerCase();
  if (format === 'routeros') {
    const lines = [
      `router_id=${inserted.id}`,
      `wireguard_address=${assignedAddress}`,
      `wireguard_server_public_key=${WG_SERVER_PUBLIC_KEY}`,
      `wireguard_server_endpoint=${WG_SERVER_ENDPOINT}`,
    ];
    return c.text(lines.join('\n'), 200, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
  }

  return c.json(payload);
});

export default provisionApp;
