from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File
from typing import Annotated
import os
import shutil
import uuid

from auth import get_current_user_id
from models import UserProfile, UserPreferences

router = APIRouter(prefix="/users", tags=["users"])

async def _fetch_profiles_by_ids(db, ids: list) -> list:
    """Fetch profile details for a list of user IDs."""
    if not ids:
        return []
    profiles = []
    cursor = db.users.find({"id": {"$in": ids}})
    async for u in cursor:
        if "profile" in u:
            data = u["profile"].copy()
            data["id"] = u["id"]
            profiles.append(data)
    return profiles


@router.get("/profile", response_model=UserProfile)
async def get_my_profile(request: Request, user_id: str = Depends(get_current_user_id)):
    db = request.app.db
    user_dict = await db.users.find_one({"id": user_id})
    if not user_dict:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_dict.get("profile", {})

@router.put("/profile", response_model=UserProfile)
async def update_my_profile(profile: UserProfile, request: Request, user_id: str = Depends(get_current_user_id)):
    db = request.app.db
    
    # Exclude unset fields if you only want partial updates, but currently we just replace profile
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"profile": profile.model_dump(exclude_unset=True)}}
    )
    
    # Fetch updated
    updated_user = await db.users.find_one({"id": user_id})
    return updated_user.get("profile", {})

@router.get("/preferences", response_model=UserPreferences)
async def get_my_preferences(request: Request, user_id: str = Depends(get_current_user_id)):
    db = request.app.db
    user_dict = await db.users.find_one({"id": user_id})
    if not user_dict:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user_dict.get("preferences", {})

@router.put("/preferences", response_model=UserPreferences)
async def update_my_preferences(preferences: UserPreferences, request: Request, user_id: str = Depends(get_current_user_id)):
    db = request.app.db
    
    await db.users.update_one(
        {"id": user_id},
        {"$set": {"preferences": preferences.model_dump(exclude_unset=True)}}
    )
    
    # Fetch updated
    updated_user = await db.users.find_one({"id": user_id})
    return updated_user.get("preferences", {})

@router.post("/upload_photo")
async def upload_photo(file: UploadFile = File(...), user_id: str = Depends(get_current_user_id)):
    extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{extension}"
    filepath = os.path.join("static/uploads", filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"http://127.0.0.1:8000/static/uploads/{filename}"
    return {"url": file_url}

@router.get("/discover")
async def get_discover_profiles(request: Request, user_id: str = Depends(get_current_user_id)):
    db = request.app.db
    current_user = await db.users.find_one({"id": user_id})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    preferences = current_user.get("preferences", {})
    profile = current_user.get("profile", {})
    target_gender = preferences.get("target_gender_interest", "Both")
    min_age = preferences.get("min_age_preference", 18)
    max_age = preferences.get("max_age_preference", 100)

    # Basic Match Query
    liked = current_user.get("liked_users", [])
    passed = current_user.get("passed_users", [])
    swiped = liked + passed + [user_id]
    
    query = {"id": {"$nin": swiped}} # Exclude swiped users and self
    
    if target_gender != "Both":
        query["profile.gender"] = target_gender
        
    query["profile.age"] = {"$gte": min_age, "$lte": max_age}

    # In a real app we'd paginate, sort by distance, compute gothram matches etc.
    cursor = db.users.find(query).limit(50)
    
    discover_list = []
    async for u in cursor:
        if "profile" in u:
            # Send back necessary data
            match_data = u["profile"]
            match_data["id"] = u["id"]
            discover_list.append(match_data)
            
    return discover_list

@router.post("/like/{target_id}")
async def like_user(target_id: str, request: Request, user_id: str = Depends(get_current_user_id)):
    db = request.app.db
    
    # Add to liked_users
    await db.users.update_one(
        {"id": user_id},
        {"$addToSet": {"liked_users": target_id}}
    )
    
    # Check for match (does the target_id also like us?)
    target_user = await db.users.find_one({"id": target_id})
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found")
        
    if user_id in target_user.get("liked_users", []):
        # Mutual match!
        await db.users.update_one({"id": user_id}, {"$addToSet": {"matches": target_id}})
        await db.users.update_one({"id": target_id}, {"$addToSet": {"matches": user_id}})
        return {"match": True, "message": "It's a match!"}
        
    return {"match": False}

@router.post("/pass/{target_id}")
async def pass_user(target_id: str, request: Request, user_id: str = Depends(get_current_user_id)):
    db = request.app.db
    await db.users.update_one(
        {"id": user_id},
        {"$addToSet": {"passed_users": target_id}}
    )
    return {"success": True}

@router.get("/activity")
async def get_my_activity(request: Request, user_id: str = Depends(get_current_user_id)):
    """Return the current user's matches, liked profiles, and passed profiles."""
    db = request.app.db
    me = await db.users.find_one({"id": user_id})
    if not me:
        raise HTTPException(status_code=404, detail="User not found")

    liked_ids   = me.get("liked_users",  [])
    passed_ids  = me.get("passed_users", [])
    match_ids   = me.get("matches",      [])

    matches, liked, passed = await _fetch_profiles_by_ids(db, match_ids), \
                             await _fetch_profiles_by_ids(db, liked_ids), \
                             await _fetch_profiles_by_ids(db, passed_ids)

    return {
        "matches": matches,
        "liked":   liked,
        "passed":  passed,
    }

@router.post("/unlike/{target_id}")
async def unlike_user(target_id: str, request: Request, user_id: str = Depends(get_current_user_id)):
    """Move a profile from liked → passed, removing any existing match on both sides."""
    db = request.app.db
    await db.users.update_one(
        {"id": user_id},
        {
            "$pull":     {"liked_users": target_id, "matches": target_id},
            "$addToSet": {"passed_users": target_id},
        }
    )
    # Remove from target's matches list too (unmatch is mutual)
    await db.users.update_one(
        {"id": target_id},
        {"$pull": {"matches": user_id}}
    )
    return {"success": True}

@router.post("/unpass/{target_id}")
async def unpass_user(target_id: str, request: Request, user_id: str = Depends(get_current_user_id)):
    """Move a profile from passed → liked, and check for mutual match."""
    db = request.app.db
    # Remove from passed, add to liked
    await db.users.update_one(
        {"id": user_id},
        {
            "$pull":     {"passed_users": target_id},
            "$addToSet": {"liked_users":  target_id},
        }
    )
    # Check if target also likes us → create match
    target = await db.users.find_one({"id": target_id})
    if target and user_id in target.get("liked_users", []):
        await db.users.update_one({"id": user_id},    {"$addToSet": {"matches": target_id}})
        await db.users.update_one({"id": target_id},  {"$addToSet": {"matches": user_id}})
        return {"success": True, "match": True}
    return {"success": True, "match": False}

@router.post("/unmatch/{target_id}")
async def unmatch_user(target_id: str, request: Request, user_id: str = Depends(get_current_user_id)):
    """Remove a mutual match and move the target to passed for the current user."""
    db = request.app.db
    await db.users.update_one(
        {"id": user_id},
        {
            "$pull":     {"matches": target_id},
            "$addToSet": {"passed_users": target_id},
        }
    )
    # Remove from target's matches too
    await db.users.update_one(
        {"id": target_id},
        {"$pull": {"matches": user_id}}
    )
    return {"success": True}
