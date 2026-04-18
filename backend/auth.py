from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import os
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-smix-sourashtra-key") # In production use real env var
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week expiration for beta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

import hashlib

def _pre_hash(password: str) -> str:
    # Hash password with SHA-256 first to guarantee it is exactly 64 characters
    # and bypass Bcrypt's 72-byte native limitation safely.
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(_pre_hash(plain_password), hashed_password)

def get_password_hash(password):
    return pwd_context.hash(_pre_hash(password))

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user_id(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
    return user_id
