from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# Basic Authentication Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Profile Models
class UserProfile(BaseModel):
    full_name: Optional[str] = None
    age: Optional[int] = Field(None, ge=18, le=100)
    gender: Optional[str] = None # "Male", "Female", "Other"
    bio: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = None # e.g. "Chennai", "Bangalore"
    
    # Community specifics (Sourashtra)
    gothram: Optional[str] = None
    nakshatram: Optional[str] = None
    family_origin: Optional[str] = None
    
    # Media
    photos: List[str] = [] # Array of image urls

# Preference Models
class UserPreferences(BaseModel):
    target_gender_interest: Optional[str] = None # "Male", "Female", "Both"
    min_age_preference: Optional[int] = Field(18, ge=18)
    max_age_preference: Optional[int] = Field(99, le=100)
    max_distance_km: Optional[int] = Field(None, description="Maximum distance in km. Optional.")
    
# Combined User Schema (Stored in DB)
class UserInDB(BaseModel):
    id: str # Assigned when inserting into MongoDB
    email: EmailStr
    hashed_password: str
    profile: UserProfile = UserProfile()
    preferences: UserPreferences = UserPreferences()
    liked_users: List[str] = []
    passed_users: List[str] = []
    matches: List[str] = []
