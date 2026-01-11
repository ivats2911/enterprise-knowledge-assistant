from sqlmodel import Session, select
from data.database import engine, create_db_and_tables
from data.models import User
from api.auth import get_password_hash, verify_password

def debug_user():
    # Ensure tables exist
    create_db_and_tables()
    
    with Session(engine) as session:
        user = session.get(User, "admin")
        if not user:
            print("User 'admin' not found. Creating...")
            user = User(username="admin", hashed_password=get_password_hash("password123"))
            session.add(user)
            session.commit()
            print("User 'admin' created with password 'password123'")
        else:
            print("User 'admin' found.")
            # Verify password
            try:
                if verify_password("password123", user.hashed_password):
                    print("Password verification PASSED.")
                else:
                    raise Exception("Mismatch")
            except Exception as e:
                print(f"Password verification/Algorithm failed ({e}). Resetting to Argon2...")
                user.hashed_password = get_password_hash("password123")
                session.add(user)
                session.commit()
                print("Password reset to 'password123' (Argon2)")

if __name__ == "__main__":
    debug_user()
