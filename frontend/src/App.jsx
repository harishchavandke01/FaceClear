import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import UploadCard from './components/UploadCard'
import Examples from './components/Examples'
import Footer from './components/Footer'


export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Hero />
        <div className="mt-8">
          <UploadCard />
        </div>
        <div className="mt-12">
          <Examples />
        </div>
      </main>
      <Footer />
    </div>
  )
}