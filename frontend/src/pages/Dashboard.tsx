import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

interface Profile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  gothram?: string;
  nakshatram?: string;
  photos?: string[];
}

export default function Dashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showMatch, setShowMatch] = useState<Profile | null>(null);

  useEffect(() => {
    fetchDiscoverProfiles();
  }, []);

  const fetchDiscoverProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const response = await axios.get('http://127.0.0.1:8000/users/discover', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(response.data);
      setCurrentIndex(0); // Reset index when new profiles are fetched
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    const target = profiles[currentIndex];
    if (!target) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = direction === 'right' ? `/users/like/${target.id}` : `/users/pass/${target.id}`;
      
      const response = await axios.post(`http://127.0.0.1:8000${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (direction === 'right' && response.data.match) {
        setShowMatch(target);
      }

      // Move to next card
      if (currentIndex === profiles.length - 1) {
        // Fetch more if we reached the end
        fetchDiscoverProfiles();
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } catch (err) {
      console.error('Swipe action failed:', err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-primary-500 font-semibold text-xl tracking-wider">LOADING SMIX...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center">
      <header className="w-full bg-slate-800/80 backdrop-blur-md border-b border-slate-700 py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent">SMIX</h1>
        <div className="flex gap-1">
          <Link to="/activity" className="p-2 text-slate-300 hover:text-primary-400 transition rounded-full hover:bg-slate-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>
          <Link to="/profile" className="p-2 text-slate-300 hover:text-white transition rounded-full hover:bg-slate-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-sm sm:max-w-md flex flex-col items-center justify-center p-4 relative">
        {currentIndex < profiles.length ? (
          <div className="w-full flex flex-col items-center gap-6">
            {/* Profile Card */}
            <div className="w-full aspect-[3/4] bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden relative">
              {profiles[currentIndex].photos?.[0] ? (
                <img
                  src={profiles[currentIndex].photos[0]}
                  className="w-full h-full object-cover"
                  alt={profiles[currentIndex].full_name}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="w-28 h-28 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                    <svg className="w-14 h-14 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No photo added yet</p>
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-6 text-white space-y-2">
                <h2 className="text-3xl font-bold font-sans tracking-tight">
                  {profiles[currentIndex].full_name}, {profiles[currentIndex].age}
                </h2>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {profiles[currentIndex].location}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profiles[currentIndex].gothram && (
                    <span className="px-3 py-1 bg-primary-600/30 border border-primary-500/30 rounded-full text-xs font-semibold text-primary-200 backdrop-blur-sm">
                      Gothram: {profiles[currentIndex].gothram}
                    </span>
                  )}
                  {profiles[currentIndex].nakshatram && (
                    <span className="px-3 py-1 bg-accent/30 border border-accent/30 rounded-full text-xs font-semibold text-accent backdrop-blur-sm">
                      Star: {profiles[currentIndex].nakshatram}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 mt-1 text-sm line-clamp-2">
                  {profiles[currentIndex].bio}
                </p>
              </div>
            </div>

            {/* Static Action Buttons */}
            <div className="flex items-center justify-center gap-8">
              <button
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-red-500/50 rounded-full flex items-center justify-center text-red-400 shadow-xl transition-all hover:scale-110 active:scale-95"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button
                onClick={() => handleSwipe('right')}
                className="w-20 h-20 bg-gradient-to-r from-primary-600 to-accent hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-2xl shadow-primary-500/30 transition-all hover:scale-110 active:scale-95"
              >
                <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700">
              <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">You've caught up!</h2>
            <p className="text-slate-400">Expand your preferences to see more profiles.</p>
            <Link to="/profile" className="px-6 py-2.5 mt-4 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-full transition-colors text-center inline-block">
              Update Preferences
            </Link>
          </div>
        )}
      </main>

      {/* Match Overlay Modal */}
      {showMatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md animate-fade-in p-6">
          <div className="max-w-md w-full text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent animate-bounce">
              IT'S A MATCH!
            </h2>
            
            <div className="flex justify-center -space-x-4">
              {/* Matched user's photo */}
              <div className="w-32 h-32 rounded-full border-4 border-primary-500 overflow-hidden shadow-2xl shadow-primary-500/20 transform -rotate-6 bg-slate-800 flex items-center justify-center">
                {showMatch.photos?.[0] ? (
                  <img src={showMatch.photos[0]} alt="Match" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-14 h-14 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              {/* Your own avatar placeholder */}
              <div className="w-32 h-32 rounded-full border-4 border-accent overflow-hidden shadow-2xl shadow-accent/20 transform rotate-6 relative z-10 bg-gradient-to-br from-primary-700 to-accent flex items-center justify-center">
                <svg className="w-14 h-14 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <p className="text-xl text-slate-300">
              You and <span className="text-white font-bold">{showMatch.full_name}</span> liked each other.
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => setShowMatch(null)}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 hover:opacity-90 transition-all hover:scale-[1.02]"
              >
                SEND A MESSAGE
              </button>
              <button 
                onClick={() => setShowMatch(null)}
                className="w-full py-4 bg-slate-800 text-slate-300 font-bold rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all"
              >
                KEEP SWIPING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
