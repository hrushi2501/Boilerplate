# Skill: Machine Learning Model Serving (FastAPI)

## When to Use

Use this skill when exposing a scikit-learn, PyTorch, XGBoost, or Hugging Face model as a production-ready HTTP microservice for the Next.js frontend.

---

## Canonical FastAPI Serving Pattern

```python
# ml/app/main.py
from fastapi import FastAPI, HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader
from pydantic import BaseModel, Field
import joblib
import os
import time

app = FastAPI(title="PraviAI ML Service", version="1.0.0")

# Security API key header
API_KEY_NAME = "X-Internal-Token"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)
INTERNAL_SECRET = os.getenv("ML_INTERNAL_SECRET", "hackathon-secret")

# 1. Pydantic Request & Response Schemas
class PredictionRequest(BaseModel):
    features: list[float] = Field(..., example=[5.1, 3.5, 1.4, 0.2])
    model_version: str = Field(default="v1", description="Model version tag")

class PredictionResponse(BaseModel):
    prediction: int
    probability: float
    latency_ms: float
    model_version: str

# 2. Lifecycle Model Loading (Load once at startup)
model = None

@app.on_event("startup")
def load_model():
    global model
    model_path = os.getenv("MODEL_PATH", "models/model.joblib")
    if os.path.exists(model_path):
        model = joblib.load(model_path)
    else:
        print(f"Warning: {model_path} not found. Running in mock inference mode.")

# 3. Health & Liveness Probes
@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

# 4. Prediction Endpoint
@app.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest, api_key: str = Security(api_key_header)):
    if api_key != INTERNAL_SECRET:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API Key")

    start_time = time.perf_counter()

    try:
        # Run inference
        if model is not None:
            pred = int(model.predict([payload.features])[0])
            prob = float(max(model.predict_proba([payload.features])[0]))
        else:
            # Fallback mock prediction
            pred = 1
            prob = 0.95

        duration = (time.perf_counter() - start_time) * 1000

        return PredictionResponse(
            prediction=pred,
            probability=prob,
            latency_ms=round(duration, 2),
            model_version=payload.model_version
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

---

## Operational Guidelines

1. **Load Models Once at Startup**: Never load model weights inside the request handler function.
2. **Pydantic Validation**: Reject malformed feature arrays immediately at the HTTP boundary before touching NumPy or PyTorch tensors.
3. **Internal Auth Header**: Protect the service with a shared secret (`X-Internal-Token`) so it cannot be abused if publicly exposed.
4. **Avoid Microservice Overkill**: Do NOT set up Kubernetes, Celery, or Kafka for a hackathon. A single FastAPI process running with Uvicorn (`uvicorn app.main:app --port 8000`) is more than enough.
