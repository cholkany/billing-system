import { RouterOSAPI } from 'routeros-client';

export class MikroTikClient {
  private api: RouterOSAPI;

  constructor(options: { 
    host: string; 
    port?: number; 
    user: string; 
    password?: string 
  }) {
    this.api = new RouterOSAPI({
      host: options.host,
      port: options.port || 8728,
      user: options.user,
      password: options.password || '',
      timeout: 10,
    });
  }

  async connect() {
    await this.api.connect();
    return this.api;
  }

  async disconnect() {
    this.api.close();
  }

  async testConnection() {
    try {
      await this.connect();
      const identify = await this.api.write('/system/identity/print');
      await this.disconnect();
      return { success: true, identity: identify[0]?.name };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async getHotspotUsers() {
    try {
      await this.connect();
      const users = await this.api.write('/ip/hotspot/user/print');
      await this.disconnect();
      return users;
    } catch (error: any) {
      throw new Error(`Failed to get hotspot users: ${error.message}`);
    }
  }

  // Add more methods as needed for Profiles, Vouchers, Active Users etc.
}
