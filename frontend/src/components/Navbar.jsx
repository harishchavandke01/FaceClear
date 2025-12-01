import React, { useEffect, useState } from "react";

export default function Navbar() {
    const [open, setOpen] = useState(false); // mobile menu
    const [scrolled, setScrolled] = useState(false);
    // prefer 'class' dark mode by toggling 'dark' on <html>
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem("fc:theme") ||
                (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        } catch {
            return "light";
        }
    });

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 8);
        }
        window.addEventListener("scroll", onScroll);
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        // apply theme by toggling `dark` class on <html> so Tailwind 'dark:' works
        try {
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            localStorage.setItem("fc:theme", theme);
        } catch { }
    }, [theme]);

    // smooth scroll for in-page anchors (keeps behaviour)
    useEffect(() => {
        function handleAnchorClicks(e) {
            const a = e.target.closest("a[href^='#']");
            if (!a) return;
            const href = a.getAttribute("href");
            if (!href || href === "#") return;
            e.preventDefault();
            const el = document.querySelector(href);
            if (!el) return;
            const top = el.getBoundingClientRect().top + window.scrollY - 72; // offset for navbar
            window.scrollTo({ top, behavior: "smooth" });
            setOpen(false); // close mobile menu
        }
        document.addEventListener("click", handleAnchorClicks);
        return () => document.removeEventListener("click", handleAnchorClicks);
    }, []);

    function toggleTheme() {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
    }

    return (
        <header
            className={`fixed w-full z-40 transition-colors duration-300 ${scrolled
                    ? "backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 shadow-sm border-b border-gray-200 dark:border-gray-800"
                    : "bg-transparent"
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Brand */}
                    <a href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-r from-blue-600 to-teal-400 text-white font-bold shadow">
                            FC
                        </div>
                        <div className="leading-tight">
                            <div className={`text-xl font-semibold transition-all duration-300
  ${scrolled ? 'text-gray-900 dark:text-white' : 'text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]'}`}>
                                FaceClear
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">AI Face Deblurring</div>
                        </div>
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                            Features
                        </a>
                        <a href="#examples" className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                            Examples
                        </a>
                        <a href="#docs" className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                            Docs
                        </a>
                        <a href="/pricing" className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                            Pricing
                        </a>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            title="Toggle theme"
                        >
                            {theme === "dark" ? (
                                // sun icon (visible on dark)
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
                                    <path d="M12 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 19v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.2 4.2l1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.4 18.4l1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M1 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.2 19.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            ) : (
                                // moon icon (visible on light)
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-700 dark:text-gray-200">
                                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        {/* CTA */}
                        <a
                            href="#upload"
                            className="ml-2 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm shadow hover:bg-blue-700"
                        >
                            Try Now
                        </a>
                    </nav>

                    {/* Mobile controls */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            {theme === "dark" ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
                                    <path d="M12 3v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 19v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.2 4.2l1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.4 18.4l1.4 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M1 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M21 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.2 19.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-700 dark:text-gray-200">
                                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                            aria-label="Open menu"
                            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                            {/* hamburger / close */}
                            {open ? (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-700 dark:text-gray-200">
                                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-700 dark:text-gray-200">
                                    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu drawer */}
            <div className={`md:hidden transition-max-height duration-300 ease-in-out overflow-hidden ${open ? "max-h-96" : "max-h-0"}`}>
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/90">
                    <div className="flex flex-col gap-3">
                        <a onClick={() => setOpen(false)} href="#features" className="text-gray-800 dark:text-gray-200">Features</a>
                        <a onClick={() => setOpen(false)} href="#examples" className="text-gray-800 dark:text-gray-200">Examples</a>
                        <a onClick={() => setOpen(false)} href="#docs" className="text-gray-800 dark:text-gray-200">Docs</a>
                        <a onClick={() => setOpen(false)} href="/pricing" className="text-gray-800 dark:text-gray-200">Pricing</a>

                        <div className="mt-2 flex items-center gap-3">
                            <a href="#upload" onClick={() => setOpen(false)} className="flex-1 inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md">Try Now</a>
                            <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                {theme === "dark" ? "Light" : "Dark"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
