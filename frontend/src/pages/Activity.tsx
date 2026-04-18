import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  location?: string;
  bio?: string;
  gothram?: string;
  nakshatram?: string;
  photos?: string[];
}

interface ActivityData {
  matches: Profile[];
  liked:   Profile[];
  passed:  Profile[];
}

type Tab = 'matches' | 'liked' | 'passed';

const TAB_CONFIG: { key: Tab; label: string; icon: string; accent: string }[] = [
  { key: 'matches', label: 'Matches', icon: '💜', accent: 'border-primary-500 text-primary-400' },
  { key: 'liked',   label: 'Liked',   icon: '❤️',  accent: 'border-pink-400 text-pink-400' },
  { key: 'passed',  label: 'Passed',  icon: '✖',   accent: 'border-slate-400 text-slate-400' },
];

// ------------------------------------------------------------------
// ProfileCard
// ------------------------------------------------------------------
function ProfileCard({
  profile,
  tab,
  onAction,
}: {
  profile: Profile;
  tab: Tab;
  onAction: (profileId: string, action: 'unlike' | 'unpass' | 'unmatch') => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const photo = profile.photos?.[0];

  const handleAction = async (action: 'unlike' | 'unpass' | 'unmatch') => {
    setBusy(true);
    try { await onAction(profile.id, action); }
    finally { setBusy(false); }
  };

  return (
    <div className="relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden group hover:border-slate-600 transition-all flex flex-col">
      {/* Photo / avatar */}
      <div className="aspect-[3/4] overflow-hidden">
        {photo ? (
          <img
            src={photo}
            alt={profile.full_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-2">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-slate-600 text-[10px]">No photo</p>
          </div>
        )}
      </div>

      {/* Gradient + info overlay */}
      <div className="absolute inset-x-0 bottom-10 h-1/2 bg-gradient-to-t from-slate-900/95 to-transparent pointer-events-none" />

      <div className="absolute bottom-10 left-0 w-full px-3 pb-1 space-y-0.5">
        <p className="text-white font-bold text-sm leading-tight">
          {profile.full_name || 'Unknown'}, {profile.age}
        </p>
        {profile.location && (
          <p className="text-slate-400 text-[10px] flex items-center gap-0.5 truncate">
            <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {profile.location}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {profile.gothram && (
            <span className="px-1.5 py-0.5 bg-primary-600/30 text-primary-300 text-[9px] font-semibold rounded-full border border-primary-500/30">
              {profile.gothram}
            </span>
          )}
          {profile.nakshatram && (
            <span className="px-1.5 py-0.5 bg-accent/20 text-accent text-[9px] font-semibold rounded-full border border-accent/30">
              {profile.nakshatram}
            </span>
          )}
        </div>
      </div>

      {/* Action button row */}
      <div className="flex border-t border-slate-700">
        {tab === 'liked' && (
          <button
            onClick={() => handleAction('unlike')}
            disabled={busy}
            title="Dislike"
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
          >
            {busy ? '…' : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Dislike
              </>
            )}
          </button>
        )}

        {tab === 'passed' && (
          <button
            onClick={() => handleAction('unpass')}
            disabled={busy}
            title="Like"
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-semibold text-pink-400 hover:bg-pink-500/10 transition-colors disabled:opacity-40"
          >
            {busy ? '…' : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Like
              </>
            )}
          </button>
        )}

        {tab === 'matches' && (
          <button
            onClick={() => handleAction('unmatch')}
            disabled={busy}
            title="Unmatch"
            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-semibold text-slate-400 hover:bg-slate-700 transition-colors disabled:opacity-40"
          >
            {busy ? '…' : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Unmatch
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Empty state
// ------------------------------------------------------------------
function EmptyState({ tab }: { tab: Tab }) {
  const messages: Record<Tab, { emoji: string; title: string; sub: string }> = {
    matches: { emoji: '💜', title: 'No matches yet',               sub: 'Keep swiping — your match is out there!' },
    liked:   { emoji: '❤️', title: 'You haven\'t liked anyone yet', sub: 'Head to Discover and start swiping right.'  },
    passed:  { emoji: '✖',  title: 'No passed profiles',            sub: 'Profiles you pass will appear here.'        },
  };
  const m = messages[tab];
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
      <span className="text-5xl">{m.emoji}</span>
      <h3 className="text-xl font-bold text-white">{m.title}</h3>
      <p className="text-slate-400 text-sm max-w-xs">{m.sub}</p>
      {tab !== 'passed' && (
        <Link to="/dashboard" className="mt-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-full transition-colors">
          Go to Discover
        </Link>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Main page
// ------------------------------------------------------------------
export default function Activity() {
  const [activeTab, setActiveTab] = useState<Tab>('matches');
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchActivity = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await axios.get('http://127.0.0.1:8000/users/activity', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchActivity(); }, [fetchActivity]);

  const handleAction = async (profileId: string, action: 'unlike' | 'unpass' | 'unmatch') => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://127.0.0.1:8000/users/${action}/${profileId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh data to reflect updated lists
      await fetchActivity();
    } catch (err) {
      console.error(`Action ${action} failed:`, err);
    }
  };

  const profiles = data?.[activeTab] ?? [];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium text-sm">Discover</span>
          </Link>
          <h1 className="text-xl font-bold text-white">My Activity</h1>
          <div className="w-20" />
        </div>

        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-6 flex border-t border-slate-700/50">
          {TAB_CONFIG.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold border-b-2 transition-all ${
                activeTab === t.key ? t.accent : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {data && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === t.key ? 'bg-primary-600/30' : 'bg-slate-700'}`}>
                  {data[t.key].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profiles.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                tab={activeTab}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
