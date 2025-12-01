# FaceClear – AI Face Deblurring Web Application

FaceClear is a full-stack AI application designed to restore clarity in blurry facial images using a custom-trained autoencoder model.  
The system removes motion blur, low-light blur, and camera shake while preserving facial details and identity.

The project includes a modern React frontend, a Python Flask backend, and a trained deep learning model served through a REST API.

---

## Features

### Frontend (React + Vite)
- Modern UI using Tailwind CSS
- Drag-and-drop image upload
- Live progress updates
- Result preview panel
- Light and dark mode theme switch
- Mobile-responsive layout
- Downloadable restored image
- Error handling and validations

### Backend (Flask + Python)
- Asynchronous background processing using threads
- REST API for starting inference and checking status
- Automatic saving of uploaded and restored images
- High-quality resizing of model output to match original resolution
- CORS support for local development
- Production-ready static file serving

### Deep Learning
- Convolutional autoencoder trained on multiple face-blur datasets (CelebA, GoPro, HIDE, RealBlur, WiderFace)
- Input size: 64x64
- Output size: 64x64
- Normalization and preprocessing utilities
- Postprocessing and denormalization setup
- LANCZOS resampling to upscale output to the original resolution

---

## Project Structure

FaceClear/
├── backend/
│   ├── app.py
│   ├── model_loader.py
│   ├── utils.py
│   ├── model/
│   │   ├── autoencoder_model.keras
│   │   ├── autoencoder_model_architecture.json
│   │   ├── autoencoder_model.weights.h5
│   ├── static/
│   ├── uploads/
│   ├── results/
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Hero.jsx
    │   │   ├── UploadCard.jsx
    │   │   ├── Examples.jsx
    │   │   ├── Footer.jsx
    │   ├── assets/
    │   ├── styles/





## API Endpoints

### POST /api/deblur/start
Start a new deblurring job.

Request (multipart form-data):


Response:
json
{
  "job_id": "f3a92b1a..."
}



GET /api/deblur/status/<job_id>

Poll this endpoint to check job progress.

Example response:

{
  "status": "done",
  "progress": 100,
  "message": "Done",
  "result_url": "http://127.0.0.1:8000/static/results/result_20251130.png"
}
