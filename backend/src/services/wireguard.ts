import { exec } from "child_process";

export function addPeer(publicKey: string, ip: string) {
  // We execute this command assuming the backend container has access to host docker via proxy,
  // or that we will address how they execute later. 
  // For now, based on the plan:
  exec(`docker exec wireguard wg set wg0 peer ${publicKey} allowed-ips ${ip}/32`, (error) => {
    if (error) {
      console.error("Failed to add WireGuard peer:", error);
    } else {
      console.log(`Successfully added WireGuard peer: ${publicKey} with IP: ${ip}/32`);
    }
  });
}
