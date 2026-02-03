import os
import requests
from dotenv import load_dotenv

load_dotenv()
OWM_API_KEY = os.getenv("OPENWEATHER_API_KEY")

def get_weather(lat: float, lon: float):
    if not OWM_API_KEY:
        raise RuntimeError("OPENWEATHER_API_KEY missing")
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OWM_API_KEY}&units=metric"
    r = requests.get(url, timeout=15)
    r.raise_for_status()
    data = r.json()

    # Weather fields
    temp = data.get("main", {}).get("temp", 0.0)
    humidity = data.get("main", {}).get("humidity", 0.0)
    # Approx rainfall in last hour/day (if present)
    rain_1h = data.get("rain", {}).get("1h", 0.0)
    rain_3h = data.get("rain", {}).get("3h", 0.0)
    rainfall = rain_1h if rain_1h else rain_3h

    return {"temperature": float(temp), "humidity": float(humidity), "rainfall": float(rainfall or 0.0)}