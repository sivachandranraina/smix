import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      
      const response = await axios.post('http://127.0.0.1:8000/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard'); // Navigate to dashboard after login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Back Link */}
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Home</span>
        </Link>
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      
        <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl shadow-2xl relative z-10">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Welcome Back</h2>
            <p className="text-slate-400 text-center mb-8">Sign in to find your Sourashtra match on SMIX</p>
            
            {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white outline-none transition-all placeholder:text-slate-500"
                        placeholder="hello@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white outline-none transition-all placeholder:text-slate-500"
                        placeholder="••••••••"
                        required
                    />
                </div>
                
                <button type="submit" className="w-full py-3.5 mt-4 text-white font-semibold rounded-xl bg-gradient-to-r from-primary-600 to-accent hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25">
                    Sign In
                </button>
            </form>

            <p className="mt-8 text-center text-slate-400 text-sm">
                Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">Join now</Link>
            </p>
        </div>
    </div>
  );
}
