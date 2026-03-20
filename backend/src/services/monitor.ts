import { db } from '../db.js';
import { routers, routerVpn } from '../schema.js';
import { eq } from 'drizzle-orm';
import { MikroTikClient } from '../mikrotik.js';

export function startRouterMonitor() {
  console.log("Starting Router Monitor loop...");
  
  setInterval(async () => {
    try {
      // Loop over all routers that have a VPN configuration
      const allVpns = await db.select().from(routerVpn);
      for (const vpn of allVpns) {
        const routerRecord = await db.select().from(routers).where(eq(routers.id, vpn.routerId));
        if (routerRecord.length > 0) {
          const r = routerRecord[0];
          
          // Try MikroTik API using the VPN IP
          const client = new MikroTikClient({
            host: vpn.vpnIp, // Connecting securely via WG overlay
            port: r.apiPort,
            user: r.username,
            password: r.password,
          });

          const result = await client.testConnection();

          // Update router status in background
          await db.update(routers)
            .set({ status: result.success ? 'online' : 'offline' })
            .where(eq(routers.id, r.id));
        }
      }
    } catch (err) {
      console.error('Error in router monitor loop', err);
    }
  }, 10000); // 10 seconds interval as requested
}
