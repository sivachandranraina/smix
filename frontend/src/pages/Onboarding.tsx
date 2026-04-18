import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Profile fields
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Male');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  // Community fields
  const [gothram, setGothram] = useState('');
  const [nakshatram, setNakshatram] = useState('');

  // Preference fields
  const [targetGender, setTargetGender] = useState('Female');
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(35);

  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Update Profile
      await axios.put('http://127.0.0.1:8000/users/profile', {
        full_name: fullName,
        age: Number(age),
        gender,
        location,
        bio,
        gothram,
        nakshatram,
        photos: photoUrl ? [photoUrl] : []
      }, { headers });

      // Update Preferences
      await axios.put('http://127.0.0.1:8000/users/preferences', {
        target_gender_interest: targetGender,
        min_age_preference: minAge,
        max_age_preference: maxAge
      }, { headers });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMGYxNzJhIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzQxNTUiPjwvcmVjdD4KPC9zdmc+')]">
      <div className="w-full max-w-2xl bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-8 md:p-12 rounded-3xl shadow-2xl relative">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Complete Your Profile</h2>

        {/* Progress Bar */}
        <div className="w-full bg-slate-700 h-2 rounded-full mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-accent h-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2">Basic Info</h3>

            {/* Image Uploader */}
            <div className="mb-8">
              <ImageUpload onImageUploaded={setPhotoUrl} currentImage={photoUrl} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500" placeholder="e.g. Rahul S." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                <input type="number" min="18" value={age} onChange={e => setAge(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500" placeholder="25" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500" placeholder="City, State" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500 h-24 resize-none" placeholder="Tell us a little about yourself..." />
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors">Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2">Sourashtra Community Specifics</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Gothram</label>
              <input type="text" value={gothram} onChange={e => setGothram(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500" placeholder="Type or select below..." />
              <div className="flex flex-wrap gap-2 mt-3">
                {['Markandeiyan', 'Bharadwaja', 'Gautama', 'Jamadagni', 'Kashyapa', 'Vasishta', 'Vishwamitra', 'Koundinya', 'Srivatsa'].map(g => (
                  <button 
                    key={g} 
                    onClick={() => setGothram(g)} 
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${gothram === g ? 'bg-primary-600/30 border-primary-500/50 text-primary-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-300'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nakshatram (Optional)</label>
              <input type="text" value={nakshatram} onChange={e => setNakshatram(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500" placeholder="Type or select below..." />
              <div className="flex flex-wrap gap-2 mt-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'].map(n => (
                  <button 
                    key={n} 
                    onClick={() => setNakshatram(n)} 
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${nakshatram === n ? 'bg-accent/30 border-accent/50 text-accent' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-slate-300'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(1)} className="w-1/3 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors">Back</button>
              <button onClick={() => setStep(3)} className="w-2/3 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-colors">Continue</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-slate-200 border-b border-slate-700 pb-2">Match Preferences</h3>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">I am looking for</label>
              <select value={targetGender} onChange={e => setTargetGender(e.target.value)} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500">
                <option value="Male">Men</option>
                <option value="Female">Women</option>
                <option value="Both">Everyone</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Min Age</label>
                <input type="number" value={minAge} onChange={e => setMinAge(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Max Age</label>
                <input type="number" value={maxAge} onChange={e => setMaxAge(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-primary-500" />
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary-900/40 border border-primary-500/20 rounded-xl text-primary-200 text-sm">
              Note: We have generated a placeholder image for your profile automatically. You can update this later in settings.
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(2)} className="w-1/3 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors">Back</button>
              <button onClick={handleComplete} disabled={loading} className="w-2/3 py-3.5 bg-gradient-to-r from-primary-600 to-accent hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/20">
                {loading ? 'Saving...' : 'Complete Profile'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
