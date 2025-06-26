import os
import requests
from requests.auth import HTTPDigestAuth
from dotenv import load_dotenv
load_dotenv()
ATLAS_GROUP_ID    = os.environ["ATLAS_GROUP_ID"]
ATLAS_PUBLIC_KEY  = os.environ["ATLAS_PUBLIC_KEY"]
ATLAS_PRIVATE_KEY = os.environ["ATLAS_PRIVATE_KEY"]
def get_current_ip():
    response = requests.get("https://api.ipify.org")
    response.raise_for_status()
    return response.text.strip()
def whitelist_ip(ip):
    url = (
        f"https://cloud.mongodb.com/api/atlas/v1.0"
        f"/groups/{ATLAS_GROUP_ID}/accessList"
    )
    payload = [{"ipAddress": ip, "comment": "PythonAnywhere"}]
    auth = HTTPDigestAuth(ATLAS_PUBLIC_KEY, ATLAS_PRIVATE_KEY)
    r = requests.post(url, auth=auth, json=payload)
    if r.status_code in (200, 201):
        print(f"✅ Whitelisted {ip}")
    else:
        print("Error:", r.status_code, r.text)
        r.raise_for_status()
if __name__ == "__main__":
    ip = get_current_ip()
    print("Your current public IP is", ip)
    whitelist_ip(ip)