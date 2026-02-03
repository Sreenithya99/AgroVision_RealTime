import os
import pickle
import numpy as np
from dotenv import load_dotenv

load_dotenv()
LR_PATH = os.getenv("MODEL_PRIMARY_PATH", "ml_model/models/crop_yield_lr.pkl")
RF_PATH = os.getenv("MODEL_RF_PATH", "ml_model/models/crop_yield_rf.pkl")

_lr = None
_rf = None

def _load_models():
    global _lr, _rf
    if _lr is None and os.path.exists(LR_PATH):
        with open(LR_PATH, "rb") as f:
            _lr = pickle.load(f)
    if _rf is None and os.path.exists(RF_PATH):
        with open(RF_PATH, "rb") as f:
            _rf = pickle.load(f)

def _health_from_ndvi(ndvi: float):
    if ndvi >= 0.6:
        return "Good"
    elif ndvi >= 0.3:
        return "Moderate"
    else:
        return "Poor"

def _confidence_from_rf(features_vector: np.ndarray):
    # If RF is available, use variance across estimators as uncertainty proxy
    if _rf is None or not hasattr(_rf, "estimators_"):
        # Fallback heuristic: NDVI-driven confidence
        ndvi = float(features_vector[0])
        return float(max(0.3, min(0.95, 0.5 + (ndvi - 0.3))))  # simple scaling

    preds = np.array([tree.predict(features_vector.reshape(1, -1))[0] for tree in _rf.estimators_])
    std = float(np.std(preds))
    # Convert std to confidence (lower std => higher confidence)
    conf = 1.0 / (1.0 + std)
    return float(max(0.4, min(0.98, conf)))

def predict_yield(features: dict):
    _load_models()
    X = np.array([features["ndvi"], features["temperature"], features["rainfall"], features["humidity"]], dtype=float)

    if _lr is None:
        # If model missing, use a basic heuristic to avoid breaking
        base = 2.0 + 10.0 * features["ndvi"]
        adj_temp = 1.0 + max(0.0, (features["temperature"] - 10.0) / 40.0)
        adj_hum = 1.0 + max(0.0, features["humidity"] / 200.0)
        pred = base * adj_temp * adj_hum
    else:
        pred = float(_lr.predict(X.reshape(1, -1))[0])

    confidence = _confidence_from_rf(X)
    health = _health_from_ndvi(features["ndvi"])
    return float(max(0.0, pred)), confidence, health