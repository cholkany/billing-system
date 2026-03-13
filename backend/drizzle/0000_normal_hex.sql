CREATE TABLE "hotspot_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"router_id" uuid NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"profile_id" uuid,
	"status" text DEFAULT 'active',
	"mac_address" text,
	"uptime" text,
	"data_used" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "networks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"router_id" uuid NOT NULL,
	"network_name" text NOT NULL,
	"description" text,
	"subnet" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"router_id" uuid NOT NULL,
	"name" text NOT NULL,
	"rate_limit" text,
	"shared_users" integer DEFAULT 1,
	"session_timeout" text,
	"validity" text,
	"price" integer NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "routers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"ip_address" text NOT NULL,
	"api_port" integer DEFAULT 8728 NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"location" text,
	"status" text DEFAULT 'offline',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"router_id" uuid NOT NULL,
	"code" text NOT NULL,
	"profile_id" uuid NOT NULL,
	"status" text DEFAULT 'unused',
	"batch" text NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"used_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "hotspot_users" ADD CONSTRAINT "hotspot_users_router_id_routers_id_fk" FOREIGN KEY ("router_id") REFERENCES "public"."routers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hotspot_users" ADD CONSTRAINT "hotspot_users_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "networks" ADD CONSTRAINT "networks_router_id_routers_id_fk" FOREIGN KEY ("router_id") REFERENCES "public"."routers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_router_id_routers_id_fk" FOREIGN KEY ("router_id") REFERENCES "public"."routers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_router_id_routers_id_fk" FOREIGN KEY ("router_id") REFERENCES "public"."routers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;