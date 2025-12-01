import React, { useState, useRef, useEffect } from "react";

const examples = [
  { input: "/examples/input1.jpg", output: "/examples/output1.jpg", caption: "Motion blur removed" },
  { input: "/examples/input2.jpg", output: "/examples/output2.jpg", caption: "Low-light blur fix" },
  { input: "/examples/input3.jpg", output: "/examples/output3.jpg", caption: "Camera shake restored" }
];

/** Small, reusable compare slider */
function CompareSlider({ beforeSrc, afterSrc, altBefore = "before", altAfter = "after" }) {
  const [pos, setPos] = useState(50); // percent
  const containerRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let dragging = false;

    function onMove(e) {
      if (!dragging) return;
      const rect = container.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const p = ((clientX - rect.left) / rect.width) * 100;
      setPos(Math.max(0, Math.min(100, p)));
    }
    function onUp() {
      dragging = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onUp);
    }

    function onDown(e) {
      e.preventDefault();
      dragging = true;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
    }

    const handle = handleRef.current;
    handle?.addEventListener("mousedown", onDown);
    handle?.addEventListener("touchstart", onDown, { passive: false });

    return () => {
      handle?.removeEventListener("mousedown", onDown);
      handle?.removeEventListener("touchstart", onDown);
      onUp();
    };
  }, []);

  return (
    <div className="relative w-full h-56 rounded-lg overflow-hidden bg-gray-50 border border-gray-100" ref={containerRef}>
      {/* after image (restored) — full */}
      <img src={afterSrc} alt={altAfter} className="absolute inset-0 w-full h-full object-contain" />

      {/* before image clipped to pos% */}
      <div style={{ width: `${pos}%` }} className="absolute left-0 top-0 bottom-0 overflow-hidden">
        <img src={beforeSrc} alt={altBefore} className="w-full h-full object-contain" />
      </div>

      {/* divider */}
      <div
        style={{ left: `${pos}%` }}
        className="absolute top-0 bottom-0 w-0.5 bg-white/60 shadow-sm -translate-x-1/2 pointer-events-none"
        aria-hidden
      />

      {/* draggable handle */}
      <div
        ref={handleRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        style={{ left: `${pos}%` }}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center cursor-ew-resize"
        title="Drag to compare"
      >
        <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none">
          <path d="M10 6 L6 12 L10 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 6 L18 12 L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* accessible range input fallback/control */}
      <input
        type="range"
        min="0"
        max="100"
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute left-2 right-2 bottom-2 opacity-60"
        aria-label="Compare slider"
      />
    </div>
  );
}

export default function Examples() {
  const [modalOpen, setModalOpen] = useState(false);
  const [active, setActive] = useState(null);

  function openModal(idx) {
    setActive(idx);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    setModalOpen(false);
    setActive(null);
    document.body.style.overflow = "";
  }

  return (
    <section id="examples" className="py-6">
      <h2 className="text-2xl font-semibold">Before & After</h2>
      <p className="text-sm text-gray-500 mt-2">Example restorations produced by the model — drag the handle to compare.</p>

      <div className="grid sm:grid-cols-3 gap-6 mt-6">
        {examples.map((ex, i) => (
          <article
            key={i}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-0 overflow-hidden cursor-zoom-in"
            onClick={() => openModal(i)}
          >
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">{ex.caption}</h3>

              {/* compare preview */}
              <CompareSlider beforeSrc={ex.input} afterSrc={ex.output} altBefore={`input-${i}`} altAfter={`output-${i}`} />

              <div className="mt-3 text-xs text-gray-500">Click to open larger view</div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal for fullscreen compare */}
      {modalOpen && active != null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">{examples[active].caption}</h4>
              <button onClick={closeModal} className="text-gray-600 px-3 py-1 rounded hover:bg-gray-100">Close</button>
            </div>

            <div className="p-4">
              <CompareSlider beforeSrc={examples[active].input} afterSrc={examples[active].output} altBefore="before" altAfter="after" />
            </div>

            <div className="p-4 border-t flex items-center justify-end gap-2">
              <a href={examples[active].output} target="_blank" rel="noreferrer" className="text-sm px-4 py-2 bg-primary text-white rounded">Open result</a>
              <button onClick={closeModal} className="text-sm px-4 py-2 border rounded">Done</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
