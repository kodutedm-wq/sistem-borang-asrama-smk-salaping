import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  KeyRound, 
  X, 
  AlertCircle,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { SalapingLogo } from './SalapingLogo';

export interface AdminUser {
  role: 'warden' | 'pengetua';
  name: string;
  title: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Log Masuk Warden
    if ((cleanUser === 'warden' || cleanUser === 'warden.salaping') && cleanPass === 'asrama2026') {
      onLoginSuccess({
        role: 'warden',
        name: 'Warden',
        title: 'Pengurusan Asrama'
      });
      setUsername('');
      setPassword('');
      onClose();
      return;
    }

    // Log Masuk Pengetua
    if ((cleanUser === 'pengetua' || cleanUser === 'pengetua.salaping') && cleanPass === 'salaping2026') {
      onLoginSuccess({
        role: 'pengetua',
        name: 'Pengetua',
        title: 'Pengurusan Sekolah'
      });
      setUsername('');
      setPassword('');
      onClose();
      return;
    }

    setErrorMsg('ID Pengguna atau Kata Laluan tidak sah. Sila semak semula.');
  };

  const handleClose = () => {
    setErrorMsg(null);
    setUsername('');
    setPassword('');
    onClose();
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden text-slate-900 ring-1 ring-slate-900/5">
        
        {/* Exclusive Obsidian & Gold Header */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 p-6 text-white text-center relative border-b border-slate-800">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-black rounded-2xl border border-slate-700 ring-2 ring-amber-400/30 flex items-center justify-center mx-auto mb-3 shadow-lg overflow-hidden p-1">
            <SalapingLogo className="w-full h-full" />
          </div>

          <h2 className="text-base font-extrabold tracking-tight flex items-center justify-center gap-1.5">
            <span>Log Masuk Pentadbiran</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            SMK Salaping • Portal Kawalan Warden & Pengetua
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2.5 text-xs text-rose-800 shadow-2xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ID Pengguna
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ID Pengguna"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Kata Laluan
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Laluan"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-[11px] text-slate-500 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Kawasan capaian terhad. Sila masukkan ID pengguna dan kata laluan rasmi pentadbir anda.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all cursor-pointer ring-1 ring-slate-800"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Log Masuk</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
