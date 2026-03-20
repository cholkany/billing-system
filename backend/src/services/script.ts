export function generateScript(data: {
  routerName: string;
  vpnIp: string;
  privateKey: string;
  serverPublicKey: string;
  serverIp: string;
  serverPort: number;
}) {
  return `
/system identity set name="${data.routerName}"

/interface wireguard add name=wg-client private-key="${data.privateKey}"
/ip address add address=${data.vpnIp}/24 interface=wg-client

/interface wireguard peers add \\
interface=wg-client \\
public-key="${data.serverPublicKey}" \\
endpoint="${data.serverIp}:${data.serverPort}" \\
allowed-address=0.0.0.0/0 \\
persistent-keepalive=25

/ip service set api address=10.10.0.0/24
`;
}
