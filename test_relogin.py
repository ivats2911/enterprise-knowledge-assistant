import requests

def test_relogin():
    print("1. Initial Login...")
    data = {"username": "admin", "password": "password123"}
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    
    try:
        resp = requests.post("http://127.0.0.1:8000/token", data=data, headers=headers)
        print(f"Login 1 Status: {resp.status_code}")
        if resp.status_code != 200:
            print(f"Login 1 Failed: {resp.text}")
            return
        token = resp.json()["access_token"]
        print("Login 1 Success.")
    except Exception as e:
        print(f"Login 1 Exception: {e}")
        return

    print("\n2. Simulating Logout (Client-side action)...")
    # In client, we clear headers. Here we just don't use the token for the next login request.
    
    print("\n3. Re-Login...")
    try:
        # Exact same request as before
        resp = requests.post("http://127.0.0.1:8000/token", data=data, headers=headers)
        print(f"Login 2 Status: {resp.status_code}")
        if resp.status_code != 200:
            print(f"Login 2 Failed: {resp.text}")
        else:
            print("Login 2 Success.")
    except Exception as e:
        print(f"Login 2 Exception: {e}")

if __name__ == "__main__":
    test_relogin()
