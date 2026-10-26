import React, { useState } from 'react';
import { PermohonanAsrama } from '../types';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  ArrowRight, 
  Globe, 
  AlertCircle, 
  FileText,
  Sparkles
} from 'lucide-react';

interface DataTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: PermohonanAsrama[];
  onImportStudents: (imported: PermohonanAsrama[]) => void;
}

export const DataTransferModal: React.FC<DataTransferModalProps> = ({
  isOpen,
  onClose,
  students,
  onImportStudents
}) => {
  const [copied, setCopied] = useState(false);
  const [pasteDataText, setPasteDataText] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const jsonDataString = JSON.stringify(students, null, 2);

  // Copy JSON to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonDataString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Download JSON file
  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonDataString);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `asrama_salaping_data_${students.length}_pelajar_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import from pasted text
  const handleImportPasted = () => {
    setImportStatus(null);
    if (!pasteDataText.trim()) {
      setImportStatus('Sila tampal kod teks data terlebih dahulu.');
      return;
    }

    try {
      const parsed = JSON.parse(pasteDataText.trim());
      const list = Array.isArray(parsed) ? parsed : [parsed];
      const validStudents = list.filter((item: any) => item && item.namaPelajar);

      if (validStudents.length === 0) {
        setImportStatus('Format data tidak sah atau tiada rekod pelajar ditemui.');
        return;
      }

      onImportStudents(validStudents as PermohonanAsrama[]);
      setImportStatus(`Berjaya memasukkan ${validStudents.length} rekod pemohon!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setImportStatus('Ralat semasa membaca data. Sila pastikan format JSON disalin dengan lengkap.');
    }
  };

  // File upload input handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const valid = list.filter((item: any) => item && item.namaPelajar);
        if (valid.length > 0) {
          onImportStudents(valid as PermohonanAsrama[]);
          setImportStatus(`Berjaya memasukkan ${valid.length} rekod pemohon daripada fail!`);
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setImportStatus('Fail tidak mengandungi rekod pelajar yang sah.');
        }
      } catch (e) {
        setImportStatus('Gagal membaca fail sandaran. Pastikan fail adalah fail .json yang sah.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden text-slate-900 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 border border-white/15">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-2">
                <span>Penyegerakan Data ke Netlify</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
                  {students.length} Pemohon Sedia Ada
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Pindahkan data antara peranti pratonton dan laman <strong className="text-white font-mono">asramasalaping.netlify.app</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors cursor-pointer border-t border-x ${
              activeTab === 'export'
                ? 'bg-white text-indigo-900 border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Download className="w-4 h-4 text-sky-600" />
            <span>1. Salin / Eksport Data ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors cursor-pointer border-t border-x ${
              activeTab === 'import'
                ? 'bg-white text-emerald-900 border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            <span>2. Tampal / Masukkan Data ke Laman Ini</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 space-y-1.5">
                <div className="font-bold text-sm text-sky-950 flex items-center gap-2">
                  <span>Langkah Memindahkan ke Laman Netlify:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-[11.5px] text-sky-900 font-medium">
                  <li>Klik butang <strong>"Salin Kod Teks"</strong> atau <strong>"Muat Turun Fail (.json)"</strong> di bawah.</li>
                  <li>Buka laman web anda di Netlify: <a href="https://asramasalaping.netlify.app" target="_blank" rel="noreferrer" className="underline font-bold text-blue-700">https://asramasalaping.netlify.app</a></li>
                  <li>Di Netlify, buka menu ini dan pilih tab <strong>"2. Tampal / Masukkan Data"</strong> untuk memasukkan kesemua {students.length} pelajar.</li>
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                  <span>{copied ? '✓ Berjaya Disalin ke Papan Keratan!' : `Salin Kod Teks (${students.length} Pemohon)`}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Muat Turun Fail (.json)</span>
                </button>
              </div>

              {/* JSON preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Pratonton Kod Data ({students.length} Pelajar)
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {jsonDataString.length} bait
                  </span>
                </div>
                <textarea
                  readOnly
                  value={jsonDataString}
                  rows={8}
                  className="w-full font-mono text-[11px] p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-none select-all"
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
                <h4 className="font-bold text-sm">Gunakan Bahagian Ini di Laman Netlify Anda</h4>
                <p className="text-[11.5px] leading-relaxed">
                  Tampal kod teks yang disalin daripada sistem ini atau pilih fail JSON yang telah dimuat turun untuk memasukkan kesemua rekod pelajar ke dalam pelayan Netlify.
                </p>
              </div>

              {importStatus && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  importStatus.includes('Berjaya') 
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tampal Kod Teks Data Di Sini:
                </label>
                <textarea
                  value={pasteDataText}
                  onChange={(e) => setPasteDataText(e.target.value)}
                  placeholder='Tampal teks JSON di sini (contoh: [{"namaPelajar": "...", ...}])'
                  rows={7}
                  className="w-full font-mono text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                {/* Upload File Input */}
                <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer w-full sm:w-auto justify-center">
                  <Upload className="w-4 h-4 text-sky-600" />
                  <span>Atau Pilih Fail .json</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleImportPasted}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
                >
                  <Check className="w-4 h-4" />
                  <span>Sahkan & Masukkan Pemohon</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span>SMK Salaping • Sistem Pemindahan Rekod Asrama</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
