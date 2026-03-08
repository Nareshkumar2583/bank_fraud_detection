from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import joblib

# ==========================
# LOAD MODEL
# ==========================

model = joblib.load("fraud_model_randomforest.pkl")
features = joblib.load("model_features.pkl")

app = FastAPI(title="Fraud Detection ML API")


# ==========================
# REQUEST MODEL
# ==========================

class Transaction(BaseModel):

    sender_id: int
    amount: float
    device_id: int
    location: int
    transaction_type: int
    hour: int
    txn_frequency: int
    user_avg_amount: float
    amount_vs_avg: float
    device_change: int
    location_change: int
    merchant_category: int
    txn_gap: int
    rule_score: int


# ==========================
# PREDICT API
# ==========================

@app.post("/predict")
def predict(transaction: Transaction):

    data = pd.DataFrame([transaction.dict()])

    data = data.reindex(columns=features, fill_value=0)

    prediction = model.predict(data)[0]
    probability = model.predict_proba(data)[0][1]

    return {
        "fraud_probability": float(probability),
        "prediction": "FRAUD" if prediction == 1 else "NORMAL"
    }