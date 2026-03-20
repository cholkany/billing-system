import { Hono } from "hono";
import { db } from "../db.js";
import { routerVpn, routers } from "../schema.js";
import { eq } from "drizzle-orm";
import { generateScript } from "../services/script.js";

const provisionApp = new Hono();

provisionApp.get("/:token", async (c) => {
  const token = c.req.param("token");

  // 1. find router via token
  const vpnRecord = await db.select().from(routerVpn).where(eq(routerVpn.provisionToken, token));
  if (vpnRecord.length === 0) {
    return c.text("Invalid or expired provision token", 404);
  }

  const vpn = vpnRecord[0];
  const routerRecord = await db.select().from(routers).where(eq(routers.id, vpn.routerId));
  if (routerRecord.length === 0) {
    return c.text("Associated router not found", 404);
  }

  const router = routerRecord[0];

  // 2. generate script
  const script = generateScript({
    routerName: router.name,
    vpnIp: vpn.vpnIp,
    privateKey: vpn.privateKey,
    serverPublicKey: process.env.WIREGUARD_SERVER_PUBLIC_KEY || "SERVER_PUBLIC_KEY_PLACEHOLDER",
    serverIp: process.env.WIREGUARD_SERVER_ENDPOINT_IP || "YOUR_SERVER_IP",
    serverPort: parseInt(process.env.WIREGUARD_SERVER_PORT || "13231")
  });

  // 3. return script
  return c.text(script);
});

export default provisionApp;
