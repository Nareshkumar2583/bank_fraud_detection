import pandas as pd
import joblib

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder

from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE


# =============================
# LOAD DATASET
# =============================

df = pd.read_csv("fraud_dataset1.csv")

print("Dataset Shape:", df.shape)

print("\nFraud Distribution:")
print(df["fraud_flag"].value_counts())


# =============================
# FIX MISSING FEATURES
# =============================

if "hour" not in df.columns and "timestamp" in df.columns:
    df["hour"] = pd.to_datetime(df["timestamp"]).dt.hour

if "merchant_category" not in df.columns and "merchant_name" in df.columns:
    df["merchant_category"] = df["merchant_name"].astype("category").cat.codes

if "txn_gap" not in df.columns:
    df["txn_gap"] = 0


# =============================
# ENCODE STRING COLUMNS
# =============================

label = LabelEncoder()

for col in df.columns:
    if df[col].dtype == "object":
        df[col] = label.fit_transform(df[col].astype(str))


# =============================
# SELECT FEATURES
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

X = df[features]
y = df["fraud_flag"]

# save feature order
joblib.dump(features, "model_features.pkl")


# =============================
# HANDLE CLASS IMBALANCE
# =============================

smote = SMOTE(random_state=42)

X_resampled, y_resampled = smote.fit_resample(X, y)

print("\nAfter SMOTE:", X_resampled.shape)


# =============================
# TRAIN TEST SPLIT
# =============================

X_train, X_test, y_train, y_test = train_test_split(
    X_resampled,
    y_resampled,
    test_size=0.2,
    random_state=42,
    stratify=y_resampled
)


# =============================
# RANDOM FOREST MODEL
# =============================

model = RandomForestClassifier(

    n_estimators=500,
    max_depth=15,

    min_samples_split=5,
    min_samples_leaf=3,

    class_weight="balanced",

    random_state=42,
    n_jobs=-1

)

print("\nTraining Random Forest Model...")

model.fit(X_train, y_train)


# =============================
# PREDICTIONS
# =============================

y_pred = model.predict(X_test)


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

scores = cross_val_score(model, X_resampled, y_resampled, cv=5)

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

print("\nFeature Importance:\n")
print(feature_importance)


# =============================
# SAVE MODEL
# =============================

joblib.dump(model, "fraud_model_randomforest.pkl")

print("\nModel saved successfully as fraud_model_randomforest.pkl")