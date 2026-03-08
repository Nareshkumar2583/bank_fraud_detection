import joblib
import pandas as pd

# ==============================
# LOAD MODEL
# ==============================

model = joblib.load("fraud_model_xgboost.pkl")
features = joblib.load("model_features.pkl")

print("Model loaded successfully")
print("Features:", features)


# ==============================
# TEST TRANSACTIONS
# ==============================

transactions = [

    # 1️⃣ Normal transaction
    {
        "sender_id":101,
        "receiver_id":202,
        "amount":2500,
        "device_id":3,
        "location":2,
        "transaction_type":1,
        "hour":14,
        "txn_frequency":5,
        "user_avg_amount":3000,
        "amount_vs_avg":0.8,
        "device_change":0,
        "location_change":0,
        "merchant_category":2
    },

    # 2️⃣ Slightly suspicious
    {
        "sender_id":105,
        "receiver_id":300,
        "amount":20000,
        "device_id":8,
        "location":4,
        "transaction_type":2,
        "hour":1,
        "txn_frequency":20,
        "user_avg_amount":5000,
        "amount_vs_avg":4,
        "device_change":1,
        "location_change":1,
        "merchant_category":5
    },

    # 3️⃣ High fraud risk
    {
        "sender_id":120,
        "receiver_id":400,
        "amount":120000,
        "device_id":15,
        "location":8,
        "transaction_type":3,
        "hour":2,
        "txn_frequency":50,
        "user_avg_amount":4000,
        "amount_vs_avg":30,
        "device_change":1,
        "location_change":1,
        "merchant_category":7
    },

    # 4️⃣ Very high fraud risk
    {
        "sender_id":99,
        "receiver_id":999,
        "amount":300000,
        "device_id":22,
        "location":12,
        "transaction_type":3,
        "hour":1,
        "txn_frequency":80,
        "user_avg_amount":2000,
        "amount_vs_avg":150,
        "device_change":1,
        "location_change":1,
        "merchant_category":9
    }
]


# ==============================
# RUN TESTS
# ==============================

for i, txn in enumerate(transactions):

    df = pd.DataFrame([txn])

    df = df.reindex(columns=features, fill_value=0)

    prediction = model.predict(df)[0]
    probability = model.predict_proba(df)[0][1]

    print("\n==============================")
    print("Transaction Test:", i+1)
    print(txn)

    if prediction == 1:
        result = "FRAUD"
    else:
        result = "NORMAL"

    print("Prediction:", result)
    print("Fraud Probability:", probability)