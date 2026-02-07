import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import pickle
import os

DATA_KAGGLE = "dataset/kaggle_data.csv"
DATA_GOV = "dataset/gov_data.csv"
OUT_LR = "ml_model/models/crop_yield_lr.pkl"
OUT_RF = "ml_model/models/crop_yield_rf.pkl"

def load_and_prepare():
    # Expect columns: ndvi, temperature, rainfall, humidity, yield_tph
    k = pd.read_csv(DATA_KAGGLE)
    g = pd.read_csv(DATA_GOV)
    df = pd.concat([k, g], ignore_index=True)

    needed = ["ndvi", "temperature", "rainfall", "humidity", "yield_tph"]
    missing = [c for c in needed if c not in df.columns]
    if missing:
        raise RuntimeError(f"Missing columns in dataset: {missing}")

    # Clean
    df = df.dropna(subset=needed)
    df = df[(df["ndvi"] >= -1) & (df["ndvi"] <= 1)]
    # Clip outliers
    df["temperature"] = df["temperature"].clip(-10, 50)
    df["humidity"] = df["humidity"].clip(0, 100)
    df["rainfall"] = df["rainfall"].clip(0, 500)
    df["yield_tph"] = df["yield_tph"].clip(0, None)

    X = df[["ndvi", "temperature", "rainfall", "humidity"]].values.astype(float)
    y = df["yield_tph"].values.astype(float)
    return X, y

def train_and_save():
    X, y = load_and_prepare()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    lr = LinearRegression()
    lr.fit(X_train, y_train)
    y_pred_lr = lr.predict(X_test)
    print("LR R2:", r2_score(y_test, y_pred_lr), "MAE:", mean_absolute_error(y_test, y_pred_lr))

    # Save LR
    os.makedirs(os.path.dirname(OUT_LR), exist_ok=True)
    with open(OUT_LR, "wb") as f:
        pickle.dump(lr, f)

    # Optional RF
    rf = RandomForestRegressor(n_estimators=120, random_state=42)
    rf.fit(X_train, y_train)
    y_pred_rf = rf.predict(X_test)
    print("RF R2:", r2_score(y_test, y_pred_rf), "MAE:", mean_absolute_error(y_test, y_pred_rf))

    with open(OUT_RF, "wb") as f:
        pickle.dump(rf, f)

if __name__ == "__main__":
    train_and_save()