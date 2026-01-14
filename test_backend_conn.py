import requests
import sys

def test_connectivity():
    try:
        print("Testing Root Endpoint...")
        resp = requests.get("http://127.0.0.1:8000/")
        print(f"Root Status: {resp.status_code}")
        print(f"Root Content: {resp.text}")
    except Exception as e:
        print(f"Root Connectivity Failed: {e}")
        return

    try:
        print("\nTesting Token Endpoint...")
        # Simulating the exact request the frontend makes (form-urlencoded)
        data = {
            "username": "admin",
            "password": "password123"
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        resp = requests.post("http://127.0.0.1:8000/token", data=data, headers=headers)
        print(f"Token Status: {resp.status_code}")
        print(f"Token Content: {resp.text}")
    except Exception as e:
        print(f"Token Connectivity Failed: {e}")

if __name__ == "__main__":
    test_connectivity()
