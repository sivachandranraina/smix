"""
seed_db.py — Insert 10 realistic mock Sourashtra community users into smix_db.
Run: python seed_db.py
"""
import uuid
import hashlib
import os
from pymongo import MongoClient
import bcrypt

MONGO_URI = os.getenv("SMIX_MONGO_URI", "mongodb://localhost:27017/")
DB_NAME   = "smix_db"

# ---------------------------------------------------------------------------
# Mock data
# ---------------------------------------------------------------------------
MOCK_USERS = [
    {
        "email": "priya.sharma@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Priya Sharma",
            "age": 25,
            "gender": "Female",
            "bio": "Classical dancer and software engineer. Love cooking traditional Sourashtra recipes on weekends.",
            "location": "Chennai, Tamil Nadu",
            "gothram": "Kashyapa",
            "nakshatram": "Rohini",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Male",
            "min_age_preference": 24,
            "max_age_preference": 32,
        },
    },
    {
        "email": "arjun.patel@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Arjun Patel",
            "age": 28,
            "gender": "Male",
            "bio": "Civil engineer who loves trekking Nilgiris. Family-oriented and proud of our heritage.",
            "location": "Madurai, Tamil Nadu",
            "gothram": "Bharadwaja",
            "nakshatram": "Ashwini",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Female",
            "min_age_preference": 22,
            "max_age_preference": 28,
        },
    },
    {
        "email": "meera.desai@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Meera Desai",
            "age": 27,
            "gender": "Female",
            "bio": "Doctor at Government Hospital. Passionate about community service and Carnatic music.",
            "location": "Coimbatore, Tamil Nadu",
            "gothram": "Vasishta",
            "nakshatram": "Krittika",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Male",
            "min_age_preference": 26,
            "max_age_preference": 34,
        },
    },
    {
        "email": "kiran.mehta@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Kiran Mehta",
            "age": 30,
            "gender": "Male",
            "bio": "Chartered accountant. Avid reader and occasional marathoner looking for a life partner.",
            "location": "Bangalore, Karnataka",
            "gothram": "Gautama",
            "nakshatram": "Pushya",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Female",
            "min_age_preference": 24,
            "max_age_preference": 30,
        },
    },
    {
        "email": "divya.rao@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Divya Rao",
            "age": 24,
            "gender": "Female",
            "bio": "MBA grad working in marketing. Loves Bharatanatyam and cooking for family gatherings.",
            "location": "Mysore, Karnataka",
            "gothram": "Koundinya",
            "nakshatram": "Chitra",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Male",
            "min_age_preference": 25,
            "max_age_preference": 33,
        },
    },
    {
        "email": "vikram.nair@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Vikram Nair",
            "age": 32,
            "gender": "Male",
            "bio": "Software architect at a startup. Weekend cricket enthusiast and devoted son.",
            "location": "Pune, Maharashtra",
            "gothram": "Vishwamitra",
            "nakshatram": "Shravana",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Female",
            "min_age_preference": 25,
            "max_age_preference": 31,
        },
    },
    {
        "email": "ananya.krishna@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Ananya Krishna",
            "age": 26,
            "gender": "Female",
            "bio": "School teacher with a love for literature and travel. Strong community values.",
            "location": "Salem, Tamil Nadu",
            "gothram": "Jamadagni",
            "nakshatram": "Magha",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Male",
            "min_age_preference": 26,
            "max_age_preference": 35,
        },
    },
    {
        "email": "rahul.gupta@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Rahul Gupta",
            "age": 29,
            "gender": "Male",
            "bio": "Product manager at a tech company. Foodie, traveller and learning Veena in spare time.",
            "location": "Hyderabad, Telangana",
            "gothram": "Srivatsa",
            "nakshatram": "Vishakha",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Female",
            "min_age_preference": 23,
            "max_age_preference": 29,
        },
    },
    {
        "email": "kavitha.subramanian@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Kavitha Subramanian",
            "age": 23,
            "gender": "Female",
            "bio": "Final year medical student. Traditional at heart but modern in outlook.",
            "location": "Trichy, Tamil Nadu",
            "gothram": "Atri",
            "nakshatram": "Anuradha",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Male",
            "min_age_preference": 24,
            "max_age_preference": 30,
        },
    },
    {
        "email": "suresh.iyer@smix.dev",
        "password": "Test@1234",
        "profile": {
            "full_name": "Suresh Iyer",
            "age": 31,
            "gender": "Male",
            "bio": "Government officer with a passion for photography and Kolam art. Homely and sincere.",
            "location": "Tirunelveli, Tamil Nadu",
            "gothram": "Kashyapa",
            "nakshatram": "Hasta",
            "photos": [],
        },
        "preferences": {
            "target_gender_interest": "Female",
            "min_age_preference": 24,
            "max_age_preference": 30,
        },
    },
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def pre_hash(password: str) -> str:
    """Mirrors auth.py pre_hash — SHA-256 before bcrypt."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(pre_hash(password).encode(), bcrypt.gensalt()).decode()

# ---------------------------------------------------------------------------
# Seed
# ---------------------------------------------------------------------------
def seed():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]

    inserted = 0
    skipped  = 0

    for u in MOCK_USERS:
        if db.users.find_one({"email": u["email"]}):
            print(f"  ⏭  Skipping {u['email']} — already exists")
            skipped += 1
            continue

        doc = {
            "id":              str(uuid.uuid4()),
            "email":           u["email"],
            "hashed_password": hash_password(u["password"]),
            "profile":         u["profile"],
            "preferences":     u["preferences"],
            "liked_users":     [],
            "passed_users":    [],
            "matches":         [],
        }
        db.users.insert_one(doc)
        print(f"  ✅ Inserted {u['profile']['full_name']} ({u['email']})")
        inserted += 1

    print(f"\n🎉 Done! {inserted} users inserted, {skipped} skipped.")
    client.close()

if __name__ == "__main__":
    print("Seeding SMIX database with mock Sourashtra users...\n")
    seed()
