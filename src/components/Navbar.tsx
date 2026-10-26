import React from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  FileText, 
  Printer, 
  Users, 
  PlusCircle, 
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkles
} from 'lucide-react';
import { AdminUser } from './LoginModal';
import { SalapingLogo } from './SalapingLogo';

interface NavbarProps {
  activeTab: 'dashboard' | 'form' | 'borang-a4' | 'senarai-pengetua';
  setActiveTab: (tab: 'dashboard' | 'form' | 'borang-a4' | 'senarai-pengetua') => void;
  onNewApplication: () => void;
  selectedStudentName?: string;
  totalStudents: number;
  userRole: 'pemohon' | 'pentadbir';
  setUserRole: (role: 'pemohon' | 'pentadbir') => void;
  onPrintCurrentA4?: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  loggedInUser?: AdminUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewApplication,
  selectedStudentName,
  totalStudents,
  userRole,
  setUserRole,
  onPrintCurrentA4,
  onOpenLoginModal,
  onLogout,
  loggedInUser
}) => {
  return (
    <header className="no-print bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Official Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-sm border border-slate-800 ring-2 ring-amber-400/25 shrink-0 transition-transform hover:scale-105">
              <SalapingLogo className="w-full h-full p-0.5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>e-Asrama Salaping</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs ${
                  userRole === 'pemohon' 
                    ? 'bg-sky-50 text-sky-800 border border-sky-200/80 ring-1 ring-sky-300/30' 
                    : 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 border border-amber-200/80 ring-1 ring-amber-300/30'
                }`}>
                  {userRole === 'pemohon' ? 'Portal Pemohon' : 'Akses Pentadbir'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                SMK Salaping • Sistem Kemasukan Khas Asrama Harian
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links with Soft Pastel Active States */}
          <nav className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60 shadow-2xs">
            
            {/* PEMOHON / PELAJAR TABS: Only Form and A4 PDF */}
            {userRole === 'pemohon' ? (
              <>
                <button
                  onClick={onNewApplication}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'form'
                      ? 'bg-white text-sky-900 shadow-xs border border-sky-100 font-bold ring-1 ring-sky-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <PlusCircle className={`w-3.5 h-3.5 ${activeTab === 'form' ? 'text-sky-600' : 'text-slate-500'}`} />
                  Borang Permohonan Baru
                </button>

                <button
                  onClick={() => setActiveTab('borang-a4')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'borang-a4'
                      ? 'bg-white text-emerald-900 shadow-xs border border-emerald-100 font-bold ring-1 ring-emerald-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${activeTab === 'borang-a4' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  Borang Rasmi A4 (Cetak PDF)
                  {selectedStudentName && (
                    <span className="hidden sm:inline max-w-[90px] truncate text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-normal">
                      {selectedStudentName.split(' ')[0]}
                    </span>
                  )}
                </button>
              </>
            ) : (
              /* PENTADBIR TABS: Full Access for Warden & Pengetua */
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-indigo-900 shadow-xs border border-indigo-100 font-bold ring-1 ring-indigo-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <LayoutDashboard className={`w-3.5 h-3.5 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-500'}`} />
                  Papan Analisis ({totalStudents})
                </button>

                <button
                  onClick={() => setActiveTab('senarai-pengetua')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'senarai-pengetua'
                      ? 'bg-white text-amber-900 shadow-xs border border-amber-100 font-bold ring-1 ring-amber-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Users className={`w-3.5 h-3.5 ${activeTab === 'senarai-pengetua' ? 'text-amber-600' : 'text-slate-500'}`} />
                  Senarai Pengetua
                </button>

                <button
                  onClick={() => setActiveTab('borang-a4')}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'borang-a4'
                      ? 'bg-white text-emerald-900 shadow-xs border border-emerald-100 font-bold ring-1 ring-emerald-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${activeTab === 'borang-a4' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  Borang Rasmi A4
                </button>

                <button
                  onClick={onNewApplication}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'form'
                      ? 'bg-white text-sky-900 shadow-xs border border-sky-100 font-bold ring-1 ring-sky-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <PlusCircle className={`w-3.5 h-3.5 ${activeTab === 'form' ? 'text-sky-600' : 'text-slate-500'}`} />
                  Daftar Pelajar
                </button>
              </>
            )}

          </nav>

          {/* Zone 3: Primary Actions & Role Switcher */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Print PDF Button */}
            <button
              onClick={() => {
                if (activeTab !== 'borang-a4') {
                  setActiveTab('borang-a4');
                  setTimeout(() => window.print(), 350);
                } else {
                  window.print();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-xs hover:shadow whitespace-nowrap cursor-pointer"
              title="Cetak Borang Rasmi A4 sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak A4 (PDF)</span>
            </button>

            {/* Admin Login or Profile Badge */}
            {userRole === 'pemohon' ? (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-800 hover:text-slate-950 bg-gradient-to-r from-slate-100 to-slate-200/80 hover:from-slate-200 hover:to-slate-300 border border-slate-300/80 rounded-lg transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                title="Log masuk untuk Warden & Pengetua menyemak analisis dan kelulusan"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Log Pentadbir</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                {loggedInUser && (
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-[11px] font-bold text-slate-900 leading-none">
                      {loggedInUser.role === 'warden' ? 'Warden Bertugas' : 'Tuan Pengetua'}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium mt-0.5">
                      {loggedInUser.role === 'warden' ? 'Pengurusan Asrama' : 'Pengurusan Sekolah'}
                    </span>
                  </div>
                )}

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded-lg transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                  title="Log keluar dan kembali ke Portal Pemohon"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600" />
                  <span>Log Keluar</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
