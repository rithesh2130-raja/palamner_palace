FROM nvidia/cuda:12.4.1-cudnn-devel-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

RUN apt-get update && apt-get install -y \
    python3.10 \
    python3.10-dev \
    python3-pip \
    git \
    ffmpeg \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN update-alternatives --install \
    /usr/bin/python python /usr/bin/python3.10 1

RUN python -m pip install --upgrade pip

WORKDIR /app

COPY requirements.txt .

RUN pip install \
    torch==2.5.1 \
    torchvision==0.20.1 \
    --index-url https://download.pytorch.org/whl/cu124

RUN pip install -r requirements.txt

RUN git clone https://github.com/ali-vilab/VACE.git /app/VACE

RUN pip install wan@git+https://github.com/Wan-Video/Wan2.1

COPY . /app

ENV MODEL_DIR=/models/Wan2.1-VACE-1.3B
ENV OUTPUT_DIR=/outputs

RUN mkdir -p /models /outputs

CMD ["python", "handler.py"]
