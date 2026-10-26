import React, { useState } from 'react';
import { PermohonanAsrama } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { SalapingLogo } from './SalapingLogo';
import { BorangKesihatanA4Modal } from './BorangKesihatanA4Modal';
import { DokumenKesihatanViewerModal } from './DokumenKesihatanViewerModal';
import { 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  ShieldCheck,
  Stethoscope,
  Receipt,
  User,
  Calendar,
  Lock,
  Stamp,
  Search,
  ArrowLeft,
  FileText,
  Eye
} from 'lucide-react';

interface BorangA4OfficialProps {
  student?: PermohonanAsrama | null;
  onApproveStudent?: (id: string) => void;
  onSelectAnotherStudent?: () => void;
  allStudents?: PermohonanAsrama[];
  onSwitchStudent?: (student: PermohonanAsrama) => void;
  onNewApplication?: () => void;
  userRole?: 'pemohon' | 'pentadbir';
}

export const BorangA4Official: React.FC<BorangA4OfficialProps> = ({
  student,
  onApproveStudent,
  onSelectAnotherStudent,
  allStudents = [],
  onSwitchStudent,
  onNewApplication,
  userRole = 'pemohon'
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [carianIC, setCarianIC] = useState<string>('');
  const [carianError, setCarianError] = useState<string | null>(null);
  const [isHealthFormModalOpen, setIsHealthFormModalOpen] = useState(false);
  const [isHealthDocViewerOpen, setIsHealthDocViewerOpen] = useState(false);

  const handleCariPelajar = (e: React.FormEvent) => {
    e.preventDefault();
    setCarianError(null);
    if (!carianIC.trim()) return;

    const cleaned = carianIC.replace(/\D/g, '');
    const found = allStudents.find(s => 
      s.noKP.replace(/\D/g, '').includes(cleaned) || 
      s.noRujukan.toLowerCase().includes(carianIC.trim().toLowerCase())
    );

    if (found && onSwitchStudent) {
      onSwitchStudent(found);
      setCarianError(null);
    } else {
      setCarianError('Tiada rekod permohonan ditemui bagi No. IC / No. Rujukan tersebut.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // If no student is selected yet
  if (!student) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center max-w-xl mx-auto shadow-2xs space-y-4">
        <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-500">
          <FileCheck className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Borang Rasmi A4 (Cetak PDF)</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Sila isi Borang Permohonan Baru terlebih dahulu atau masukkan No. Kad Pengenalan pemohon untuk melihat dan mencetak borang yang telah lengkap diisi.
          </p>
        </div>

        {/* Quick IC Search */}
        {allStudents.length > 0 && (
          <form onSubmit={handleCariPelajar} className="max-w-xs mx-auto flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Masukkan No. IC / No. Rujukan..."
              value={carianIC}
              onChange={(e) => setCarianIC(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
            >
              Cari
            </button>
          </form>
        )}

        {carianError && (
          <p className="text-xs text-rose-600 font-medium">{carianError}</p>
        )}

        <div className="flex items-center justify-center gap-3 pt-3">
          {onNewApplication && (
            <button
              onClick={onNewApplication}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <span>+ Isi Borang Permohonan Baru</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const isApproved = student.statusKelulusan === 'DILULUSKAN';

  return (
    <div className="space-y-4">
      
      {/* Top Action Bar & Student Info (Screen only, hidden on print) */}
      <div className="no-print bg-gradient-to-r from-white via-slate-50 to-indigo-50/30 border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Student Identity Display */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
              <FileCheck className="w-5 h-5 text-blue-600" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-slate-900 uppercase">
                  {student.namaPelajar}
                </h1>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                  {student.noKP}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>Rujukan: <strong className="font-mono text-slate-700">{student.noRujukan}</strong></span>
                <span>·</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Borang Lengkap Diisi
                </span>
              </div>
            </div>

            {/* In Pentadbir Mode, allow switching students directly */}
            {userRole === 'pentadbir' && allStudents.length > 1 && (
              <div className="ml-2 pl-2 border-l border-slate-200">
                <select
                  value={student.id}
                  onChange={(e) => {
                    const found = allStudents.find(s => s.id === e.target.value);
                    if (found && onSwitchStudent) onSwitchStudent(found);
                  }}
                  className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1"
                >
                  {allStudents.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.namaPelajar} ({s.noKP})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* In Pemohon Mode, provide Quick IC search so parents can view their own submission */}
            {userRole === 'pemohon' && (
              <form onSubmit={handleCariPelajar} className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Semak No. KP / Rujukan..."
                  value={carianIC}
                  onChange={(e) => setCarianIC(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono w-40 sm:w-48 shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                  title="Cari Borang Pelajar Berdasarkan No. KP"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Action Buttons: Prominent PDF Printing */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-slate-600">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="p-1 hover:bg-white rounded transition-colors text-slate-700"
                title="Kecilkan Paparan"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-1 tabular-nums">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(130, prev + 10))}
                className="p-1 hover:bg-white rounded transition-colors text-slate-700"
                title="Besarkan Paparan"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="text-[10px] px-1.5 py-0.5 hover:bg-white rounded transition-colors text-slate-600"
              >
                100%
              </button>
            </div>

            {/* Quick Fill New Form if needed */}
            {onNewApplication && (
              <button
                onClick={onNewApplication}
                className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                + Borang Baru
              </button>
            )}

            {/* Staff only: Quick Approve Button */}
            {userRole === 'pentadbir' && !isApproved && onApproveStudent && (
              <button
                onClick={() => onApproveStudent(student.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Luluskan Sebagai Pentadbir</span>
              </button>
            )}

            {/* View Uploaded Doctor's Health Form */}
            {student.dokumenKesihatanUrl && (
              <button
                onClick={() => setIsHealthDocViewerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all shadow-2xs whitespace-nowrap cursor-pointer"
                title="Lihat Gambar Imbasan Borang Kesihatan yang Disahkan Doktor"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>Borang Doktor</span>
              </button>
            )}

            {/* Download Blank Health Form */}
            <button
              onClick={() => setIsHealthFormModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-2xs whitespace-nowrap cursor-pointer"
              title="Cetak Borang Kosong Pemeriksaan Kesihatan (A4) untuk dibawa ke klinik"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              <span>Borang Kesihatan (A4)</span>
            </button>

            {/* PRIMARY PRINT / PDF BUTTON */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap cursor-pointer ring-1 ring-slate-800"
              title="Cetak atau Simpan Sebagai Fail PDF (A4)"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak / Simpan PDF (A4)</span>
            </button>

          </div>
        </div>

        {/* Helpful Guidance Notice for Student / Applicant */}
        <div className="mt-3.5 bg-sky-50/80 border border-sky-200/90 rounded-xl p-3 flex items-start gap-2.5 text-sky-950 text-xs shadow-2xs">
          <Download className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold">Panduan Cetakan PDF:</span> Borang rasmi di bawah telah dimuatkan dengan semua maklumat yang diisi. Klik butang <strong>"Cetak / Simpan PDF (A4)"</strong> di atas, dan pilih destinasi <em>"Save as PDF" / "Simpan sebagai PDF"</em> pada tetingkap cetakan pelayar anda. Pastikan saiz kertas dipilih sebagai <strong>A4</strong>.
          </div>
        </div>
      </div>

      {/* Screen Container with Scroll & Zoom */}
      <div className="w-full overflow-x-auto pb-8 flex justify-center">
        
        {/* A4 Sheet Container (Standard 210mm x 297mm) */}
        <div 
          style={{ 
            transform: `scale(${zoomLevel / 100})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease'
          }}
          className="a4-page-preview a4-print-document p-7 text-slate-900 text-[11px] leading-tight select-text flex flex-col justify-between"
        >
          <div>
            {/* 1. OFFICIAL INSTITUTIONAL HEADER */}
            <div className="border-b-2 border-slate-800 pb-2 mb-2">
              <div className="flex items-center justify-between gap-3">
                
                {/* Logo Badge (Official SMK Salaping Crest) */}
                <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                  <SalapingLogo className="w-15 h-15 object-contain" />
                </div>

                {/* Institution Details */}
                <div className="text-center flex-1">
                  <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                    {SCHOOL_INFO.namaKementerian}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                    {SCHOOL_INFO.namaSekolah}
                  </div>
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {SCHOOL_INFO.namaAsrama}
                  </div>
                  <div className="text-[9px] text-slate-600 mt-0.5">
                    {SCHOOL_INFO.alamat} • Tel: {SCHOOL_INFO.noTelefon} • Emel: {SCHOOL_INFO.emel}
                  </div>
                </div>

                {/* QR / Security Identifier */}
                <div className="w-16 h-16 shrink-0 flex flex-col items-center justify-center border border-slate-300 rounded p-1 bg-slate-50 text-[8px] text-slate-600 text-center">
                  <div className="w-8 h-8 bg-slate-800 flex items-center justify-center text-white text-[7px] font-mono rounded-xs mb-0.5">
                    QR-VERI
                  </div>
                  <span className="font-mono text-[7px] leading-none">VERIFIED</span>
                  <span className="font-mono text-[6px] text-slate-400">DOC-2026</span>
                </div>

              </div>

              {/* Title Ribbon */}
              <div className="mt-2 pt-1.5 border-t border-slate-300 flex items-center justify-between">
                <div className="text-xs font-black tracking-wide text-slate-900 uppercase">
                  BORANG KEMASUKAN KHAS SEMENTARA KE ASRAMA SALAPING
                </div>
                <div className="flex items-center gap-3 text-[10px] font-medium text-slate-700">
                  <span>No. Rujukan: <strong className="font-mono text-slate-900">{student.noRujukan}</strong></span>
                  <span>·</span>
                  <span>Tarikh: <strong className="text-slate-900">{student.tarikhPermohonan}</strong></span>
                </div>
              </div>
            </div>

            {/* 2. SECTION A: MAKLUMAT PELAJAR & RUANG GAMBAR */}
            <div className="mb-2">
              <div className="bg-slate-800 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between rounded-t-xs">
                <span>A. MAKLUMAT PELAJAR</span>
                <span className="text-[9px] font-normal text-slate-200">Kategori: {student.jantina === 'Lelaki' ? 'ASPURA' : 'ASPURI'}</span>
              </div>

              <div className="border border-slate-300 border-t-0 p-2 flex gap-3 bg-white">
                
                {/* Information Fields Table */}
                <div className="flex-1 grid grid-cols-12 gap-x-2 gap-y-1 text-[10px]">
                  
                  {/* Nama Pelajar */}
                  <div className="col-span-8 flex items-baseline border-b border-slate-100 pb-0.5">
                    <span className="w-28 text-slate-500 font-medium shrink-0">1. Nama Pelajar</span>
                    <span className="font-bold text-slate-900 uppercase text-[11px] truncate">
                      {student.namaPelajar}
                    </span>
                  </div>

                  {/* Jantina */}
                  <div className="col-span-4 flex items-baseline border-b border-slate-100 pb-0.5">
                    <span className="w-16 text-slate-500 font-medium shrink-0">Jantina</span>
                    <span className="font-semibold text-slate-900">
                      {student.jantina} ({student.jantina === 'Lelaki' ? 'Aspura' : 'Aspuri'})
                    </span>
                  </div>

                  {/* No KP */}
                  <div className="col-span-6 flex items-baseline border-b border-slate-100 pb-0.5">
                    <span className="w-28 text-slate-500 font-medium shrink-0">2. No. KP / Dokumen</span>
                    <span className="font-mono font-bold text-slate-900 text-[10.5px]">
                      {student.noKP}
                    </span>
                  </div>

                  {/* Tingkatan / Kelas */}
                  <div className="col-span-6 flex items-baseline border-b border-slate-100 pb-0.5">
                    <span className="w-24 text-slate-500 font-medium shrink-0">3. Tingkatan/Kelas</span>
                    <span className="font-semibold text-slate-900">
                      {student.tingkatanKelas}
                    </span>
                  </div>

                  {/* Nama Sekolah Asal */}
                  <div className="col-span-12 flex items-baseline border-b border-slate-100 pb-0.5">
                    <span className="w-28 text-slate-500 font-medium shrink-0">4. Nama Sekolah</span>
                    <span className="font-medium text-slate-900">
                      {student.namaSekolah}
                    </span>
                  </div>

                  {/* Nama Penjaga */}
                  <div className="col-span-7 flex items-baseline border-b border-slate-100 pb-0.5">
                    <span className="w-28 text-slate-500 font-medium shrink-0">5. Nama Ibu/Bapa/Penjaga</span>
                    <span className="font-semibold text-slate-900 truncate">
                      {student.namaPenjaga} ({student.hubunganPenjaga || 'Penjaga'})
                    </span>
                  </div>

                  {/* No Tel Penjaga */}
                  <div className="col-span-5 flex items-baseline border-b border-slate-100 pb-0.5">
                    <span className="w-24 text-slate-500 font-medium shrink-0">6. No. Tel Penjaga</span>
                    <span className="font-mono font-bold text-slate-900">
                      {student.noTelefonPenjaga}
                    </span>
                  </div>

                  {/* Alamat Kediaman */}
                  <div className="col-span-12 flex items-baseline">
                    <span className="w-28 text-slate-500 font-medium shrink-0">7. Alamat Rumah</span>
                    <span className="text-slate-800 text-[9.5px] leading-tight line-clamp-2">
                      {student.alamatRumah}
                    </span>
                  </div>

                </div>

                {/* RUANG GAMBAR PEMOHON */}
                <div className="w-26 shrink-0 flex flex-col items-center justify-between border-2 border-dashed border-slate-300 rounded p-1 bg-slate-50 text-center">
                  <div className="w-24 h-28 bg-white border border-slate-300 rounded overflow-hidden flex items-center justify-center shadow-2xs">
                    {student.fotoUrl ? (
                      <img 
                        src={student.fotoUrl} 
                        alt={`Foto ${student.namaPelajar}`} 
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-slate-400">
                        <User className="w-8 h-8 mb-1 text-slate-300" />
                        <span className="text-[8px] font-medium leading-none">Ruang Foto</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-1">
                    <span className="block text-[8px] font-bold text-slate-700 uppercase tracking-tighter">
                      Foto Pemohon
                    </span>
                    <span className="block text-[7px] text-slate-500 leading-none">
                      (Pasport / Selfie Jelas)
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* 3. REORGANIZED SPECIAL BOXES: LAPORAN KESIHATAN & RINGKASAN YURAN */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              
              {/* Petak Khas: Laporan Kesihatan Doktor */}
              <div className="border border-slate-300 rounded-xs overflow-hidden flex flex-col">
                <div className="bg-slate-100 border-b border-slate-300 px-2 py-0.5 text-[9.5px] font-bold text-slate-800 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="w-3 h-3 text-emerald-700" />
                    LAPORAN KESIHATAN DOKTOR
                  </span>
                  <span className="text-[8px] bg-white border border-slate-300 text-slate-700 px-1 py-0.2 rounded font-medium">
                    {student.statusKesihatan}
                  </span>
                </div>
                <div className="p-2 bg-white flex-1 text-[9.5px] space-y-1">
                  <div className="flex items-baseline justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 font-medium">Pegawai / Klinik:</span>
                    <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                      {student.namaDoktorKlinik || 'Klinik Kesihatan Kerajaan'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 font-medium">Tarikh Pemeriksaan:</span>
                    <span className="font-mono text-slate-800">{student.tarikhPemeriksaan || 'Terkini'}</span>
                  </div>
                  <div className="border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 font-medium block">Rekod Alahan / Penyakit:</span>
                    <span className="text-slate-900 font-medium text-[9px] line-clamp-1">
                      {student.rekodAlahanPenyakit || 'Tiada rekod penyakit kronik atau alahan.'}
                    </span>
                  </div>
                  <div className="border-b border-slate-100 pb-0.5">
                    <span className="text-slate-500 font-medium block">Catatan Perubatan:</span>
                    <span className="text-slate-800 text-[9px] line-clamp-1 italic">
                      {student.catatanKesihatan || 'Disahkan sihat fizikal & mental untuk tinggal di asrama.'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-slate-500 font-medium text-[8px]">Imbasan Borang Doktor:</span>
                    {student.dokumenKesihatanUrl ? (
                      <span className="text-emerald-700 font-bold text-[8.5px] inline-flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        Telah Disahkan & Dimuat Naik
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium text-[8px]">
                        Borang Belum Dimuat Naik
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Petak Khas: Kiraan & Ringkasan Yuran / Bon Asrama */}
              <div className="border border-slate-300 rounded-xs overflow-hidden flex flex-col">
                <div className="bg-slate-100 border-b border-slate-300 px-2 py-0.5 text-[9.5px] font-bold text-slate-800 uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Receipt className="w-3 h-3 text-blue-700" />
                    KIRAAN & RINGKASAN BAYARAN ASRAMA
                  </span>
                  <span className="text-[8px] px-1.5 py-0.2 rounded font-bold border bg-blue-50 border-blue-300 text-blue-800 uppercase">
                    BON: RM 30.00
                  </span>
                </div>
                <div className="p-1.5 bg-white flex-1 text-[9.5px] space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                    <span className="text-slate-600 font-medium">1. Bayaran BON Asrama (Cagaran):</span>
                    <span className="font-mono font-bold text-slate-900 text-[10px]">RM 30.00</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-0.5 text-[9px]">
                    <span className="text-slate-500 font-medium">2. Yuran Penginapan & Makan:</span>
                    <span className="font-semibold text-emerald-700">Percuma (RM 0.00)</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded p-1 text-[8.5px] text-slate-700 leading-snug">
                    <span className="font-bold text-slate-900 block text-[8px] uppercase">Pemberitahuan Kaunter:</span>
                    Bayaran BON asrama sebanyak <strong>RM30</strong> (dan kadar bayaran masuk asrama jika berkaitan) akan ditentukan dan dikutip semasa mendaftar di kaunter pendaftaran pada hari pendaftaran masuk pelajar asrama.
                  </div>
                </div>
              </div>

            </div>

            {/* 4. SECTION B: BUTIRAN KEMASUKAN SEMENTARA */}
            <div className="mb-2">
              <div className="bg-slate-800 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between rounded-t-xs">
                <span>B. BUTIRAN KEMASUKAN SEMENTARA</span>
                <span className="text-[9px] font-normal text-slate-200">Tempoh: {student.tempohHari} Hari</span>
              </div>

              <div className="border border-slate-300 border-t-0 p-2 bg-white text-[10px] space-y-1">
                
                <div className="grid grid-cols-12 gap-2 border-b border-slate-100 pb-1">
                  <div className="col-span-4 flex items-baseline">
                    <span className="w-24 text-slate-500 font-medium shrink-0">1. Tarikh Masuk:</span>
                    <span className="font-bold text-slate-900 font-mono">{student.tarikhMasuk}</span>
                  </div>
                  <div className="col-span-4 flex items-baseline">
                    <span className="w-24 text-slate-500 font-medium shrink-0">2. Tarikh Keluar:</span>
                    <span className="font-bold text-slate-900 font-mono">{student.tarikhKeluar}</span>
                  </div>
                  <div className="col-span-4 flex items-baseline">
                    <span className="w-24 text-slate-500 font-medium shrink-0">Bilik/Dorm:</span>
                    <span className="font-bold text-blue-900 truncate">{student.bilikDormDicadangkan || 'Dorm Sementara'}</span>
                  </div>
                </div>

                <div className="flex items-baseline border-b border-slate-100 pb-1">
                  <span className="w-32 text-slate-500 font-medium shrink-0">3. Sebab Kemasukan:</span>
                  <span className="font-semibold text-slate-900 leading-tight">
                    {student.sebabKemasukan}
                  </span>
                </div>

                <div className="flex items-baseline">
                  <span className="w-32 text-slate-500 font-medium shrink-0">4. Catatan Asrama:</span>
                  <span className="text-slate-800 text-[9.5px] italic">
                    {student.catatanKemasukan || 'Disahkan berkeperluan untuk kemasukan khas sementara.'}
                  </span>
                </div>

              </div>
            </div>

            {/* 5. SECTION C: PERAKUAN & KELULUSAN */}
            <div className="mb-2">
              <div className="bg-slate-800 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-t-xs">
                C. PERAKUAN PEMOHON & KEPUTUSAN PENGURUSAN ASRAMA
              </div>

              <div className="border border-slate-300 border-t-0 p-2 bg-white">
                
                {/* Perakuan Teks */}
                <p className="text-[9px] text-slate-700 leading-relaxed text-justify mb-2 pb-1.5 border-b border-slate-200">
                  Saya mengesahkan bahawa segala maklumat yang diberikan adalah benar dan sah. Saya bersetuju mematuhi segala peraturan tatatertib, jadual aktiviti dan arahan pihak pengurusan Asrama Salaping sepanjang tempoh kemasukan sementara ini. Pihak asrama berhak menamatkan kemasukan sekiranya berlaku pelanggaran disiplin.
                </p>

                {/* 3 Signature Columns */}
                <div className="grid grid-cols-3 gap-3 pt-1 border-b border-slate-200 pb-2">
                  
                  {/* Tandatangan Ibu Bapa */}
                  <div className="flex flex-col justify-between text-[9px] h-20">
                    <div className="text-slate-600 font-semibold text-center border-b border-slate-200 pb-0.5">
                      Tandatangan Ibu/Bapa/Penjaga
                    </div>
                    <div className="h-8 flex items-center justify-center">
                      <span className="font-serif italic text-slate-700 text-xs">
                        {student.namaPenjaga ? `${student.namaPenjaga.split(' ')[0]}` : '_________________'}
                      </span>
                    </div>
                    <div className="text-[8.5px] text-slate-600">
                      <div>Nama: <span className="font-medium text-slate-900 truncate">{student.namaPenjaga}</span></div>
                      <div>Tarikh: <span className="font-mono">{student.tarikhPermohonan}</span></div>
                    </div>
                  </div>

                  {/* Tandatangan Pelajar */}
                  <div className="flex flex-col justify-between text-[9px] h-20 border-x border-slate-200 px-2">
                    <div className="text-slate-600 font-semibold text-center border-b border-slate-200 pb-0.5">
                      Tandatangan Pelajar
                    </div>
                    <div className="h-8 flex items-center justify-center">
                      <span className="font-serif italic text-slate-700 text-xs">
                        {student.namaPelajar ? `${student.namaPelajar.split(' ')[0]}` : '_________________'}
                      </span>
                    </div>
                    <div className="text-[8.5px] text-slate-600">
                      <div>Nama: <span className="font-medium text-slate-900 truncate">{student.namaPelajar}</span></div>
                      <div>Tarikh: <span className="font-mono">{student.tarikhPermohonan}</span></div>
                    </div>
                  </div>

                  {/* Pengesahan Warden */}
                  <div className="flex flex-col justify-between text-[9px] h-20">
                    <div className="text-slate-600 font-semibold text-center border-b border-slate-200 pb-0.5">
                      Untuk Kegunaan Warden Bertugas
                    </div>
                    <div className="h-8 flex items-center justify-center">
                      {isApproved ? (
                        <div className="border border-emerald-600 text-emerald-800 text-[8px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-tight flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                          DISEMAK & DISAHKAN
                        </div>
                      ) : (
                        <div className="border border-blue-400 text-blue-800 text-[8px] font-semibold px-2 py-0.5 rounded-xs uppercase tracking-tight">
                          PERMOHONAN BERDAFTAR
                        </div>
                      )}
                    </div>
                    <div className="text-[8.5px] text-slate-600">
                      <div>Nama/Cop: <span className="font-medium text-slate-900 truncate">{student.namaWardenPenilai || SCHOOL_INFO.namaKetuaWarden}</span></div>
                      <div>Tarikh: <span className="font-mono">{student.tarikhKeputusan !== '-' ? student.tarikhKeputusan : student.tarikhPermohonan}</span></div>
                    </div>
                  </div>

                </div>

                {/* KEPUTUSAN PIHAK ASRAMA SECTION */}
                <div className="mt-2 pt-1 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-[10px] font-bold">
                      <span className="text-slate-900 uppercase">Keputusan Pihak Asrama:</span>
                      
                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 border flex items-center justify-center text-[10px] font-bold ${
                          isApproved ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-400 bg-white'
                        }`}>
                          {isApproved ? '■' : '□'}
                        </span>
                        <span className={isApproved ? 'text-slate-900 font-black' : 'text-slate-600'}>
                          DILULUSKAN
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`w-3.5 h-3.5 border flex items-center justify-center text-[10px] font-bold ${
                          student.statusKelulusan === 'TIDAK DILULUSKAN' ? 'bg-rose-900 text-white border-rose-900' : 'border-slate-400 bg-white'
                        }`}>
                          {student.statusKelulusan === 'TIDAK DILULUSKAN' ? '■' : '□'}
                        </span>
                        <span className={student.statusKelulusan === 'TIDAK DILULUSKAN' ? 'text-rose-700 font-bold' : 'text-slate-600'}>
                          TIDAK DILULUSKAN
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 text-[9px] text-slate-600 flex items-baseline">
                      <span className="font-medium text-slate-500 mr-2 shrink-0">Catatan Warden:</span>
                      <span className="text-slate-800 italic truncate">
                        {student.catatanWarden || 'Borang permohonan kemasukan sementara asrama telah lengkap diisi oleh pemohon.'}
                      </span>
                    </div>
                  </div>

                  {/* Official Approval Seal / Stamp */}
                  <div className="shrink-0 flex items-center justify-center">
                    <div className="w-22 h-14 border-2 border-emerald-700 text-emerald-800 rounded p-1 flex flex-col items-center justify-center text-center leading-none bg-emerald-50/40">
                      <span className="text-[7.5px] font-bold uppercase tracking-tighter">PENGURUSAN ASRAMA</span>
                      <span className="text-[10px] font-black tracking-wider text-emerald-900 my-0.5">
                        {isApproved ? 'DILULUSKAN' : 'DISAHKAN'}
                      </span>
                      <span className="text-[7px] font-mono text-emerald-700">{student.tarikhPermohonan}</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* 6. STRICT OFFICIAL FOOTER / DOCUMENT HASH */}
          <div className="pt-2 border-t border-slate-300 flex items-center justify-between text-[8px] text-slate-500">
            <div>
              <span>Sistem e-Borang Asrama Salaping • No. Dokumen: </span>
              <span className="font-mono font-semibold text-slate-700">{student.noRujukan}</span>
              <span> • Disahkan oleh Pengetua: <strong>{SCHOOL_INFO.namaPengetua}</strong></span>
            </div>
            <div className="font-mono text-slate-600 font-medium">
              HELAIAN 1 DARIPADA 1 (A4 RASMI)
            </div>
          </div>

        </div>

      </div>

      {/* Official 1-Page A4 Blank Health Examination Form Modal */}
      <BorangKesihatanA4Modal
        isOpen={isHealthFormModalOpen}
        onClose={() => setIsHealthFormModalOpen(false)}
        studentName={student.namaPelajar}
        studentIC={student.noKP}
        studentClass={student.tingkatanKelas}
        guardianName={student.namaPenjaga}
        guardianPhone={student.noTelefonPenjaga}
      />

      {/* Doctor-certified health form scan viewer modal */}
      {student.dokumenKesihatanUrl && (
        <DokumenKesihatanViewerModal
          isOpen={isHealthDocViewerOpen}
          onClose={() => setIsHealthDocViewerOpen(false)}
          imageUrl={student.dokumenKesihatanUrl}
          studentName={student.namaPelajar}
          doctorName={student.namaDoktorKlinik}
          tarikhPemeriksaan={student.tarikhPemeriksaan}
        />
      )}

    </div>
  );
};
