# Skill: Hugging Face Transformers

## When to Use

Use `transformers` for pre-trained NLP models (sentiment analysis, named entity recognition, zero-shot classification, translation, summarization) and specialized embedding models.

---

## Canonical Pipeline Usage (Python Service)

The high-level `pipeline` abstraction provides instant inference with automatic tokenization:

```python
from transformers import pipeline

# 1. Zero-Shot Classification Pipeline
classifier = pipeline(
    task="zero-shot-classification",
    model="valhalla/distilbart-mnli-12-3",
    device=-1 # -1 for CPU, 0 for CUDA GPU
)

def classify_ticket(text: str, candidate_labels: list[str]):
    result = classifier(text, candidate_labels=candidate_labels)
    return {
        "top_label": result["labels"][0],
        "top_score": round(result["scores"][0], 4),
        "scores": dict(zip(result["labels"], result["scores"]))
    }
```

---

## Tokenizer & Model Direct Pattern

For fine-grained control over embeddings or generation:

```python
from transformers import AutoTokenizer, AutoModel
import torch

tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
model.eval()

@torch.inference_mode()
def compute_embedding(text: str):
    inputs = tokenizer(text, padding=True, truncation=True, return_tensors="pt")
    outputs = model(**inputs)
    # Mean pooling
    embeddings = outputs.last_hidden_state.mean(dim=1).squeeze().tolist()
    return embeddings
```

---

## Hackathon Optimization Rules

1. **Prefer Distilled Models**: Use distilled variants (`distilbert`, `distilbart`, `all-MiniLM-L6-v2`) rather than massive full-size models to fit within standard RAM limits and minimize cold-start time.
2. **Cache Models Locally**: Set `TRANSFORMERS_CACHE` or `HF_HOME` to a persistent directory so models are not re-downloaded on every restart.
