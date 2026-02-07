# AgroVision RT – Real-Time Crop Yield Prediction Platform

## Overview
AgroVision RT predicts crop yield in real time using:
- Sentinel-2 NDVI (Sentinel Hub API)
- OpenWeatherMap (temperature, rainfall, humidity)
- ML (scikit-learn) trained from Kaggle + data.gov.in datasets

Users select a location on a map and get:
- NDVI
- Current weather
- Crop health status
- Predicted yield (t/ha)
- Confidence score
- Historical charts and PDF report

## Stack
- Frontend: React, Material UI, react-leaflet, Chart.js
- Backend: FastAPI, Python
- ML: scikit-learn
- Satellite: Sentinel Hub (Process API)
- Weather: OpenWeatherMap
- DB: MongoDB

## Setup
1) Create `.env` at repo root: