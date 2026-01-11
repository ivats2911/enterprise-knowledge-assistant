from typing import Optional
from sqlmodel import Field, SQLModel, Relationship

class Gym(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    location: str

class Asset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    type: str
    purchase_date: Optional[str] = None
    notes: Optional[str] = None
    
    gym_id: Optional[int] = Field(default=None, foreign_key="gym.id")

class MaintenanceLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    asset_id: int = Field(foreign_key="asset.id")
    date: str
    description: str
    cost: Optional[float] = None
    technician: Optional[str] = None

class User(SQLModel, table=True):
    username: str = Field(primary_key=True)
    hashed_password: str
    disabled: bool = False
