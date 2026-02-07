import os
from dotenv import load_dotenv
from sentinelhub import SHConfig, BBox, CRS, SentinelHubRequest, DataCollection, MimeType
import numpy as np
from datetime import datetime, timedelta

load_dotenv()

CLIENT_ID = os.getenv("SENTINELHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("SENTINELHUB_CLIENT_SECRET")

config = SHConfig()
config.sh_client_id = CLIENT_ID
config.sh_client_secret = CLIENT_SECRET

EVALSCRIPT_NDVI = """
//VERSION=3
function setup() {
  return {
    input: ["B04", "B08"],
    output: { bands: 1, sampleType: "FLOAT32" }
  };
}
function evaluatePixel(sample) {
  let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
  return [ndvi];
}
"""

def get_ndvi(lat: float, lon: float) -> float:
    if not CLIENT_ID or not CLIENT_SECRET:
        raise RuntimeError("Sentinel Hub credentials missing in .env")

    # small bbox ~ ~1km area, adjust as needed
    delta = 0.01
    bbox = BBox(bbox=[lon - delta, lat - delta, lon + delta, lat + delta], crs=CRS.WGS84)

    # Use recent time window to get latest cloud-free data
    end = datetime.utcnow()
    start = end - timedelta(days=15)

    request = SentinelHubRequest(
        data_folder=None,
        evalscript=EVALSCRIPT_NDVI,
        input_data=[SentinelHubRequest.input_data(data_collection=DataCollection.SENTINEL2_L2A, time_interval=(start, end))],
        responses=[SentinelHubRequest.output_response("default", MimeType.TIFF)],
        bbox=bbox,
        size=(256, 256),
        config=config
    )

    data = request.get_data()
    if not data or len(data) == 0:
        return 0.0

    img = data[0].astype(float)
    # Remove NaNs and outliers
    valid = img[np.isfinite(img)]
    if valid.size == 0:
        return 0.0
    # Clip NDVI range [-1,1]
    valid = np.clip(valid, -1.0, 1.0)
    # Take robust mean
    return float(np.nanmedian(valid))