import os
from pymongo import MongoClient
import shutil

# Configuration
MONGO_URI = os.getenv("SMIX_MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "smix_db"
UPLOADS_DIR = "static/uploads"

def cleanup():
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    try:
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        
        # Drop the users collection entirely
        db.users.drop()
        print("✅ Successfully dropped the 'users' collection.")
        
        # Clear the static/uploads directory to remove orphaned pictures
        if os.path.exists(UPLOADS_DIR):
            print("Cleaning up uploaded images...")
            for filename in os.listdir(UPLOADS_DIR):
                file_path = os.path.join(UPLOADS_DIR, filename)
                try:
                    if os.path.isfile(file_path):
                        os.unlink(file_path)
                except Exception as e:
                    print(f"Failed to delete {file_path}. Reason: {e}")
            print("✅ Successfully cleared static/uploads directory.")
            
        print("\n🎉 Database cleanup complete! You can now start fresh.")
        
    except Exception as e:
        print(f"❌ Error connecting to or cleaning MongoDB: {e}")
        
if __name__ == "__main__":
    confirm = input("⚠️ WARNING: This will permanently delete all users and uploaded photos. Type 'yes' to confirm: ")
    if confirm.lower() == 'yes':
        cleanup()
    else:
        print("Cleanup aborted.")
