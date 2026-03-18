# MikroTik RouterOS 7 script: register this router with the billing system and configure WireGuard for remote management.
# Run this script on the physical router (System > Scripts, paste and run, or schedule/run via SSH).
# Requires: RouterOS 7.x with WireGuard support; outbound HTTPS to the billing server.
#
# 1. Set the variables below to match your environment.
# 2. Run the script once. It will create a WireGuard interface, register with the API, and add the server as a peer.
# 3. On the billing server, add this router as a WireGuard peer (see docs) so it can reach the router's VPN address.

# ---------- CONFIG (edit these) ----------
:local billingUrl "https://YOUR_BILLING_SERVER/provision/router?format=routeros"
:local provisionKey "YOUR_PROVISION_API_KEY"
:local routerName "site1-router"
:local location "Main site"
:local apiUser "admin"
:local apiPass "your_api_password"
:local wgInterfaceName "wg-billing"
:local responseFile "provision-response.txt"
# ---------- END CONFIG ----------

:local pubkey ""
:if ([/interface wireguard find name=$wgInterfaceName] != "") do={
  :set pubkey [/interface wireguard get [find name=$wgInterfaceName] public-key]
  :put ("Using existing WireGuard interface: " . $wgInterfaceName)
} else={
  /interface wireguard add name=$wgInterfaceName listen-port=0
  :delay 1s
  :set pubkey [/interface wireguard get [find name=$wgInterfaceName] public-key]
  :put ("Created WireGuard interface: " . $wgInterfaceName)
}

:if ([:len $pubkey] = 0) do={
  :put "Error: could not get WireGuard public key"
  :error "No public key"
}

# Build JSON body (RouterOS: \22 = double quote in string)
:local body "{\22name\22:\22" . $routerName . "\22,\22location\22:\22" . $location . "\22,\22apiPort\22:8728,\22username\22:\22" . $apiUser . "\22,\22password\22:\22" . $apiPass . "\22,\22wireguardPublicKey\22:\22" . $pubkey . "\22}"

# POST to provisioning API (use http-header-field twice for two headers if your ROS supports it; else combine)
# If your server uses a self-signed cert, add: certificate-verify=no
/tool fetch mode=https url=$billingUrl http-method=post http-header-field=("Content-Type: application/json") http-header-field=("X-Provision-Key: " . $provisionKey) http-data=$body dst-path=$responseFile

:delay 1s
:local content [/file get [find name=$responseFile] contents]
/file remove [find name=$responseFile]

# Parse key=value lines (simple: find "key=" and take until newline)
:local getValue do={
  :local key $1
  :local keyLen [:len $key]
  :local pos [:find $content $key]
  :if ([:len $pos] = 0) do={ :return "" }
  :set pos ($pos + $keyLen)
  :local endPos [:find $content "\n" $pos]
  :if ([:len $endPos] = 0) do={ :set endPos [:len $content] }
  :local len ($endPos - $pos)
  :return [:pick $content $pos $len]
}

:local wgAddress [$getValue "wireguard_address="]
:local wgServerPubkey [$getValue "wireguard_server_public_key="]
:local wgServerEndpoint [$getValue "wireguard_server_endpoint="]

:if ([:len $wgAddress] = 0) do={
  :put "Provision response:"
  :put $content
  :put "Error: could not parse wireguard_address from response"
  :error "Parse error"
}

# Apply assigned address to WireGuard interface
/interface wireguard set [find name=$wgInterfaceName] comment=("billing-vpn " . $routerName)

:local addrPart [:pick $wgAddress 0 [:find $wgAddress "/"]]
:if ([:len $addrPart] > 0) do={
  /ip address add address=$wgAddress interface=$wgInterfaceName comment="billing-vpn"
}

# Add billing server as peer (replace existing peer for this interface if any)
:if ([/interface wireguard peers find interface=$wgInterfaceName] != "") do={
  /interface wireguard peers remove [find interface=$wgInterfaceName]
}
/interface wireguard peers add interface=$wgInterfaceName public-key=$wgServerPubkey endpoint=$wgServerEndpoint allowed-address=10.100.0.0/24 comment="billing-server"

:put ("Provisioned successfully. Router address: " . $wgAddress)
:put "Ensure the billing server has this router added as a WireGuard peer with the same public key."
