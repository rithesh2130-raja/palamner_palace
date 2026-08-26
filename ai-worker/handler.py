import runpod
from wan_service import Wan21Service

# Initialize Wan 2.1 VACE 1.3B inference service on worker startup
service = Wan21Service()


def handler(job):
    print(f"\n[RunPod Worker] Received job ID: {job.get('id', 'local_test')}")

    job_input = job.get("input", {})

    prompt = job_input.get("prompt", "A cinematic 9:16 product commercial showcase")
    image_url = job_input.get("image_url") or job_input.get("input_image_url")
    frames = job_input.get("frames", 81)
    aspect_ratio = job_input.get("aspect_ratio", "9:16")
    resolution = job_input.get("resolution", "480p")

    try:
        result = service.generate(
            prompt=prompt,
            image_url=image_url,
            frames=frames,
            aspect_ratio=aspect_ratio,
            resolution=resolution,
        )

        return {
            "success": True,
            "job_id": result["job_id"],
            "video_url": result["video_url"],
            "video_path": result["video_path"],
            "model": result["model"],
            "duration": result["duration"],
            "fps": 16,
            "aspect_ratio": aspect_ratio,
            "resolution": resolution,
        }
    except Exception as err:
        print(f"[RunPod Worker ERROR] Generation failed: {err}")
        return {
            "success": False,
            "error": str(err),
            "code": "WAN21_GENERATION_FAILED",
        }


# Start RunPod Serverless Loop
if __name__ == "__main__":
    runpod.serverless.start({"handler": handler})
