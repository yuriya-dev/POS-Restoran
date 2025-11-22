import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Monitor, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.username, form.password);
            navigate('/'); // Redirect ke Denah Meja
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
                        <Monitor className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">Login Kasir</h1>
                    <p className="text-gray-500 text-sm">Masuk untuk memulai shift</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" /> {error}
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Username</label>
                        <input 
                            type="text" 
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-600 focus:ring-0 outline-none transition font-medium"
                            value={form.username}
                            onChange={e => setForm({...form, username: e.target.value})}
                            placeholder="kasir01"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-600 focus:ring-0 outline-none transition font-medium"
                            value={form.password}
                            onChange={e => setForm({...form, password: e.target.value})}
                            placeholder="••••••"
                        />
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/30 flex justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'BUKA KASIR'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;