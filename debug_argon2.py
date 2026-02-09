from api.auth import verify_password, get_password_hash
import time

def stress_test_argon2():
    print("Starting Argon2 Stress Test...")
    password = "password123"
    hashed = get_password_hash(password)
    print(f"Hash: {hashed}")
    
    for i in range(1, 21):
        try:
            print(f"Iteration {i}...", end="", flush=True)
            verify_password(password, hashed)
            print(" OK")
        except Exception as e:
            print(f" FAILED: {e}")
            break
        # time.sleep(0.1)

if __name__ == "__main__":
    stress_test_argon2()
