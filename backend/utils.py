import io
import os
import base64
import numpy as np
from PIL import Image

IMG_H = 64
IMG_W = 64

def read_image_bytes(file_storage):
    """Read uploaded file (Werkzeug FileStorage) into PIL.Image"""
    img = Image.open(file_storage.stream).convert("RGB")
    return img

def preprocess(img: Image.Image, target_size=(IMG_W, IMG_H), normalize="0_1"):
    """
    Resize and normalize according to training.
    normalize: '0_1' -> pixels/255, 'minus1_1' -> (pixels/127.5)-1
    returns numpy array shape (1,h,w,3) dtype float32
    """
    img = img.resize(target_size, Image.BICUBIC)
    arr = np.asarray(img).astype("float32")
    if normalize == "0_1":
        arr = arr / 255.0
    elif normalize == "minus1_1":
        arr = (arr / 127.5) - 1.0
    else:
        raise ValueError("unknown normalize")
    return np.expand_dims(arr, axis=0)

def postprocess(pred: np.ndarray, normalize="0_1"):
    """
    pred: numpy array shape (1,h,w,3) float32
    returns PIL.Image (uint8 RGB)
    """
    img = pred[0]
    if normalize == "0_1":
        img = np.clip(img * 255.0, 0, 255).astype("uint8")
    elif normalize == "minus1_1":
        img = ((np.clip(img, -1, 1) + 1.0) * 127.5).astype("uint8")
    else:
        raise ValueError("unknown normalize")
    return Image.fromarray(img)

def pil_to_data_uri(pil_img, fmt="PNG"):
    buffered = io.BytesIO()
    pil_img.save(buffered, format=fmt)
    b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return f"data:image/{fmt.lower()};base64,{b64}"

def save_pil_image(pil_img, path, fmt="PNG"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    pil_img.save(path, format=fmt)
