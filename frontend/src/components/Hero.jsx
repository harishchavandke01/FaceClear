import React from "react";

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10">
                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-white via-sky-50 to-sky-100 opacity-80"
                />
            </div>

            <div className="container mx-auto px-6 lg:px-8 py-16">
                <div className="grid gap-10 md:grid-cols-2 items-center">
                    {/* Left column: copy */}
                    <div>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M12 2v6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M20 12h-6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 22v-6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span className="text-xs text-black">Instant face restoration</span>
                            </span>
                            <span className="text-xs text-gray-500">Beta</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
                            Restore faces from motion blur — <span className="text-primary">fast</span>,{" "}
                            <span className="text-accent">realistic</span>, and identity-preserving.
                        </h1>

                        <p className="mt-5 text-gray-600 max-w-2xl leading-relaxed">
                            FaceClear uses a lightweight neural model to remove blur from face photos while keeping
                            facial details intact. Upload a blurred photo, preview results instantly, and download
                            the restored image.
                        </p>

                        {/* CTAs */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                            <a
                                href="#upload"
                                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-black text-sm font-semibold shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                Try it now
                                <svg
                                    className="ml-3 -mr-1 w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </a>

                            <a
                                href="#features"
                                className="inline-flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                How it works
                            </a>
                        </div>

                        {/* micro-stats & trust */}
                        <div className="mt-8 flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-gray-900">0.5s</div>
                                    <div className="text-xs text-gray-500">avg inference</div>
                                </div>
                                <div className="h-10 w-px bg-gray-200 mx-4" />
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-gray-900">98%</div>
                                    <div className="text-xs text-gray-500">identity preservation</div>
                                </div>
                            </div>

                            <div className="ml-2 text-sm text-gray-500">
                                Trusted by prototypes • Works on mobile photos
                            </div>
                        </div>
                    </div>

                    {/* Right column: mockup */}
                    <div className="relative">
                        <div className="transform hover:scale-[1.01] transition-transform duration-300">
                            <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
                                {/* top tabs */}
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-2 h-2 rounded-full bg-red-400" />
                                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                        <span className="w-2 h-2 rounded-full bg-green-400" />
                                    </div>
                                    <div className="text-xs text-gray-400">Preview</div>
                                </div>



                                <div className="grid grid-cols-2 gap-3">
                                    <figure className="rounded-lg overflow-hidden border border-gray-100 bg-gray-50 h-70 flex items-center justify-center">
                                        <img
                                            src="/examples/input1.jpg"
                                            alt="Blurred sample"
                                            className="max-h-48 max-w-full object-contain"
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                    </figure>

                                    <figure className="rounded-lg overflow-hidden border border-gray-100 h-70 flex items-center justify-center">
                                        <img
                                            src="/examples/output1.jpg"
                                            alt="Restored sample"
                                            className="max-h-48 max-w-full object-contain"
                                            style={{ width: 'auto', height: 'auto' }}
                                        />
                                    </figure>
                                </div>


                                {/* buttons */}
                                <div className="mt-4 flex gap-3">
                                    <a
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-md text-sm shadow-sm hover:opacity-95"
                                        href="#upload"
                                    >
                                        Upload your photo
                                    </a>
                                    <a
                                        className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                        href="#examples"
                                    >
                                        See more examples
                                    </a>
                                </div>

                                {/* small hint */}
                                <div className="mt-3 text-xs text-gray-400">Tip: Crop to the face for best results.</div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>

            {/* decorative SVG wave separator */}
            <div className="-mt-10">
                <svg viewBox="0 0 1440 80" className="w-full" preserveAspectRatio="none">
                    <path d="M0,40 C200,80 400,0 720,40 C1040,80 1240,0 1440,40 L1440 80 L0 80 Z" fill="white" />
                </svg>
            </div>
        </section>
    );
}
