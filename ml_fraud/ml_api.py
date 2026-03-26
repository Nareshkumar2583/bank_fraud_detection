from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import joblib
import hashlib
from fastapi.middleware.cors import CORSMiddleware

# =========================
# LOAD MODEL + FEATURES
# =========================
model = joblib.load("fraud_model_xgboost.pkl")
features = joblib.load("model_features.pkl")

app = FastAPI(title="Fraud Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# REQUEST MODEL
# =========================
class Transaction(BaseModel):
    sender_id: Optional[str] = "0"
    device_id: Optional[str] = "DEV_0"
    location: Optional[str] = "Mumbai"
    transaction_type: Optional[str] = "UPI"

    amount: Optional[float] = 0.0
    txn_frequency: Optional[int] = 1
    user_avg_amount: Optional[float] = 1000.0
    amount_vs_avg: Optional[float] = 1.0

    device_change: Optional[int] = 0
    location_change: Optional[int] = 0
    txn_gap: Optional[float] = 0.0

    rule_score: Optional[int] = 0


# =========================
# STABLE HASH FUNCTION
# =========================
def stable_hash(val, mod):
    return int(hashlib.md5(str(val).encode()).hexdigest(), 16) % mod


# =========================
# PREDICT ENDPOINT
# =========================
@app.post("/predict")
def predict(txn: Transaction):

    input_data = txn.dict()

    # =========================
    # SAFE DEFAULTS
    # =========================
    sender = input_data.get("sender_id") or "0"
    device = input_data.get("device_id") or "DEV_0"
    location = input_data.get("location") or "Mumbai"
    txn_type = input_data.get("transaction_type") or "UPI"

    # =========================
    # ENCODING (MATCH TRAINING)
    # =========================
    input_data["sender_id"] = stable_hash(sender, 1000)
    input_data["device_id"] = stable_hash(device, 1000)
    input_data["location"] = stable_hash(location, 100)
    input_data["transaction_type"] = 1 if txn_type == "UPI" else 0

    # =========================
    # DERIVED FEATURES
    # =========================
    input_data["hour"] = pd.Timestamp.now().hour
    input_data["merchant_category"] = 0  # default

    # =========================
    # CREATE DATAFRAME
    # =========================
    df = pd.DataFrame([input_data])
    df = df.reindex(columns=features, fill_value=0)

    print("📊 Model Input:", df.iloc[0].to_dict())

    # =========================
    # PREDICTION
    # =========================
    probs = model.predict_proba(df)[0]
    raw_prob = float(probs[1])

    # 🔥 BALANCED SCALING (BEST)
    fraud_prob = 0.05 + (raw_prob * 0.9)

    # clamp range
    fraud_prob = max(0.01, min(fraud_prob, 0.99))

    print("🔍 Raw:", raw_prob, "| Adjusted:", fraud_prob)

    # =========================
    # DECISION (3 LEVEL)
    # =========================
    if fraud_prob > 0.7:
        prediction = "FRAUD"
    elif fraud_prob > 0.3:
        prediction = "SUSPICIOUS"
    else:
        prediction = "NORMAL"

    return {
        "fraud_probability": round(fraud_prob, 4),
        "prediction": prediction,
        "risk_level": prediction
    }