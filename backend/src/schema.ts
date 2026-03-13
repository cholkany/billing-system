import { pgTable, text, timestamp, integer, uuid, boolean } from 'drizzle-orm/pg-core';

export const routers = pgTable('routers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  ipAddress: text('ip_address').notNull(),
  apiPort: integer('api_port').default(8728).notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  location: text('location'),
  status: text('status').default('offline'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const networks = pgTable('networks', {
  id: uuid('id').defaultRandom().primaryKey(),
  routerId: uuid('router_id').references(() => routers.id, { onDelete: 'cascade' }).notNull(),
  networkName: text('network_name').notNull(),
  description: text('description'),
  subnet: text('subnet').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  routerId: uuid('router_id').references(() => routers.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  rateLimit: text('rate_limit'), 
  sharedUsers: integer('shared_users').default(1),
  sessionTimeout: text('session_timeout'),
  validity: text('validity'),
  price: integer('price').notNull(), // price in cents to avoid floats
  description: text('description'),
});

export const hotspotUsers = pgTable('hotspot_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  routerId: uuid('router_id').references(() => routers.id, { onDelete: 'cascade' }).notNull(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'set null' }),
  status: text('status').default('active'),
  macAddress: text('mac_address'),
  uptime: text('uptime'),
  dataUsed: text('data_used'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const vouchers = pgTable('vouchers', {
  id: uuid('id').defaultRandom().primaryKey(),
  routerId: uuid('router_id').references(() => routers.id, { onDelete: 'cascade' }).notNull(),
  code: text('code').notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  status: text('status').default('unused'), // unused, used, expired
  batch: text('batch').notNull(),
  price: integer('price').notNull(), // stored per voucher
  createdAt: timestamp('created_at').defaultNow(),
  usedAt: timestamp('used_at'),
});
