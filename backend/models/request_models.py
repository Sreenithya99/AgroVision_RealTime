from pydantic import BaseModel
from typing import Optional

class PredictRequest(BaseModel):
    lat: float
    lon: float
    crop: Optional[str] = None
    season: Optional[str] = None

class NDVIResponse(BaseModel):
    ndvi: float

class WeatherResponse(BaseModel):
    temperature: float
    rainfall: float
    humidity: float

class PredictResponse(BaseModel):
    ndvi: float
    weather: WeatherResponse
    predicted_yield_tph: float
    confidence: float
    health_status: str

class HistoryItem(BaseModel):
    lat: float
    lon: float
    timestamp: Optional[int] = None
    ndvi: float
    predicted_yield_tph: float
    confidence: float
    health: str
    crop: Optional[str]
    season: Optional[str]
    weather: WeatherResponse