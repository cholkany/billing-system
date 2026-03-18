type RouterRow = { ipAddress: string; wireguardVpnAddress: string | null };

/**
 * Host to use when connecting to a router (MikroTik API).
 * Prefers WireGuard VPN address when set for remote management.
 */
export function getRouterConnectHost(router: RouterRow): string {
  if (router.wireguardVpnAddress) {
    return router.wireguardVpnAddress.replace(/\/\d+$/, '');
  }
  return router.ipAddress;
}
