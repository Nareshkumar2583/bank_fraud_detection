import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier

# =============================
# LOAD DATASET
# =============================
df = pd.read_csv("fraud_dataset1.csv")

print("Dataset Shape:", df.shape)
print("\nColumns:", df.columns.tolist())

print("\nFraud Distribution:")
print(df["fraud_flag"].value_counts())

# =============================
# REMOVE DATA LEAKAGE (IMPORTANT)
# =============================
df = df.drop(columns=["fraud_probability"], errors="ignore")

# =============================
# FEATURE ENGINEERING
# =============================
if "timestamp" in df.columns:
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    df["hour"] = df["timestamp"].dt.hour

    # REAL txn_gap (important improvement)
    df["txn_gap"] = df.groupby("sender_id")["timestamp"] \
                      .diff().dt.total_seconds().fillna(0)

# Merchant category
if "merchant_name" in df.columns:
    df["merchant_category"] = df["merchant_name"].astype("category").cat.codes

# =============================
# FEATURE LIST
# =============================
features = [
    "sender_id",
    "amount",
    "device_id",
    "location",
    "transaction_type",
    "hour",
    "txn_frequency",
    "user_avg_amount",
    "amount_vs_avg",
    "device_change",
    "location_change",
    "merchant_category",
    "txn_gap",
    "rule_score"
]

# =============================
# HANDLE MISSING FEATURES
# =============================
for col in features:
    if col not in df.columns:
        print(f"⚠ Adding missing column: {col}")
        df[col] = 0

# =============================
# ENCODE CATEGORICAL FEATURES
# =============================
label = LabelEncoder()

categorical_cols = [
    "sender_id",
    "device_id",
    "location",
    "transaction_type"
]

for col in categorical_cols:
    df[col] = label.fit_transform(df[col].astype(str))

# =============================
# SPLIT DATA
# =============================
X = df[features]
y = df["fraud_flag"]

# Save feature order (IMPORTANT for FastAPI)
joblib.dump(features, "model_features.pkl")

# =============================
# HANDLE IMBALANCE
# =============================
smote = SMOTE(random_state=42)
X_res, y_res = smote.fit_resample(X, y)

print("\nAfter SMOTE:", X_res.shape)

# =============================
# TRAIN-TEST SPLIT
# =============================
X_train, X_test, y_train, y_test = train_test_split(
    X_res, y_res,
    test_size=0.2,
    random_state=42,
    stratify=y_res
)

# =============================
# XGBOOST MODEL (TUNED)
# =============================
model = XGBClassifier(
    n_estimators=500,
    max_depth=8,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=1,
    random_state=42,
    n_jobs=-1,
    eval_metric="logloss"
)

print("\nTraining XGBoost model...")
model.fit(X_train, y_train)

# =============================
# PREDICTIONS (IMPROVED)
# =============================
probs = model.predict_proba(X_test)[:, 1]

# 🔥 LOWER THRESHOLD (better fraud detection)
y_pred = (probs > 0.4).astype(int)

# =============================
# EVALUATION
# =============================
print("\nAccuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:\n")
print(confusion_matrix(y_test, y_pred))

# =============================
# CROSS VALIDATION
# =============================
scores = cross_val_score(model, X_res, y_res, cv=5)

print("\nCross Validation Scores:", scores)
print("Average CV Accuracy:", scores.mean())

# =============================
# FEATURE IMPORTANCE
# =============================
importance = model.feature_importances_

feature_importance = pd.DataFrame({
    "Feature": features,
    "Importance": importance
}).sort_values("Importance", ascending=False)

print("\nTop Features:\n")
print(feature_importance.head(10))

# =============================
# SAVE MODEL
# =============================
joblib.dump(model, "fraud_model_xgboost.pkl")

print("\n✅ XGBoost Model saved successfully!")