# 💳 Digital Banking Fraud Detection System

## 📌 Overview

This project is a **real-time fraud detection system** that combines:

* ✅ Rule-Based Detection
* 🤖 Machine Learning Model (Random Forest / XGBoost)
* ⚡ FastAPI (ML Microservice)
* ☕ Spring Boot Backend
* 🎨 React + Tailwind Dashboard

It simulates banking transactions and detects fraudulent activities using **hybrid intelligence (Rules + ML)**.

---

## 🏗️ System Architecture

```
React Dashboard
       │
       ▼
Spring Boot Backend
       │
       ▼
Rule-Based Engine
       │
       ▼
FastAPI ML Model
       │
       ▼
Fraud Probability
       │
       ▼
MySQL Database
```

---

## 🚀 Features

### 🔹 Rule-Based Detection

* High amount transactions
* Suspicious merchant detection
* Odd hour transactions (12 AM – 5 AM)
* Rapid multiple transactions
* Location mismatch
* New location detection

### 🔹 Machine Learning Detection

* Predicts fraud probability
* Detects hidden patterns
* Uses features like:

  * Transaction amount
  * Device change
  * Location change
  * Transaction frequency
  * User behavior

### 🔹 Hybrid Detection

Final fraud decision is based on:

```
Fraud = Rule Score + ML Probability
```

---

## 🧠 ML Model

* Algorithm: Random Forest / XGBoost
* Dataset:

  * Synthetic dataset (30,000 transactions)
  * PaySim dataset
* Techniques:

  * SMOTE (handling imbalance)
  * Feature engineering
  * Cross-validation

### 📊 Example Output

```
Fraud Probability: 0.75
Prediction: FRAUD
```

---

## ⚙️ Tech Stack

| Layer    | Technology           |
| -------- | -------------------- |
| Frontend | React + Tailwind CSS |
| Backend  | Spring Boot          |
| ML API   | FastAPI              |
| ML Model | Scikit-learn         |
| Database | MySQL                |

---

## 📂 Project Structure

```
fraud-detection/
│
├── backend/ (Spring Boot)
│   ├── controller
│   ├── service
│   ├── repository
│   └── model
│
├── ml-api/
│   ├── ml_api.py
│   ├── fraud_model.pkl
│   └── model_features.pkl
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
└── dataset/
```

---

## 🔌 API Endpoints

### 📥 Transactions

```
GET /api/transactions
POST /api/transactions
```

### 🚨 Alerts

```
GET /api/alerts
GET /api/alerts/high-risk
```

### 🤖 ML API

```
POST http://localhost:8000/predict
```

---

## 🧪 Sample ML Request

```json
{
  "sender_id": 101,
  "receiver_id": 202,
  "amount": 120000,
  "device_id": 5,
  "location": 3,
  "transaction_type": 1,
  "hour": 2,
  "txn_frequency": 30,
  "user_avg_amount": 5000,
  "amount_vs_avg": 24,
  "device_change": 1,
  "location_change": 1,
  "merchant_category": 4,
  "txn_gap": 10,
  "rule_score": 85
}
```

---

## ▶️ How to Run the Project

### 1️⃣ Run ML API (FastAPI)

```bash
cd ml-api
pip install fastapi uvicorn pandas scikit-learn joblib
uvicorn ml_api:app --reload --port 8000
```

---

### 2️⃣ Run Spring Boot Backend

```bash
cd backend
mvn spring-boot:run
```

---

### 3️⃣ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Dashboard Features

* Real-time transaction monitoring
* Fraud alerts visualization
* Risk score display
* Fraud trend charts
* Alerts by rule chart
* Fraud simulator

---

## ⚠️ Challenges Faced

* Handling imbalanced fraud data
* Avoiding overfitting
* Feature engineering for realistic detection
* Integrating ML with backend
* Real-time API communication

---

## 🔮 Future Enhancements

* 🔥 Real-time streaming (Kafka/WebSocket)
* 📍 Geo-location fraud tracking
* 📊 Advanced analytics dashboard
* 🧠 Deep Learning models
* 📱 Mobile app integration

---

## 📌 Conclusion

This system demonstrates a **real-world fraud detection pipeline** used in banking systems by combining:

✔ Rule-based logic
✔ Machine learning intelligence
✔ Real-time monitoring

---

## licence
MIT INCLUDED

## 👨‍💻 TEAM MEMEBER

**Naresh Kumar S**|
|**Ishita-Agrawal**|
**Anusrisamala**

---
