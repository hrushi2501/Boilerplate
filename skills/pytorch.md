# Skill: PyTorch Deep Learning & Inference

## When to Use

Use PyTorch when running custom neural networks, computer vision models, or fine-tuned deep learning architectures.

---

## Canonical Inference Pattern (CPU / GPU / MPS Agnostic)

```python
import torch
import torch.nn as nn

# 1. Device Selection (Auto-selects CUDA, Apple Silicon MPS, or CPU)
def get_device():
    if torch.cuda.is_available():
        return torch.device("cuda")
    elif torch.backends.mps.is_available():
        return torch.device("mps")
    return torch.device("cpu")

device = get_device()

# 2. Model Loading & Inference Mode
class PyTorchPredictor:
    def __init__(self, weights_path: str, model_class: type[nn.Module]):
        self.device = get_device()
        self.model = model_class().to(self.device)
        self.model.load_state_dict(torch.load(weights_path, map_location=self.device))
        self.model.eval() # Set model to evaluation mode (disables dropout, fixes batchnorm)

    @torch.inference_mode() # Optimized replacement for torch.no_grad()
    def predict(self, input_tensor: torch.Tensor):
        input_tensor = input_tensor.to(self.device)
        outputs = self.model(input_tensor)
        probabilities = torch.softmax(outputs, dim=-1)
        return probabilities.cpu().numpy()
```

---

## Performance Rules for Hackathon Serving

1. **`torch.inference_mode()`**: Always wrap inference calls in `@torch.inference_mode()`. It saves memory and executes faster than standard forward passes.
2. **`model.eval()`**: Never forget `model.eval()`. Failure to do so causes non-deterministic predictions due to active Dropout and BatchNorm layers.
3. **Use Quantization if CPU-Bound**: If serving on CPU on a cloud VPS, use dynamic quantization:

   ```python
   quantized_model = torch.quantization.quantize_dynamic(model, {nn.Linear}, dtype=torch.qint8)
   ```

   This reduces memory footprint by up to 4x and accelerates CPU matrix multiplication.
