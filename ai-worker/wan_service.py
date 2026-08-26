import os
import uuid
import boto3
from pathlib import Path
import torch
from diffusers import DiffusionPipeline
from diffusers.utils import load_image, export_to_video
from config import (
    MODEL_DIR,
    OUTPUT_DIR,
    DEFAULT_FRAMES,
    DEFAULT_FPS,
    STORAGE_PROVIDER,
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_PUBLIC_DOMAIN,
)


class Wan21Service:

    def __init__(self):
        print(f"[Wan2.1 Service] Initializing Wan2.1-VACE-1.3B from {MODEL_DIR}...")

        try:
            self.pipe = DiffusionPipeline.from_pretrained(
                MODEL_DIR,
                torch_dtype=torch.bfloat16,
                use_safetensors=True,
            )
            self.pipe.to("cuda")
            print("[Wan2.1 Service] Wan2.1 VACE 1.3B loaded successfully into CUDA VRAM.")
        except Exception as e:
            print(f"[Wan2.1 Service WARNING] Failed to load model weights directly: {e}")
            print("[Wan2.1 Service] Will attempt online Diffusers load if available during inference.")
            self.pipe = None

        # Setup Cloudflare R2 / S3 Client if credentials present
        self.s3_client = None
        if R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY:
            try:
                endpoint_url = f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com" if R2_ACCOUNT_ID else None
                self.s3_client = boto3.client(
                    "s3",
                    endpoint_url=endpoint_url,
                    aws_access_key_id=R2_ACCESS_KEY_ID,
                    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
                )
                print("[Wan2.1 Service] Object Storage CDN client initialized.")
            except Exception as err:
                print(f"[Wan2.1 Service WARNING] Failed to initialize S3 client: {err}")

    def upload_to_cdn(self, local_path: Path, job_id: str) -> str:
        """Uploads generated MP4 to Cloudflare R2 / AWS S3 and returns HTTPS CDN URL."""
        if not self.s3_client:
            return f"file://{local_path.absolute()}"

        object_key = f"ai-reels/{job_id}.mp4"
        print(f"[Wan2.1 Service] Uploading {local_path} to CDN object key {object_key}...")

        try:
            self.s3_client.upload_file(
                Filename=str(local_path),
                Bucket=R2_BUCKET_NAME,
                Key=object_key,
                ExtraArgs={"ContentType": "video/mp4"},
            )
            cdn_url = f"{R2_PUBLIC_DOMAIN.rstrip('/')}/{object_key}"
            print(f"[Wan2.1 Service] CDN Upload Completed: {cdn_url}")
            return cdn_url
        except Exception as err:
            print(f"[Wan2.1 Service ERROR] CDN upload failed: {err}")
            return f"file://{local_path.absolute()}"

    def generate(
        self,
        prompt: str,
        image_url: str | None = None,
        frames: int = DEFAULT_FRAMES,
        aspect_ratio: str = "9:16",
        resolution: str = "480p",
    ) -> dict:
        job_id = f"wan_job_{uuid.uuid4().hex[:12]}"
        print(f"\n[Wan2.1 Service] Starting Generation | Job ID: {job_id} | Image Mode: {bool(image_url)}")

        if not self.pipe:
            print("[Wan2.1 Service] Loading DiffusionPipeline fallback...")
            self.pipe = DiffusionPipeline.from_pretrained(
                "Wan-AI/Wan2.1-VACE-1.3B",
                torch_dtype=torch.bfloat16,
            ).to("cuda")

        # Run Video Generation Pipeline
        if image_url:
            print(f"[Wan2.1 Service] Loading reference product image: {image_url}")
            image = load_image(image_url)
            result = self.pipe(
                image=image,
                prompt=prompt,
                num_frames=frames,
            )
        else:
            result = self.pipe(
                prompt=prompt,
                num_frames=frames,
            )

        frames_output = result.frames[0]
        output_file = OUTPUT_DIR / f"{job_id}.mp4"

        print(f"[Wan2.1 Service] Rendering MP4 video to {output_file} at {DEFAULT_FPS} FPS...")
        export_to_video(
            frames_output,
            str(output_file),
            fps=DEFAULT_FPS,
        )

        # Upload to Storage CDN
        video_cdn_url = self.upload_to_cdn(output_file, job_id)

        return {
            "job_id": job_id,
            "video_path": str(output_file),
            "video_url": video_cdn_url,
            "duration": 5,
            "aspect_ratio": aspect_ratio,
            "resolution": resolution,
            "model": "Wan2.1-VACE-1.3B",
        }
