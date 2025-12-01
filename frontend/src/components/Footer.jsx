import React from 'react'


export default function Footer() {
    return (
        <footer className="bg-white border-t mt-12">
            <div className="container mx-auto px-4 py-6 text-sm text-gray-600 flex items-center justify-between">
                <div>© {new Date().getFullYear()} FaceClear • Built with ❤️</div>
                <div className="flex gap-4">
                    <a href="#">Privacy</a>
                    <a href="#">Docs</a>
                    <a href="#">GitHub</a>
                </div>
            </div>
        </footer>
    )
}