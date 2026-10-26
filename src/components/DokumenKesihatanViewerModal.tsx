import React from 'react';
import { X, ZoomIn, ZoomOut, Download, Stethoscope, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

interface DokumenKesihatanViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  studentName?: string;
  doctorName?: string;
  clinicName?: string;
  tarikhPemeriksaan?: string;
}

export const DokumenKesihatanViewerModal: React.FC<DokumenKesihatanViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  studentName,
  doctorName,
  clinicName,
  tarikhPemeriksaan
}) => {
  const [zoom, setZoom] = React.useState(100);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight flex items-center gap-2">
                <span>Imbasan Borang Laporan Kesihatan Doktor</span>
                <span className="text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-normal">
                  Disahkan Doktor
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                {studentName ? `Pemohon: ${studentName}` : 'Dokumen Pengesahan Rasmi Perubatan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-slate-300">
              <button
                onClick={() => setZoom(prev => Math.max(60, prev - 15))}
                className="p-1 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Kecilkan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1.5">{zoom}%</span>
              <button
                onClick={() => setZoom(prev => Math.min(180, prev + 15))}
                className="p-1 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Besarkan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="text-[10px] px-1.5 py-0.5 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            <button
              onClick={() => {
                const win = window.open('');
                if (win) {
                  win.document.write(`<img src="${imageUrl}" style="max-width:100%; height:auto;" />`);
                  win.focus();
                  setTimeout(() => win.print(), 250);
                }
              }}
              className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-colors cursor-pointer"
              title="Cetak Salinan Borang"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Doctor Verification Details Pill Bar */}
        {(doctorName || clinicName || tarikhPemeriksaan) && (
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs flex flex-wrap items-center gap-4 text-slate-700">
            {doctorName && (
              <div>
                <span className="text-slate-400 text-[10px] uppercase block leading-none">Doktor Pemeriksa:</span>
                <strong className="text-slate-900 font-bold">{doctorName}</strong>
              </div>
            )}
            {clinicName && (
              <div>
                <span className="text-slate-400 text-[10px] uppercase block leading-none">Klinik / Hospital:</span>
                <span className="text-slate-800 font-medium">{clinicName}</span>
              </div>
            )}
            {tarikhPemeriksaan && (
              <div>
                <span className="text-slate-400 text-[10px] uppercase block leading-none">Tarikh Pengesahan:</span>
                <span className="font-mono text-slate-800">{tarikhPemeriksaan}</span>
              </div>
            )}
          </div>
        )}

        {/* Image Display Area with Pan & Zoom */}
        <div className="flex-1 overflow-auto p-4 bg-slate-100 flex items-center justify-center min-h-[420px]">
          <div 
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease' }}
            className="shadow-xl rounded-lg overflow-hidden border border-slate-300 bg-white max-w-full"
          >
            <img 
              src={imageUrl} 
              alt="Imbasan Borang Kesihatan Disahkan Doktor" 
              className="max-h-[75vh] w-auto object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dokumen ini disahkan oleh Pegawai Perubatan berdaftar untuk kelayakan berasrama.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition-all"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
