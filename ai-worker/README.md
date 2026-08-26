# ShopSphere AI Worker — Wan 2.1 VACE 1.3B Cloud GPU Pipeline

Standalone Python worker service for generating 9:16 vertical social-commerce Reels using **Wan 2.1 VACE 1.3B** (Apache 2.0 open weights) on **RunPod Serverless**.

---

## 🚀 Quick Deployment Guide (RunPod Serverless)

### 1. Build & Push Docker Image
```bash
cd ai-worker
docker build -t your-dockerhub-username/shopsphere-wan21-worker:v1 .
docker push your-dockerhub-username/shopsphere-wan21-worker:v1
```

### 2. Download Model Weights to RunPod Network Volume
Create a **RunPod Network Volume** at `/models` and run:
```bash
pip install -U huggingface_hub
huggingface-cli download Wan-AI/Wan2.1-VACE-1.3B --local-dir /models/Wan2.1-VACE-1.3B
```

### 3. Create RunPod Serverless Endpoint
- Image: `your-dockerhub-username/shopsphere-wan21-worker:v1`
- Recommended GPU: **NVIDIA RTX 4090 (24 GB VRAM)** or **NVIDIA L40S (48 GB VRAM)**
- Volume Mount: `/models` -> `/models`

---

## 🔌 API Input Payload Contract

```json
{
  "input": {
    "prompt": "Create a cinematic product advertisement. Slowly rotate the gaming mouse on an RGB desk with macro close-ups.",
    "image_url": "https://cdn.shopsphere.com/products/gaming-mouse.jpg",
    "frames": 81,
    "aspect_ratio": "9:16",
    "resolution": "480p"
  }
}
```

## 📤 Output Response

```json
{
  "success": true,
  "job_id": "wan_job_a1b2c3d4e5f6",
  "video_url": "https://cdn.shopsphere.com/ai-reels/wan_job_a1b2c3d4e5f6.mp4",
  "model": "Wan2.1-VACE-1.3B",
  "duration": 5,
  "fps": 16,
  "aspect_ratio": "9:16",
  "resolution": "480p"
}
```
