import os
import time
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("AGROVISION_DB_NAME", "agrovision_rt")

client = MongoClient(MONGODB_URI) if MONGODB_URI else None
db = client[DB_NAME] if client is not None else None
collection = db["predictions"] if db is not None else None


def insert_record(record: dict):
    if collection is None:
        return
    record["timestamp"] = int(time.time()* 1000)
    collection.insert_one(record)


def find_history(lat=None, lon=None, limit=20):
    if collection is None:
        return []

    query = {}
    if lat is not None and lon is not None:
        query = {"lat": lat, "lon": lon}

    cursor = collection.find(query).sort("timestamp", -1).limit(limit)

    result = []
    for doc in cursor:
        result.append({
            "lat": doc.get("lat"),
            "lon": doc.get("lon"),
            "timestamp": int(doc.get("timestamp") / 1000) if doc.get("timestamp") else None,
            "ndvi": doc.get("ndvi"),
            "predicted_yield_tph": doc.get("prediction_tph"),
            "confidence": doc.get("confidence"),
            "health": doc.get("health"),
            "crop": doc.get("crop"),
            "season": doc.get("season"),
            "weather": {
                "temperature": doc.get("weather", {}).get("temperature"),
                "rainfall": doc.get("weather", {}).get("rainfall"),
                "humidity": doc.get("weather", {}).get("humidity"),
            }
        })

    return result
