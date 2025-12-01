import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
export default function UploadCard() {
  const inputRef = useRef(null);
  const dropRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // overall (upload+processing)
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100 for upload
  const [procProgress, setProcProgress] = useState(0); // 0-100 from server
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState(null);

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  // cleanup preview URL on unmount / file change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setLoading(false);
    setUploadProgress(0);
    setProcProgress(0);
    setStatusMessage("");
    setError("");
    setJobId(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFileChange(e) {
    setError("");
    const f = e.target.files && e.target.files[0];
    if (!f) return reset();

    if (!f.type.startsWith("image/")) {
      setError("Please select an image file");
      return reset();
    }
    if (f.size > MAX_SIZE) {
      setError("File too large. Max 10MB allowed.");
      return reset();
    }

    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  // drag & drop handlers (visual classes preserved)
  function handleDragOver(e) {
    e.preventDefault();
    if (dropRef.current) dropRef.current.classList.add("border-primary", "bg-blue-50");
  }
  function handleDragLeave() {
    if (dropRef.current) dropRef.current.classList.remove("border-primary", "bg-blue-50");
  }
  function handleDrop(e) {
    e.preventDefault();
    if (dropRef.current) dropRef.current.classList.remove("border-primary", "bg-blue-50");
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please drop an image file");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File too large. Max 10MB allowed.");
      return;
    }
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  // Polling status from server
  function pollStatus(job_id, { interval = 1000, timeout = 5 * 60 * 1000 } = {}) {
    const start = Date.now();
    let backoff = interval;

    async function poll() {
      try {
        const res = await axios.get(`/api/deblur/status/${job_id}`, { timeout: 10000 });
        const data = res.data;
        setProcProgress(data.progress ?? procProgress);
        setStatusMessage(data.message ?? data.status ?? "");

        if (data.status === "done") {
          // convert relative to absolute URL if needed
          const url = data.result_url
            ? (data.result_url.startsWith("http") ? data.result_url : `${window.location.origin}${data.result_url}`)
            : null;
          setResult(url);
          setLoading(false);
          setJobId(null);
          return;
        }

        if (data.status === "error") {
          setError(data.message || "Server processing error");
          setLoading(false);
          setJobId(null);
          return;
        }

        if (Date.now() - start > timeout) {
          setError("Processing timeout. Please try again later.");
          setLoading(false);
          setJobId(null);
          return;
        }

        setTimeout(poll, backoff);
        backoff = Math.min(backoff * 1.25, 5000);
      } catch (err) {
        console.error("poll error", err);
        if (Date.now() - start > timeout) {
          setError("Unable to fetch job status. Try again later.");
          setLoading(false);
          setJobId(null);
          return;
        }
        setTimeout(poll, backoff);
        backoff = Math.min(backoff * 1.25, 5000);
      }
    }

    poll();
  }

  // startDeblur -> upload + start background job
  async function startDeblur() {
    setError("");
    if (!file) {
      setError("Please choose a file first");
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setProcProgress(0);
    setStatusMessage("Uploading...");

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await axios.post("/api/deblur/start", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
          setStatusMessage(`Uploading (${percent}%)`);
        },
        timeout: 120000,
      });

      if (res.status === 202 && res.data?.job_id) {
        const id = res.data.job_id;
        setJobId(id);
        setStatusMessage("Upload complete — queued for processing");
        setProcProgress(5);
        pollStatus(id);
      } else {
        setError("Unexpected server response when starting job");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err?.message || "Upload failed");
      setLoading(false);
    }
  }

  // download result (same approach as before)
  async function downloadResult() {
    if (!result) return;
    try {
      if (result.startsWith("data:")) {
        const a = document.createElement("a");
        a.href = result;
        a.download = "face-restored.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      }
      const resp = await fetch(result);
      if (!resp.ok) throw new Error("Failed to fetch image");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "face-restored.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Download failed. Try opening the image in a new tab.");
    }
  }

  async function copyDataUri() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
    } catch (err) {
      console.error(err);
      setError("Copy failed. Try copying manually.");
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold text-gray-700">Upload & Deblur</h3>
        <p className="text-sm text-gray-500 mt-1">Single face image. JPEG/PNG up to 10MB.</p>

        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="mt-4 border-2 border-dashed border-gray-300 rounded-lg h-36 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-primary transition"
          onClick={() => inputRef.current && inputRef.current.click()}
        >
          <p className="text-sm">Drag & drop an image here</p>
          <p className="text-xs">or click to select</p>
        </div>

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        <div className="mt-4 flex gap-2">
          {/* Keep appearance: primary button text unchanged */}
          <button
            onClick={startDeblur}
            disabled={loading}
            className="bg-primary text-gray-800 border px-4 py-2 rounded-md disabled:opacity-60"
          >
            {loading ? "Processing..." : "Start"}
          </button>
          <button onClick={reset} className="px-4 py-2 border rounded-md">
            Reset
          </button>
        </div>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700">Preview</h4>
          <div className="mt-2 border rounded-md overflow-hidden bg-gray-50 h-64 flex items-center justify-center">
            {preview ? <img src={preview} alt="preview" className="max-h-full" /> : <div className="text-gray-400">No image selected</div>}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow flex flex-col">
        <h3 className="text-lg font-semibold">Result</h3>
        <p className="text-sm text-gray-500 mt-1">Restored image will appear here. Download option available.</p>

        <div className="mt-4 flex-1 border rounded-md overflow-hidden bg-gray-50 h-64 flex items-center justify-center relative">
          {/* upload progress (show while uploading) */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="absolute top-3 left-3 right-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div style={{ width: `${uploadProgress}%` }} className="h-full bg-primary transition-all" />
              </div>
              <div className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</div>
            </div>
          )}

          {/* processing progress (show while server working) */}
          {loading && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <div className="text-gray-500 text-sm">{statusMessage || "Processing..."}</div>
              <div className="w-48 h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                <div style={{ width: `${procProgress}%` }} className="h-full bg-green-500" />
              </div>
              <div className="text-xs text-gray-500 mt-1">Processing: {procProgress}%</div>
            </div>
          )}

          {/* show final result */}
          {!loading && result && <img src={result} alt="result" className="max-h-full" />}

          {!loading && !result && <div className="text-gray-400">Result will appear here</div>}
        </div>

        {result && (
          <div className="mt-4 flex gap-2">
            <button onClick={downloadResult} className="px-4 py-2 bg-green-600 text-white rounded-md">Download</button>
            <button onClick={copyDataUri} className="px-4 py-2 border rounded-md">Copy Data URI</button>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">Tip: For best results, crop the image to contain only the face before uploading.</div>
      </div>
    </div>
  );
}
