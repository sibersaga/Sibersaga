import React, { useState } from 'react';
import { ShieldAlert, X, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      setIsLoading(false);
      if (success) {
        setUsername('');
        setPassword('');
        onClose();
      } else {
        setError('Kombinasi nama pengguna atau sandi admin tidak tepat!');
      }
    } catch (err) {
      setIsLoading(false);
      setError('Terjadi kesalahan saat login.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      id="admin-login-modal-overlay"
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-sky-100 overflow-hidden flex flex-col text-slate-800"
        onClick={(e) => e.stopPropagation()}
        id="admin-login-modal-container"
      >
        {/* Decorative Header Banner */}
        <div className="bg-gradient-to-r from-sky-900 to-sky-950 p-6 text-white relative">
          <div className="absolute top-4 right-4">
            <button 
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-md">
              <Lock size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight font-display uppercase">
                Akses Administrator
              </h2>
              <p className="text-[10px] text-sky-200/80 font-bold font-mono">
                Sistem Manajemen Konten SDN 3 Purwosari
              </p>
            </div>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-2xl border border-red-100 animate-shake">
              <ShieldAlert size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono flex items-center gap-1">
              <User size={10} />
              <span>Nama Pengguna</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username admin..."
              className="w-full p-3 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-sans"
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono flex items-center gap-1">
              <Lock size={10} />
              <span>Kata Sandi Resmi</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin..."
                className="w-full p-3 pr-10 text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Hint Card */}
          <div className="p-3 bg-slate-50 border border-slate-200/50 rounded-2xl text-[10px] text-slate-500 space-y-1">
            <p className="font-extrabold uppercase tracking-wide text-slate-700 font-mono">
              Petunjuk Kredensial Uji Coba:
            </p>
            <p className="font-medium font-mono leading-relaxed">
              Username: <strong className="text-orange-600">admin</strong> <br />
              Password: <strong className="text-orange-600">admin3purwosari</strong>
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-sky-900 to-sky-950 hover:from-sky-950 hover:to-sky-900 text-white font-black text-xs rounded-xl shadow-lg shadow-sky-950/10 hover:shadow-sky-950/20 transition-all hover:-translate-y-0.5 cursor-pointer text-center uppercase tracking-widest font-mono disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? 'MEMVERIFIKASI...' : 'MASUK SISTEM'}
          </button>
        </form>
      </div>
    </div>
  );
};
