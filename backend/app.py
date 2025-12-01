import os
import uuid
import threading
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
from model_loader import load_autoencoder
from utils import read_image_bytes, preprocess, postprocess, pil_to_data_uri, save_pil_image

# config
UPLOAD_DIR = os.path.join("static", "uploads")
RESULT_DIR = os.path.join("static", "results")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULT_DIR, exist_ok=True)

app = Flask(__name__, static_folder="static", static_url_path="/static")
CORS(app)

print("Loading model on startup...")
model = load_autoencoder()
import numpy as np
_dummy = np.zeros((1,64,64,3), dtype=np.float32)
try:
    _ = model.predict(_dummy, verbose=0)
    print("Model warm-up done")
except Exception as e:
    print("Model warm-up failed:", e)

NORMALIZE = "0_1"  

JOBS = {}

def process_job(job_id, upload_path, filename):
    try:
        JOBS[job_id].update(status="processing", progress=10, message="Loading image")

    
        img = Image.open(upload_path).convert("RGB")
        orig_size = img.size 

        JOBS[job_id].update(progress=20, message="Preprocessing")

        x = preprocess(img, target_size=(64, 64), normalize=NORMALIZE)

        JOBS[job_id].update(progress=40, message="Running model")
        pred = model.predict(x, verbose=0)

        JOBS[job_id].update(progress=70, message="Postprocessing")
        out_pil = postprocess(pred, normalize=NORMALIZE)
        out_pil_upscaled = out_pil.resize(orig_size, resample=Image.LANCZOS)

        JOBS[job_id].update(progress=85, message="Saving result")

        result_filename = f"result_{filename}"
        result_path = os.path.join(RESULT_DIR, result_filename)
        out_pil_upscaled.save(result_path, format="PNG")

        JOBS[job_id].update(
            status="done",
            progress=100,
            message="Done",
            result_url=f"/static/results/{result_filename}"
        )

    except Exception as e:
        import traceback
        JOBS[job_id].update(
            status="error",
            message=str(e),
            trace=traceback.format_exc()
        )
        print("ERROR in process_job:", traceback.format_exc())


@app.route("/api/deblur/start", methods=["POST"])
def deblur_start():
    """
    Accepts multipart form 'image' -> saves upload and starts a background job returning job_id
    """
    if "image" not in request.files:
        return jsonify({"error": "no image uploaded"}), 400
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "empty filename"}), 400

    unique = uuid.uuid4().hex[:8]
    filename = f"{datetime.utcnow().strftime('%Y%m%dT%H%M%S')}_{unique}.png"
    upload_path = os.path.join(UPLOAD_DIR, filename)

    img = read_image_bytes(file)  
    img.save(upload_path)

    job_id = uuid.uuid4().hex
    JOBS[job_id] = {
        "status": "queued",
        "progress": 0,
        "message": "Queued",
    }

    thread = threading.Thread(target=process_job, args=(job_id, upload_path, filename), daemon=True)
    thread.start()

    return jsonify({"job_id": job_id}), 202


@app.route("/api/deblur/status/<job_id>", methods=["GET"])
def deblur_status(job_id):
    job = JOBS.get(job_id)
    if not job:
        return jsonify({"error": "invalid job id"}), 404

    job_out = job.copy()

    result_url = job_out.get("result_url")
    if result_url and result_url.startswith("/"):
        host = request.host_url.rstrip("/")  
        job_out["result_url"] = host + result_url

    return jsonify(job_out)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    index_path = os.path.join(app.static_folder, "index.html")
    if os.path.exists(index_path):
        return send_from_directory(app.static_folder, "index.html")
    return "Frontend not built. Place your built files in /static (dist)", 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
