from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List, Optional
import os
from backend.models.request_models import PredictRequest, PredictResponse, NDVIResponse, WeatherResponse, HistoryItem
from backend.services.weather import get_weather
from satellite.ndvi import get_ndvi
from backend.services.prediction import predict_yield
from backend.services.db import insert_record, find_history

load_dotenv()

app = FastAPI(title="AgroVision RT – Real-Time Crop Yield Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ndvi", response_model=NDVIResponse)
def ndvi(lat: float, lon: float):
    try:
        ndvi_value = get_ndvi(lat, lon)
        return NDVIResponse(ndvi=ndvi_value)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/weather", response_model=WeatherResponse)
def weather(lat: float, lon: float):
    try:
        w = get_weather(lat, lon)
        return WeatherResponse(
            temperature=w["temperature"],
            rainfall=w["rainfall"],
            humidity=w["humidity"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    try:
        ndvi_value = get_ndvi(req.lat, req.lon)
        w = get_weather(req.lat, req.lon)

        # Build feature vector
        features = {
            "ndvi": ndvi_value,
            "temperature": w["temperature"],
            "rainfall": w["rainfall"],
            "humidity": w["humidity"],
        }

        prediction_tph, confidence, health = predict_yield(features)

        record = {
            "lat": req.lat,
            "lon": req.lon,
            "ndvi": ndvi_value,
            "weather": w,
            "prediction_tph": prediction_tph,
            "confidence": confidence,
            "health": health,
            "crop": req.crop,
            "season": req.season,
        }
        insert_record(record)

        return PredictResponse(
            ndvi=ndvi_value,
            weather=w,
            predicted_yield_tph=prediction_tph,
            confidence=confidence,
            health_status=health
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[HistoryItem])
def history(lat: Optional[float] = None, lon: Optional[float] = None, limit: int = 20):
    try:
        items = find_history(lat=lat, lon=lon, limit=limit)
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))