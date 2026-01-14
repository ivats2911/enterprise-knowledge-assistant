from sqlmodel import Session, select
from data.database import engine
from data.models import User
from api.auth import verify_password, get_password_hash

def debug_auth():
    print("Connecting to database...")
    with Session(engine) as session:
        user = session.get(User, "admin")
        if not user:
            print("User 'admin' not found!")
            return

        print(f"User found: {user.username}")
        print(f"Stored Hash: {user.hashed_password}")

        password = "password123"
        is_valid = verify_password(password, user.hashed_password)
        print(f"Verifying '{password}': {is_valid}")

        if not is_valid:
            print("Password invalid! Resetting password...")
            new_hash = get_password_hash(password)
            user.hashed_password = new_hash
            session.add(user)
            session.commit()
            print(f"Password reset for 'admin'. New hash: {new_hash}")
            
            # Verify again
            is_valid_now = verify_password(password, new_hash)
            print(f"Re-verifying: {is_valid_now}")
        else:
            print("Password is correct. No changes needed.")

if __name__ == "__main__":
    debug_auth()
