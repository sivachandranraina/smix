import { useState } from 'react'
import { Link } from 'react-router-dom'
function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-primary-500 selection:text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-accent rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-primary-500/30">
              S
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-100 to-white">
              SMIX
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Discover</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Matches</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Messages</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all">
              Log In
            </Link>
            <Link to="/register" className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 rounded-full shadow-md shadow-primary-500/20 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5">
              Join Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center mt-20 md:mt-0">
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            Find your perfect match within the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent">Sourashtra</span> community.
          </h2>
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Meaningful connections tailored to our shared heritage, values, and traditions. Join SMIX and thousands of others discovering true love today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-accent hover:from-primary-500 hover:to-pink-500 rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/50 transition-all transform hover:-translate-y-1">
              Create Your Profile
            </button>
            <button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 backdrop-blur-sm border border-slate-700/50 rounded-full transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="w-full max-w-6xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 pb-24">
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 transition-colors">
            <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center text-primary-400 mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Verified Profiles</h3>
            <p className="text-slate-400 leading-relaxed">Every member is authenticated to ensure a secure and trusted environment for our community.</p>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 transition-colors">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Smart Matchmaking</h3>
            <p className="text-slate-400 leading-relaxed">Our advanced algorithm finds partners who share your exact cultural values and life goals.</p>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800/60 transition-colors">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Secure Chat</h3>
            <p className="text-slate-400 leading-relaxed">Connect and communicate safely with potential matches through our end-to-end encrypted messaging.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
