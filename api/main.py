from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List
from contextlib import asynccontextmanager
import shutil
import os

from data.database import create_db_and_tables, engine
from data.models import Gym, Asset, MaintenanceLog, User
from rag.rag_service import rag_service

from fastapi.middleware.cors import CORSMiddleware
from api.auth import get_password_hash, verify_password, create_access_token, get_current_active_user, ACCESS_TOKEN_EXPIRE_MINUTES

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    # Create default user
    with Session(engine) as session:
        user = session.get(User, "admin")
        if not user:
            user = User(username="admin", hashed_password=get_password_hash("password123"))
            session.add(user)
            session.commit()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_session():
    with Session(engine) as session:
        yield session

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.get(User, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/")
def read_root():
    return {"message": "Enterprise Knowledge Assistant API"}

# Gym Endpoints
@app.post("/gyms/", response_model=Gym)
def create_gym(gym: Gym, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    session.add(gym)
    session.commit()
    session.refresh(gym)
    return gym

@app.get("/gyms/", response_model=List[Gym])
def read_gyms(session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    gyms = session.exec(select(Gym)).all()
    return gyms

@app.get("/gyms/{gym_id}", response_model=Gym)
def read_gym(gym_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    gym = session.get(Gym, gym_id)
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    return gym

# Asset Endpoints
@app.post("/assets/", response_model=Asset)
def create_asset(asset: Asset, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    session.add(asset)
    session.commit()
    session.refresh(asset)
    return asset

@app.get("/assets/", response_model=List[Asset])
def read_assets(session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    assets = session.exec(select(Asset)).all()
    return assets

@app.get("/gyms/{gym_id}/assets/", response_model=List[Asset])
def read_assets_by_gym(gym_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    assets = session.exec(select(Asset).where(Asset.gym_id == gym_id)).all()
    return assets

@app.put("/assets/{asset_id}", response_model=Asset)
def update_asset(asset_id: int, asset_data: Asset, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    asset = session.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    asset_dict = asset_data.model_dump(exclude_unset=True)
    # Prevent overwriting id or gym_id unintentionally if not careful, though validation handles types.
    # We should exclude id from update data usually, but Pydantic handles this if we map correctly.
    # For simplicity, we update fields present.
    for key, value in asset_dict.items():
        if key != "id": # Protect ID
            setattr(asset, key, value)
            
    session.add(asset)
    session.commit()
    session.refresh(asset)
    return asset

@app.delete("/assets/{asset_id}")
def delete_asset(asset_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    asset = session.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    session.delete(asset)
    session.commit()
    return {"ok": True}

# Maintenance Endpoints
@app.post("/assets/{asset_id}/maintenance/", response_model=MaintenanceLog)
def create_maintenance_log(asset_id: int, log: MaintenanceLog, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    # Ensure asset exists
    asset = session.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    log.asset_id = asset_id
    session.add(log)
    session.commit()
    session.refresh(log)
    return log

@app.get("/assets/{asset_id}/maintenance/", response_model=List[MaintenanceLog])
def read_maintenance_logs(asset_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    logs = session.exec(select(MaintenanceLog).where(MaintenanceLog.asset_id == asset_id)).all()
    return logs

# RAG Integration Endpoints
@app.post("/assets/{asset_id}/manual/")
async def upload_manual(asset_id: int, file: UploadFile = File(...), session: Session = Depends(get_session), current_user: User = Depends(get_current_active_user)):
    asset = session.get(Asset, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # Save file
    os.makedirs("data/manuals", exist_ok=True)
    file_path = f"data/manuals/{asset_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Ingest
    try:
        num_chunks = rag_service.ingest_file(file_path, metadata={"asset_id": asset_id, "asset_name": asset.name})
        return {"filename": file.filename, "message": f"Manual processed. Created {num_chunks} chunks."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query/")
def query_knowledge_base(question: str, current_user: User = Depends(get_current_active_user)):
    try:
        answer = rag_service.query(question)
        return {"question": question, "answer": answer}
    except Exception as e:
        # Catch errors (e.g. OpenAI API key missing)
        return {"question": question, "answer": f"Error: {str(e)}"}
