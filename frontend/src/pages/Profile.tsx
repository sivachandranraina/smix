import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(18);
  const [gender, setGender] = useState('Male');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [gothram, setGothram] = useState('');
  const [nakshatram, setNakshatram] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Preferences fields
  const [targetGender, setTargetGender] = useState('Female');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [profileRes, prefRes] = await Promise.all([
        axios.get('http://127.0.0.1:8000/users/profile', { headers }),
        axios.get('http://127.0.0.1:8000/users/preferences', { headers })
      ]);

      const p = profileRes.data;
      setFullName(p.full_name || '');
      setAge(p.age || 18);
      setGender(p.gender || 'Male');
      setLocation(p.location || '');
      setBio(p.bio || '');
      setGothram(p.gothram || '');
      setNakshatram(p.nakshatram || '');
      setPhotoUrl(p.photos?.[0] || '');

      const pref = prefRes.data;
      setTargetGender(pref.target_gender_interest || 'Female');
      setMinAge(pref.min_age_preference || 18);
      setMaxAge(pref.max_age_preference || 35);

    } catch (err) {
      console.error(err);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await Promise.all([
        axios.put('http://127.0.0.1:8000/users/profile', {
          full_name: fullName,
          age,
          gender,
          location,
          bio,
          gothram,
          nakshatram,
          photos: photoUrl ? [photoUrl] : []
        }, { headers }),
        axios.put('http://127.0.0.1:8000/users/preferences', {
          target_gender_interest: targetGender,
          min_age_preference: minAge,
          max_age_preference: maxAge
        }, { headers })
      ]);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-primary-500">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pb-20">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
            <Link to="/dashboard" className="text-slate-400 hover:text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
            </Link>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all text-sm font-semibold">
                Logout
            </button>
        </header>

        <section className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 space-y-8">
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary-400 border-b border-slate-700 pb-2">Profile Picture</h3>
                <ImageUpload onImageUploaded={setPhotoUrl} currentImage={photoUrl} />
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-primary-400 border-b border-slate-700 pb-2">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Age</label>
                        <input type="number" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-2">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 h-24 outline-none focus:border-primary-500 resize-none" />
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-semibold text-primary-400 border-b border-slate-700 pb-2">Match Preferences</h3>
                <div className="space-y-4">
                    <label className="block text-sm text-slate-400">Interested in</label>
                    <div className="flex gap-4">
                        {['Male', 'Female', 'Both'].map(g => (
                            <button 
                                key={g} 
                                onClick={() => setTargetGender(g)}
                                className={`flex-1 py-3 rounded-xl border transition-all ${targetGender === g ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Min Age</label>
                        <input type="number" value={minAge} onChange={e => setMinAge(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Max Age</label>
                        <input type="number" value={maxAge} onChange={e => setMaxAge(Number(e.target.value))} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none focus:border-primary-500" />
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent text-white font-bold rounded-2xl shadow-xl shadow-primary-500/20 hover:opacity-90 transition-all disabled:opacity-50"
            >
                {saving ? 'Saving...' : 'SAVE CHANGES'}
            </button>
        </section>
      </div>
    </div>
  );
}
