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

  // Auto Config Methods
  async createHotspotProfile(name: string, rateLimit?: string, sharedUsers?: number) {
    try {
      await this.connect();
      const cmd = ['/ip/hotspot/user/profile/add', `=name=${name}`];
      if (rateLimit) cmd.push(`=rate-limit=${rateLimit}`);
      if (sharedUsers) cmd.push(`=shared-users=${sharedUsers}`);
      const result = await this.api.write(cmd);
      await this.disconnect();
      return result;
    } catch (error: any) {
      throw new Error(`Failed to create profile: ${error.message}`);
    }
  }

  async addHotspotUser(username: string, password?: string, profile?: string) {
    try {
      await this.connect();
      const cmd = ['/ip/hotspot/user/add', `=name=${username}`];
      if (password) cmd.push(`=password=${password}`);
      if (profile) cmd.push(`=profile=${profile}`);
      const result = await this.api.write(cmd);
      await this.disconnect();
      return result;
    } catch (error: any) {
      throw new Error(`Failed to add user: ${error.message}`);
    }
  }
}
