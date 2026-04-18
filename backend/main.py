import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient

# Routers
from routes import auth_routes, user_routes

app = FastAPI(
    title="SMIX - Sourashtra Dating App API",
    description="Backend API for SMIX - Sourashtra Community Dating Platform",
    version="1.0.0"
)

# CORS setup to allow Next/React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Configuration
MONGO_DETAILS = os.getenv("SMIX_MONGO_URI", "mongodb://localhost:27017/")
client = AsyncIOMotorClient(MONGO_DETAILS)
app.db = client.smix_db

# Mount static image uploads
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.on_event("startup")
async def startup_db_client():
    # Verify the database connection on startup
    try:
        await client.admin.command('ping')
        print("Connected to MongoDB successfully!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Include Routers
app.include_router(auth_routes.router)
app.include_router(user_routes.router)

@app.get("/")
async def root():
    return {"message": "Welcome to SMIX API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
