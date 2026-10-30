import React from 'react';
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Coins, 
  TrendingUp, 
  Printer, 
  FileSpreadsheet,
  Building,
  Sparkles
} from 'lucide-react';
import { PermohonanAsrama } from '../types';

interface AnalyticsCardsProps {
  students: PermohonanAsrama[];
  activeFilter: 'all' | 'Lelaki' | 'Perempuan' | 'DILULUSKAN' | 'MENUNGGU KELULUSAN';
  onSelectFilter: (filter: 'all' | 'Lelaki' | 'Perempuan' | 'DILULUSKAN' | 'MENUNGGU KELULUSAN') => void;
  onJanaSenaraiPengetua: () => void;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({
  students,
  activeFilter,
  onSelectFilter,
  onJanaSenaraiPengetua
}) => {
  const totalPemohon = students.length;
  const totalAspura = students.filter(s => s.jantina === 'Lelaki').length;
  const totalAspuri = students.filter(s => s.jantina === 'Perempuan').length;
  const totalDiluluskan = students.filter(s => s.statusKelulusan === 'DILULUSKAN').length;
  const totalMenunggu = students.filter(s => s.statusKelulusan === 'MENUNGGU KELULUSAN').length;

  return (
    <div className="space-y-4">
      {/* Top Banner with Pengetua Export Prompt */}
      <div className="bg-gradient-to-r from-white via-slate-50 to-indigo-50/30 border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Papan Analisis Pengurusan & Kemasukan Asrama
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/70">
              Sesi 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Pemantauan langsung permohonan kemasukan sementara, kapasiti dorm, dan rekod pendaftaran rasmi.
          </p>
        </div>

        <button
          onClick={onJanaSenaraiPengetua}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap cursor-pointer ring-1 ring-slate-800"
        >
          <FileSpreadsheet className="w-4 h-4 text-amber-400" />
          <span>Jana Senarai Rasmi Pengetua</span>
        </button>
      </div>

      {/* Main 4 Metric Cards with Soft Pastel Tones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Jumlah Keseluruhan */}
        <div 
          onClick={() => onSelectFilter('all')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10 scale-[1.01]'
              : 'bg-gradient-to-br from-white via-slate-50/60 to-indigo-50/30 text-slate-800 border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${activeFilter === 'all' ? 'text-slate-300' : 'text-slate-600'}`}>
              Jumlah Pemohon
            </span>
            <div className={`p-2 rounded-xl ${activeFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tabular-nums tracking-tight">
              {totalPemohon}
            </span>
            <span className={`text-xs ${activeFilter === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>
              orang pelajar
            </span>
          </div>
          <div className={`mt-3 pt-3 border-t text-xs flex justify-between ${
            activeFilter === 'all' ? 'border-slate-800 text-slate-400' : 'border-slate-200/60 text-slate-500'
          }`}>
            <span>Semua permohonan aktif</span>
            <span className="font-semibold">{totalPemohon > 0 ? '100%' : '0%'}</span>
          </div>
        </div>

        {/* Card 2: Aspura (Lelaki) - Soft Sky/Ocean */}
        <div 
          onClick={() => onSelectFilter(activeFilter === 'Lelaki' ? 'all' : 'Lelaki')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeFilter === 'Lelaki'
              ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-500/20 scale-[1.01]'
              : 'bg-gradient-to-br from-white via-sky-50/60 to-blue-50/30 text-slate-800 border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-sm'
          }`}
          title={activeFilter === 'Lelaki' ? 'Klik untuk buang tapisan (tunjuk semua 18)' : 'Klik untuk tapis 9 pemohon Aspura'}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${activeFilter === 'Lelaki' ? 'text-blue-200' : 'text-slate-600'}`}>
              Aspura (Lelaki) {activeFilter === 'Lelaki' && '✓ Aktif'}
            </span>
            <div className={`p-2 rounded-xl ${activeFilter === 'Lelaki' ? 'bg-blue-800 text-blue-200' : 'bg-sky-50 text-sky-700 border border-sky-100'}`}>
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tabular-nums tracking-tight text-blue-700"
              style={{ color: activeFilter === 'Lelaki' ? '#ffffff' : undefined }}
            >
              {totalAspura}
            </span>
            <span className={`text-xs ${activeFilter === 'Lelaki' ? 'text-blue-200' : 'text-slate-500'}`}>
              orang pelajar
            </span>
          </div>
          <div className={`mt-3 pt-3 border-t text-xs flex justify-between ${
            activeFilter === 'Lelaki' ? 'border-blue-800 text-blue-200' : 'border-sky-100 text-slate-500'
          }`}>
            <span>{activeFilter === 'Lelaki' ? 'Klik untuk batal tapisan' : 'Blok Asrama Putera'}</span>
            <span className="font-semibold tabular-nums">
              {totalPemohon > 0 ? Math.round((totalAspura / totalPemohon) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Card 3: Aspuri (Perempuan) - Soft Rose/Blush */}
        <div 
          onClick={() => onSelectFilter(activeFilter === 'Perempuan' ? 'all' : 'Perempuan')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeFilter === 'Perempuan'
              ? 'bg-rose-900 text-white border-rose-900 shadow-md ring-2 ring-rose-500/20 scale-[1.01]'
              : 'bg-gradient-to-br from-white via-rose-50/50 to-pink-50/30 text-slate-800 border-rose-100 hover:border-rose-300 shadow-xs hover:shadow-sm'
          }`}
          title={activeFilter === 'Perempuan' ? 'Klik untuk buang tapisan (tunjuk semua 18)' : 'Klik untuk tapis 9 pemohon Aspuri'}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${activeFilter === 'Perempuan' ? 'text-rose-200' : 'text-slate-600'}`}>
              Aspuri (Perempuan) {activeFilter === 'Perempuan' && '✓ Aktif'}
            </span>
            <div className={`p-2 rounded-xl ${activeFilter === 'Perempuan' ? 'bg-rose-800 text-rose-200' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tabular-nums tracking-tight text-rose-600"
              style={{ color: activeFilter === 'Perempuan' ? '#ffffff' : undefined }}
            >
              {totalAspuri}
            </span>
            <span className={`text-xs ${activeFilter === 'Perempuan' ? 'text-rose-200' : 'text-slate-500'}`}>
              orang pelajar
            </span>
          </div>
          <div className={`mt-3 pt-3 border-t text-xs flex justify-between ${
            activeFilter === 'Perempuan' ? 'border-rose-800 text-rose-200' : 'border-rose-100 text-slate-500'
          }`}>
            <span>{activeFilter === 'Perempuan' ? 'Klik untuk batal tapisan' : 'Blok Asrama Puteri'}</span>
            <span className="font-semibold tabular-nums">
              {totalPemohon > 0 ? Math.round((totalAspuri / totalPemohon) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Card 4: Bayaran Bon Asrama - Soft Honey/Amber */}
        <div 
          onClick={() => onSelectFilter(activeFilter === 'DILULUSKAN' ? 'all' : 'DILULUSKAN')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            activeFilter === 'DILULUSKAN'
              ? 'bg-amber-950 text-white border-amber-950 shadow-md ring-2 ring-amber-500/20 scale-[1.01]'
              : 'bg-gradient-to-br from-white via-amber-50/60 to-yellow-50/30 text-slate-800 border-amber-100 hover:border-amber-300 shadow-xs hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold ${activeFilter === 'DILULUSKAN' ? 'text-amber-200' : 'text-slate-600'}`}>
              Bayaran BON Asrama
            </span>
            <div className={`p-2 rounded-xl ${activeFilter === 'DILULUSKAN' ? 'bg-amber-900 text-amber-200' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight font-mono text-amber-800"
              style={{ color: activeFilter === 'DILULUSKAN' ? '#ffffff' : undefined }}
            >
              RM 30.00
            </span>
            <span className={`text-[10px] font-medium ${activeFilter === 'DILULUSKAN' ? 'text-amber-200' : 'text-slate-500'}`}>
              (Kutipan di Kaunter)
            </span>
          </div>
          <div className={`mt-3 pt-3 border-t text-xs flex justify-between ${
            activeFilter === 'DILULUSKAN' ? 'border-amber-900 text-amber-200' : 'border-amber-100 text-slate-500'
          }`}>
            <span>{totalDiluluskan} Lulus • {totalMenunggu} Semakan</span>
            <span className="font-semibold text-amber-700 font-mono" style={{ color: activeFilter === 'DILULUSKAN' ? '#fde68a' : undefined }}>
              RM {totalDiluluskan * 30} Bon Terkumpul
            </span>
          </div>
        </div>

      </div>

      {/* Filter Bar with Soft Pastel Segments */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white/70 backdrop-blur-xs p-1.5 rounded-xl border border-slate-200/70 shadow-2xs">
          <span className="text-slate-500 font-bold px-2 text-[11px]">Tapis:</span>
          
          <button
            onClick={() => onSelectFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Semua ({totalPemohon})
          </button>

          <button
            onClick={() => onSelectFilter('Lelaki')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
              activeFilter === 'Lelaki'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-100'
            }`}
          >
            Aspura ({totalAspura})
          </button>

          <button
            onClick={() => onSelectFilter('Perempuan')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
              activeFilter === 'Perempuan'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-rose-700 bg-rose-50/80 hover:bg-rose-100/80 border border-rose-100'
            }`}
          >
            Aspuri ({totalAspuri})
          </button>

          <button
            onClick={() => onSelectFilter('DILULUSKAN')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
              activeFilter === 'DILULUSKAN'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-100'
            }`}
          >
            Diluluskan ({totalDiluluskan})
          </button>

          <button
            onClick={() => onSelectFilter('MENUNGGU KELULUSAN')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer text-xs font-semibold ${
              activeFilter === 'MENUNGGU KELULUSAN'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 bg-amber-50/80 hover:bg-amber-100/80 border border-amber-100'
            }`}
          >
            Menunggu Kelulusan ({totalMenunggu})
          </button>
        </div>

        <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1.5 bg-white/60 px-3 py-1 rounded-lg border border-slate-200/50">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Borang rasmi sedia dicetak setelah disahkan oleh Warden.</span>
        </div>
      </div>
    </div>
  );
};
