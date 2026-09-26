# Skill: Scikit-Learn (Classical ML)

## When to Use

Use `scikit-learn` for tabular data, classification, regression, clustering (K-Means), anomaly detection, and standard classical ML pipelines where LLMs are over-engineered or too slow.

---

## Canonical Training & Serialization Workflow

```python
# ml/train.py
import joblib
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# 1. Prepare data
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Build Pipeline (Preprocessing + Model bundled together)
pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
])

# 3. Train
pipeline.fit(X_train, y_train)

# 4. Evaluate
preds = pipeline.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, preds):.4f}")

# 5. Serialize Artifact
joblib.dump(pipeline, "models/model.joblib")
print("Saved pipeline to models/model.joblib")
```

---

## Best Practices

1. **Always Bundle in a `Pipeline`**: Bundle `StandardScaler`, encoders, and the classifier together in `sklearn.pipeline.Pipeline`. This ensures identical feature transformations in training and FastAPI inference without manual recalculation.
2. **Use Joblib for Persistence**: Prefer `joblib.dump()` and `joblib.load()` over standard `pickle` for NumPy arrays and scikit-learn models.
3. **Pin Scikit-Learn Versions**: Ensure the Python environment running training has the exact same scikit-learn minor version as the serving container.
