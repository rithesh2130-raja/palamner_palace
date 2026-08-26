import os
from pathlib import Path

# Paths Configuration
MODEL_DIR = os.getenv("MODEL_DIR", "/models/Wan2.1-VACE-1.3B")
OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", "/outputs"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Wan 2.1 Default Video Generation Settings
DEFAULT_FRAMES = int(os.getenv("DEFAULT_FRAMES", "81")) # 81 frames (~5 seconds at 16 fps)
DEFAULT_FPS = int(os.getenv("DEFAULT_FPS", "16"))
DEFAULT_WIDTH = int(os.getenv("DEFAULT_WIDTH", "480"))
DEFAULT_HEIGHT = int(os.getenv("DEFAULT_HEIGHT", "832")) # 9:16 Aspect Ratio

# Object Storage / CDN Settings (Cloudflare R2 / AWS S3 / Cloudinary)
STORAGE_PROVIDER = os.getenv("STORAGE_PROVIDER", "local") # "r2" | "s3" | "local"
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID", "")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID", "")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY", "")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME", "shopsphere-ai-reels")
R2_PUBLIC_DOMAIN = os.getenv("R2_PUBLIC_DOMAIN", "https://cdn.shopsphere.com")
