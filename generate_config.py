#!/usr/bin/env python3
"""
Generate Xray VLESS config.json (and VLESS link) without running the proxy.
Suitable for GitHub Actions.
"""

import argparse
import json
import os
import urllib.request
from pathlib import Path

# ------------------------------------------------------------
# Configuration template (same as original config.json)
# ------------------------------------------------------------
CONFIG = {
    "inbounds": [
        {
            "port": 443,
            "protocol": "vless",
            "settings": {
                "clients": [{"id": "550e8400-e29b-41d4-a716-446655440000"}],
                "decryption": "none",
            },
            "streamSettings": {
                "network": "xhttp",
                "xhttpSettings": {"mode": "packet-up", "path": "/"},
            },
        }
    ],
    "outbounds": [{"protocol": "freedom"}],
}


def get_vless_link(port=443):
    """Generate VLESS link using codespace domain or public IP."""
    client_id = CONFIG["inbounds"][0]["settings"]["clients"][0]["id"]
    codespace_name = os.environ.get("CODESPACE_NAME")
    if codespace_name:
        server_addr = f"{codespace_name}-443.app.github.dev"
    else:
        try:
            with urllib.request.urlopen("https://api.ipify.org", timeout=5) as resp:
                server_addr = resp.read().decode().strip()
        except Exception:
            server_addr = "127.0.0.1"
    params = {
        "encryption": "none",
        "security": "tls",
        "type": "xhttp",
        "mode": "packet-up",
        "sni": server_addr,
        "path": "/",
    }
    param_str = "&".join(f"{k}={v}" for k, v in params.items())
    return f"vless://{client_id}@{server_addr}:{port}?{param_str}#ghtun"


def export_config(output_path="config.json"):
    """Write the configuration JSON to the specified file."""
    with open(output_path, "w") as f:
        json.dump(CONFIG, f, indent=2)
    print(f"Configuration exported to {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Generate Xray VLESS config.json")
    parser.add_argument(
        "--export-only",
        action="store_true",
        help="Only export config.json and VLESS link, then exit",
    )
    parser.add_argument(
        "--output",
        default="config.json",
        help="Output path for config.json (default: config.json)",
    )
    args = parser.parse_args()

    export_config(args.output)
    print("\n✅ VLESS LINK:")
    print(get_vless_link())

    if args.export_only:
        return


if __name__ == "__main__":
    main()
