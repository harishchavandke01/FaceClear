# model_loader.py
import os
import json
import tensorflow as tf
from tensorflow.keras.models import model_from_json, load_model

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")

def load_autoencoder():
    """
    Tries to load saved .keras model first, if not present tries architecture.json + weights.h5
    Returns: keras.Model
    """
    # 1) try .keras
    keras_path = os.path.join(MODEL_DIR, "autoencoder_model.keras")
    if os.path.exists(keras_path):
        print("Loading model from", keras_path)
        model = load_model(keras_path, compile=False)
        return model

    # 2) try architecture + weights
    arch_path = os.path.join(MODEL_DIR, "autoencoder_model_architecture.json")
    w_path = os.path.join(MODEL_DIR, "autoencoder_model.weights.h5")
    if os.path.exists(arch_path) and os.path.exists(w_path):
        print("Loading model architecture from", arch_path, "and weights from", w_path)
        with open(arch_path, "r") as f:
            arch = f.read()
        model = model_from_json(arch)
        model.load_weights(w_path)
        return model

    raise FileNotFoundError("No model files found in model/ (looked for .keras or architecture+weights)")
