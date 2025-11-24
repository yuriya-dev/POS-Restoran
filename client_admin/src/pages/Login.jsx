import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, AlertTriangle, Loader2 } from 'lucide-react'; // Icon Sama

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Logic Redirect Pintar (Versi Kasir)
  const handleRedirect = (role) => {
    if (role === 'kasir') {
        // Sudah di Kasir App, navigasi biasa
        navigate('/', { replace: true });
    } else if (role === 'admin') {
        // Pindah ke Admin App
        // Production: Root domain ('/'). Development: Port 5173
        const adminUrl = import.meta.env.PROD ? '/' : 'http://localhost:5173';
        window.location.href = adminUrl;
    }
  };

  useEffect(() => {
    if (user) handleRedirect(user.role);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Username dan Password wajib diisi.');
      setIsLoading(false);
      return;
    }

    try {
      const userData = await login(username, password);
      handleRedirect(userData.role);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          {/* Styling Identik */}
          <div className="bg-blue-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">POS Restoran</h2>
          <p className="text-sm text-gray-500 mt-1">Masuk untuk melanjutkan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 flex items-center space-x-2 rounded-r-md text-sm animate-pulse">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
                <input
                id="username"
                type="text"
                className="peer block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors placeholder-transparent bg-gray-50 focus:bg-white"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                />
                <label
                htmlFor="username"
                className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"
                >
                Username
                </label>
            </div>

            <div className="relative">
                <input
                id="password"
                type="password"
                className="peer block w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-0 transition-colors placeholder-transparent bg-gray-50 focus:bg-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                />
                <label
                htmlFor="password"
                className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600"
                >
                Password
                </label>
            </div>
          </div>
          
          <button
            type="submit"
            className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all transform active:scale-95
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-600/30'}
            `}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;