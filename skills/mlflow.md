# Skill: MLflow Experiment Tracking & Registry

## When to Use

Use MLflow when your hackathon project involves iterating on multiple model architectures, comparing hyperparameter runs, logging metrics/confusion matrices, or versioning trained artifacts in a team.

> **Rule**: MLflow is **optional**. Do NOT set up an MLflow tracking server for a one-off 10-line scikit-learn script.

---

## Canonical Experiment Tracking Workflow

```python
# ml/train_with_mlflow.py
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
import os

# Connect to MLflow tracking server or local directory
tracking_uri = os.getenv("MLFLOW_TRACKING_URI", "sqlite:///mlflow.db")
mlflow.set_tracking_uri(tracking_uri)
mlflow.set_experiment("hackathon-classifier")

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

n_estimators = 100
max_depth = 5

with mlflow.start_run(run_name="rf-baseline"):
    # 1. Log Hyperparameters
    mlflow.log_param("n_estimators", n_estimators)
    mlflow.log_param("max_depth", max_depth)

    # 2. Train Model
    clf = RandomForestClassifier(n_estimators=n_estimators, max_depth=max_depth)
    clf.fit(X_train, y_train)

    # 3. Log Performance Metrics
    preds = clf.predict(X_test)
    acc = accuracy_score(y_test, preds)
    f1 = f1_score(y_test, preds, average="weighted")

    mlflow.log_metric("accuracy", acc)
    mlflow.log_metric("f1_score", f1)

    # 4. Log Model Artifact
    mlflow.sklearn.log_model(clf, "model", registered_model_name="PraviClassifier")
    print(f"Logged run to MLflow with accuracy: {acc:.4f}")
```

---

## Model Registry & Production Loading

In your FastAPI serving application:

```python
import mlflow.pyfunc

# Load the latest production version from registry
model_uri = "models:/PraviClassifier/Production"
model = mlflow.pyfunc.load_model(model_uri)
```
