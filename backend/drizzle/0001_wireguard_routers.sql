-- WireGuard remote management fields for routers
ALTER TABLE "routers" ADD COLUMN IF NOT EXISTS "wireguard_public_key" text;--> statement-breakpoint
ALTER TABLE "routers" ADD COLUMN IF NOT EXISTS "wireguard_vpn_address" text;
