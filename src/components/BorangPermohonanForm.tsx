import React, { useState, useRef, useEffect } from 'react';
import { PermohonanAsrama, Jantina, StatusPermohonan, StatusKesihatan, StatusBayaran } from '../types';
import studentMalePhoto from '../assets/images/student_sample_photo_1790991039757.jpg';
import studentFemalePhoto from '../assets/images/student_female_sample_1790991051930.jpg';
import { BorangKesihatanA4Modal } from './BorangKesihatanA4Modal';
import { DokumenKesihatanViewerModal } from './DokumenKesihatanViewerModal';
import { SAMPLE_DOCTOR_CERTIFIED_FORM } from '../utils/sampleCertifiedHealthForm';
import { 
  Camera, 
  Upload, 
  User, 
  Stethoscope, 
  Receipt, 
  Calendar, 
  Save, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Image as ImageIcon,
  Printer,
  Download,
  Eye,
  FileText,
  AlertCircle
} from 'lucide-react';

interface BorangPermohonanFormProps {
  initialData?: PermohonanAsrama | null;
  onSave: (data: PermohonanAsrama) => void;
  onCancel: () => void;
  nextReferenceNumber: string;
  userRole?: 'pemohon' | 'pentadbir';
}

export const BorangPermohonanForm: React.FC<BorangPermohonanFormProps> = ({
  initialData,
  onSave,
  onCancel,
  nextReferenceNumber,
  userRole = 'pemohon'
}) => {
  // Form State
  const [namaPelajar, setNamaPelajar] = useState(initialData?.namaPelajar || '');
  const [noKP, setNoKP] = useState(initialData?.noKP || '');
  const [jantina, setJantina] = useState<Jantina>(initialData?.jantina || 'Lelaki');
  const [tingkatanKelas, setTingkatanKelas] = useState(initialData?.tingkatanKelas || 'Tingkatan 4 Sains 1');
  const [namaSekolah, setNamaSekolah] = useState(initialData?.namaSekolah || 'SMK Salaping Perdana');
  const [namaPenjaga, setNamaPenjaga] = useState(initialData?.namaPenjaga || '');
  const [noTelefonPenjaga, setNoTelefonPenjaga] = useState(initialData?.noTelefonPenjaga || '');
  const [hubunganPenjaga, setHubunganPenjaga] = useState(initialData?.hubunganPenjaga || 'Bapa');
  const [alamatRumah, setAlamatRumah] = useState(initialData?.alamatRumah || '');
  
  // Photo State
  const [fotoUrl, setFotoUrl] = useState(initialData?.fotoUrl || '');
  const [fotoType, setFotoType] = useState<'passport' | 'swafoto'>(initialData?.fotoType || 'passport');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Kesihatan
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [statusKesihatan, setStatusKesihatan] = useState<StatusKesihatan>(initialData?.statusKesihatan || 'Sihat & Layak Asrama');
  const [namaDoktorKlinik, setNamaDoktorKlinik] = useState(initialData?.namaDoktorKlinik || '');
  const [tarikhPemeriksaan, setTarikhPemeriksaan] = useState(initialData?.tarikhPemeriksaan || today);
  const [rekodAlahanPenyakit, setRekodAlahanPenyakit] = useState(initialData?.rekodAlahanPenyakit || 'Tiada alahan makanan atau penyakit kronik.');
  const [catatanKesihatan, setCatatanKesihatan] = useState(initialData?.catatanKesihatan || 'Disahkan sihat fizikal & mental untuk tinggal di asrama.');
  const [dokumenKesihatanUrl, setDokumenKesihatanUrl] = useState<string>(initialData?.dokumenKesihatanUrl || '');
  const [isHealthFormModalOpen, setIsHealthFormModalOpen] = useState(false);
  const [isHealthDocViewerOpen, setIsHealthDocViewerOpen] = useState(false);
  const healthFileInputRef = useRef<HTMLInputElement>(null);
  const healthCameraInputRef = useRef<HTMLInputElement>(null);

  // Butiran Kemasukan
  const [tarikhMasuk, setTarikhMasuk] = useState(initialData?.tarikhMasuk || today);
  const [tarikhKeluar, setTarikhKeluar] = useState(initialData?.tarikhKeluar || nextWeek);
  const [tempohHari, setTempohHari] = useState(initialData?.tempohHari || 7);
  const [sebabKemasukan, setSebabKemasukan] = useState(initialData?.sebabKemasukan || '');
  const [bilikDormDicadangkan, setBilikDormDicadangkan] = useState(initialData?.bilikDormDicadangkan || '');
  const [catatanKemasukan, setCatatanKemasukan] = useState(initialData?.catatanKemasukan || '');

  // Yuran & Bayaran Bon Asrama (RM30)
  const bayaranBon = 30.00;
  const kadarHarian = 0;
  const statusBayaran: StatusBayaran = 'Percuma / Kutipan di Kaunter';
  const kaedahBayaran = 'Kaunter Pendaftaran Masuk Asrama';
  const noResit = '-';

  // Kelulusan
  const [statusKelulusan, setStatusKelulusan] = useState<StatusPermohonan>(initialData?.statusKelulusan || 'MENUNGGU KELULUSAN');
  const [catatanWarden, setCatatanWarden] = useState(initialData?.catatanWarden || '');

  // Auto-detect gender from Malaysian IC number (last digit odd = Lelaki, even = Perempuan)
  const handleICChange = (val: string) => {
    setNoKP(val);
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length >= 1) {
      const lastDigit = parseInt(cleaned[cleaned.length - 1], 10);
      if (!isNaN(lastDigit)) {
        if (lastDigit % 2 === 1) {
          setJantina('Lelaki');
          if (bilikDormDicadangkan.includes('Mawar') || bilikDormDicadangkan.includes('Aspuri')) {
            setBilikDormDicadangkan('Dorm Al-Farabi 02 (Blok Aspura)');
          }
        } else {
          setJantina('Perempuan');
          if (bilikDormDicadangkan.includes('Al-Farabi') || bilikDormDicadangkan.includes('Aspura')) {
            setBilikDormDicadangkan('Dorm Mawar Putih 04 (Blok Aspuri)');
          }
        }
      }
    }
  };

  // Recalculate duration when dates change
  useEffect(() => {
    if (tarikhMasuk && tarikhKeluar) {
      const start = new Date(tarikhMasuk);
      const end = new Date(tarikhKeluar);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        setTempohHari(diffDays);
      }
    }
  }, [tarikhMasuk, tarikhKeluar]);

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result as string);
        setFotoType('passport');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Doctor-Certified Health Document Upload
  const handleHealthDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDokumenKesihatanUrl(reader.result as string);
        if (!namaDoktorKlinik) {
          setNamaDoktorKlinik('Dr. Pegawai Perubatan (Borang Kesihatan Terlampir)');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Camera Capture for Selfie
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Tidak dapat mengakses kamera peranti. Sila pastikan kebenaran kamera dibenarkan.");
      setIsCameraActive(false);
    }
  };

  const takeSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 300;
      canvas.height = videoRef.current.videoHeight || 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFotoUrl(dataUrl);
        setFotoType('swafoto');
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  // Calculated Fees & Bon Asrama (RM30)
  const yuranMakan = 0;
  const yuranPenginapan = 0;
  const jumlahYuran = 30.00;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPelajar.trim()) {
      alert("Sila masukkan nama pelajar.");
      return;
    }

    const payload: PermohonanAsrama = {
      id: initialData?.id || `kks-${Date.now()}`,
      noRujukan: initialData?.noRujukan || nextReferenceNumber,
      tarikhPermohonan: initialData?.tarikhPermohonan || new Date().toISOString().split('T')[0],
      namaPelajar: namaPelajar.toUpperCase(),
      noKP: noKP || '090101-10-0000',
      jantina,
      tingkatanKelas,
      namaSekolah,
      namaPenjaga,
      noTelefonPenjaga,
      hubunganPenjaga,
      alamatRumah,
      fotoUrl,
      fotoType,

      statusKesihatan,
      namaDoktorKlinik,
      tarikhPemeriksaan,
      rekodAlahanPenyakit,
      catatanKesihatan,
      dokumenKesihatanUrl: dokumenKesihatanUrl || '',
      tarikhUploadKesihatan: dokumenKesihatanUrl ? (initialData?.tarikhUploadKesihatan || new Date().toISOString().split('T')[0]) : '',

      bayaranBon,
      kadarHarian,
      tempohHari,
      yuranMakan,
      yuranPenginapan,
      jumlahYuran,
      statusBayaran,
      noResit,
      kaedahBayaran,

      tarikhMasuk,
      tarikhKeluar,
      sebabKemasukan,
      bilikDormDicadangkan,
      catatanKemasukan,

      statusKelulusan,
      tarikhKeputusan: statusKelulusan === 'DILULUSKAN' ? new Date().toISOString().split('T')[0] : '-',
      namaWardenPenilai: 'Ustaz Ahmad Fauzi (Ketua Warden Asrama Salaping)',
      catatanWarden,
      namaPengetua: 'Tn. Haji Mohd Radzi bin Kassim',
      tarikhPengesahanPengetua: statusKelulusan === 'DILULUSKAN' ? new Date().toISOString().split('T')[0] : ''
    };

    onSave(payload);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              {initialData ? 'Kemas Kini Permohonan Kemasukan Sementara' : 'Borang Permohonan Kemasukan Khas Sementara'}
            </h1>
            <p className="text-xs text-slate-500">
              No. Rujukan Dokumen: <strong className="font-mono text-slate-800">{initialData?.noRujukan || nextReferenceNumber}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>Simpan & Jana Borang A4</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION A: MAKLUMAT PELAJAR & GAMBAR */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <User className="w-4 h-4 text-slate-700" />
              A. Maklumat Pelajar & Ruang Foto
            </h2>
            <span className="text-xs text-slate-500">
              Kategori Terpilih: <strong className={jantina === 'Lelaki' ? 'text-blue-700' : 'text-rose-700'}>{jantina === 'Lelaki' ? 'Aspura (Putera)' : 'Aspuri (Puteri)'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Form Fields (8 cols) */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">
                  Nama Penuh Pelajar (Huruf Besar) *
                </label>
                <input
                  type="text"
                  required
                  value={namaPelajar}
                  onChange={(e) => setNamaPelajar(e.target.value)}
                  placeholder="Contoh: MUHAMMAD DANIAL BIN ARIFFIN"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium uppercase focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  No. Kad Pengenalan / Dokumen *
                </label>
                <input
                  type="text"
                  required
                  value={noKP}
                  onChange={(e) => handleICChange(e.target.value)}
                  placeholder="Contoh: 090514-10-5431"
                  className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  * Jantina dikesan secara automatik melalui digit akhir IC
                </span>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Jantina (Aspura / Aspuri) *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setJantina('Lelaki');
                      setBilikDormDicadangkan('Dorm Al-Farabi 02 (Blok Aspura)');
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      jantina === 'Lelaki'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 ring-1 ring-blue-600'
                        : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Aspura (Lelaki)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setJantina('Perempuan');
                      setBilikDormDicadangkan('Dorm Mawar Putih 04 (Blok Aspuri)');
                    }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      jantina === 'Perempuan'
                        ? 'bg-rose-50 border-rose-600 text-rose-900 ring-1 ring-rose-600'
                        : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Aspuri (Perempuan)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Tingkatan / Kelas *
                </label>
                <input
                  type="text"
                  required
                  value={tingkatanKelas}
                  onChange={(e) => setTingkatanKelas(e.target.value)}
                  placeholder="Contoh: Tingkatan 4 Sains 1"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Nama Sekolah Asal *
                </label>
                <input
                  type="text"
                  required
                  value={namaSekolah}
                  onChange={(e) => setNamaSekolah(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Nama Ibu / Bapa / Penjaga *
                </label>
                <input
                  type="text"
                  required
                  value={namaPenjaga}
                  onChange={(e) => setNamaPenjaga(e.target.value)}
                  placeholder="Nama Penjaga Sah"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  No. Telefon Penjaga (Kecemasan) *
                </label>
                <input
                  type="tel"
                  required
                  value={noTelefonPenjaga}
                  onChange={(e) => setNoTelefonPenjaga(e.target.value)}
                  placeholder="Contoh: 012-3456789"
                  className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">
                  Alamat Rumah Tetap
                </label>
                <textarea
                  rows={2}
                  value={alamatRumah}
                  onChange={(e) => setAlamatRumah(e.target.value)}
                  placeholder="Alamat kediaman lengkap"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

            </div>

            {/* Photo Upload / Selfie Space (4 cols) */}
            <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-between text-center">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
                  Ruang Gambar Pemohon
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Foto Pasport atau Gambar Swafoto (Selfie) Dibenarkan asalkan wajah jelas.
                </span>
              </div>

              {/* Photo Display / Camera Stream */}
              <div className="my-3 relative w-32 h-40 bg-white border-2 border-slate-300 rounded-lg overflow-hidden shadow-xs flex items-center justify-center">
                {isCameraActive ? (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover" 
                  />
                ) : fotoUrl ? (
                  <img 
                    src={fotoUrl} 
                    alt="Foto Pemohon" 
                    className="w-full h-full object-cover object-top" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-300" />
                )}

                {/* Badge for Selfie vs Passport */}
                <div className="absolute bottom-1 right-1 bg-slate-900/80 text-white text-[8px] px-1 py-0.5 rounded font-mono">
                  {fotoType === 'swafoto' ? 'SWAFOTO' : 'PASPORT'}
                </div>
              </div>

              {/* Action Buttons for Photo */}
              <div className="w-full space-y-1.5 text-xs">
                {isCameraActive ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={takeSelfie}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                    >
                      Tangkap Gambar
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-2 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-700 font-medium">
                        <Upload className="w-3 h-3 text-slate-500" />
                        <span className="text-[11px]">Muat Naik</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={startCamera}
                        className="flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-medium"
                      >
                        <Camera className="w-3 h-3 text-slate-500" />
                        <span className="text-[11px]">Ambil Selfie</span>
                      </button>
                    </div>

                    {/* Quick Preset Selector */}
                    <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-slate-500">
                      <span>Pilih Contoh:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFotoUrl(studentMalePhoto);
                          setFotoType('passport');
                          setJantina('Lelaki');
                        }}
                        className="underline hover:text-slate-800"
                      >
                        Putera
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFotoUrl(studentFemalePhoto);
                          setFotoType('swafoto');
                          setJantina('Perempuan');
                        }}
                        className="underline hover:text-slate-800"
                      >
                        Puteri
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* SPECIAL STRUCTURED SECTION: LAPORAN KESIHATAN & YURAN ASRAMA */}
        {/* User request: "Susun maklumat laporan kesihatan dan yuran dalam petak/ruang khas yang tersusun bersama bahagian maklumat utama di atas. Gunakan kotak, label dan susun atur yang konsisten supaya setiap maklumat boleh dibaca dengan pantas." */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Petak Khas 1: Laporan Kesihatan Doktor */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                Petak Laporan Kesihatan Doktor
              </h2>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                Kesihatan Pelajar
              </span>
            </div>

            {/* Step 1: Download Blank A4 Form Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50/60 to-sky-50/70 border border-emerald-200/90 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                    Langkah 1: Muat Turun Borang A4
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-snug">
                  Cetak borang pemeriksaan khas 1 muka surat A4 untuk dibawa berjumpa doktor perubatan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsHealthFormModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs whitespace-nowrap cursor-pointer transition-all shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak / Download Borang A4</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Status Kesihatan & Kelayakan Asrama *
                </label>
                <select
                  value={statusKesihatan}
                  onChange={(e) => setStatusKesihatan(e.target.value as StatusKesihatan)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                >
                  <option value="Sihat & Layak Asrama">Sihat & Layak Asrama (Tiada Komplikasi)</option>
                  <option value="Ada Alahan / Rawatan Khas">Ada Alahan / Rawatan Khas (Bawa Ubat Sendiri)</option>
                  <option value="Memerlukan Pemantauan">Memerlukan Pemantauan (Asma/Kesihatan Khusus)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Nama Doktor / Klinik / Hospital
                </label>
                <input
                  type="text"
                  value={namaDoktorKlinik}
                  onChange={(e) => setNamaDoktorKlinik(e.target.value)}
                  placeholder="Contoh: Dr. Zulkifli Rahman (Klinik Kesihatan Kajang)"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Tarikh Pemeriksaan
                  </label>
                  <input
                    type="date"
                    value={tarikhPemeriksaan}
                    onChange={(e) => setTarikhPemeriksaan(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Pengesahan Doktor
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Disahkan Layak Berasrama"
                    className="w-full bg-emerald-50/60 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Rekod Alahan / Penyakit / Ubat Dibawa
                </label>
                <textarea
                  rows={2}
                  value={rekodAlahanPenyakit}
                  onChange={(e) => setRekodAlahanPenyakit(e.target.value)}
                  placeholder="Contoh: Tiada alahan / Alahan makanan laut sederhana"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>

              {/* Step 2: Upload Gambar Borang Kesihatan Disahkan Doktor */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 border border-sky-300 px-2 py-0.5 rounded-full">
                      Langkah 2: Upload Gambar Borang Disahkan
                    </span>
                  </div>
                  {dokumenKesihatanUrl ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Disahkan & Dimuat Naik
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Belum Dimuat Naik
                    </span>
                  )}
                </div>

                {dokumenKesihatanUrl ? (
                  <div className="bg-slate-50/90 border border-emerald-300 rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div 
                        onClick={() => setIsHealthDocViewerOpen(true)}
                        className="w-13 h-17 rounded-lg bg-white border border-slate-300 overflow-hidden shadow-2xs cursor-pointer hover:ring-2 hover:ring-emerald-500 relative group shrink-0"
                        title="Klik untuk melihat imbasan saiz penuh"
                      >
                        <img 
                          src={dokumenKesihatanUrl} 
                          alt="Borang Doktor" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>

                      <div>
                        <strong className="text-slate-900 text-xs block font-bold">
                          Borang Kesihatan Disahkan Doktor
                        </strong>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {namaDoktorKlinik || 'Doktor Perubatan Berdaftar'} • Cop Sah Rasmi
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsHealthDocViewerOpen(true)}
                          className="text-[11px] text-sky-700 hover:text-sky-900 font-bold underline mt-1 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Lihat Borang Saiz Penuh</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => healthFileInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        Tukar
                      </button>
                      <button
                        type="button"
                        onClick={() => setDokumenKesihatanUrl('')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 border border-rose-200 rounded-lg cursor-pointer transition-colors"
                      >
                        Padam
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl p-4 text-center bg-slate-50/70 transition-all">
                    <FileText className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-800">
                      Ambil Gambar / Upload Borang Kesihatan Disahkan
                    </p>
                    <p className="text-[10px] text-slate-500 max-w-sm mx-auto mt-0.5">
                      Sila tangkap gambar borang A4 yang telah ditandatangani dan dicop oleh klinik/hospital untuk pengesahan pihak warden.
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => healthFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-2xs cursor-pointer transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih Fail Gambar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => healthCameraInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Kamera Telefon</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setDokumenKesihatanUrl(SAMPLE_DOCTOR_CERTIFIED_FORM);
                          setNamaDoktorKlinik('Dr. Zulkifli bin Abdul Rahman (Klinik Kesihatan Kajang)');
                          setTarikhPemeriksaan('2026-09-28');
                          setStatusKesihatan('Sihat & Layak Asrama');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                        title="Muat contoh borang kesihatan yang lengkap dicop doktor untuk pengujian"
                      >
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Guna Contoh Borang Doktor</span>
                      </button>
                    </div>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={healthFileInputRef} 
                  onChange={handleHealthDocUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <input 
                  type="file" 
                  ref={healthCameraInputRef} 
                  onChange={handleHealthDocUpload} 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                />
              </div>

            </div>
          </div>

          {/* Petak Khas 2: Kiraan & Ringkasan Yuran / Bon Asrama */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                Petak Kiraan & Ringkasan Bayaran Asrama
              </h2>
              <span className="text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-md">
                BON ASRAMA: RM 30.00
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <span className="text-[11px] text-slate-500 font-medium block">1. Bayaran BON Asrama (Cagaran)</span>
                  <span className="text-lg font-bold font-mono text-slate-900">RM 30.00</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Satu-satunya bayaran yang dikenakan</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <span className="text-[11px] text-slate-500 font-medium block">2. Yuran Penginapan & Makan</span>
                  <span className="text-lg font-bold text-emerald-700">Percuma (RM 0.00)</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Tiada sebarang yuran harian dikenakan</span>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-slate-800 text-xs leading-relaxed shadow-2xs">
                <strong className="text-slate-900 block mb-1">Pemberitahuan Kaunter:</strong>
                <p className="text-slate-700 font-medium">
                  Bayaran BON asrama sebanyak <strong>RM30</strong> (dan kadar bayaran masuk asrama jika berkaitan) akan ditentukan dan dikutip semasa mendaftar di kaunter pendaftaran pada hari pendaftaran masuk pelajar asrama.
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                <span>Kaedah Kutipan: <strong className="text-blue-700">Kaunter Pendaftaran Hari Masuk</strong></span>
                <span>Jumlah Perlu Dibayar: <strong className="text-slate-900 font-mono font-bold">RM 30.00 (Bon)</strong></span>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION B: BUTIRAN KEMASUKAN SEMENTARA */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
          <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-700" />
              B. Butiran Kemasukan Sementara
            </h2>
            <span className="text-xs text-slate-500">
              Tempoh: <strong className="font-mono">{tempohHari} Hari</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Tarikh Masuk *
              </label>
              <input
                type="date"
                required
                value={tarikhMasuk}
                onChange={(e) => setTarikhMasuk(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Tarikh Keluar *
              </label>
              <input
                type="date"
                required
                value={tarikhKeluar}
                onChange={(e) => setTarikhKeluar(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Cadangan Bilik / Dorm *
              </label>
              <input
                type="text"
                required
                value={bilikDormDicadangkan}
                onChange={(e) => setBilikDormDicadangkan(e.target.value)}
                placeholder="Contoh: Dorm Al-Farabi 02 (Aspura)"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 font-semibold mb-1">
                Sebab Kemasukan Sementara *
              </label>
              <input
                type="text"
                required
                value={sebabKemasukan}
                onChange={(e) => setSebabKemasukan(e.target.value)}
                placeholder="Contoh: Menghadiri Kem Kecemerlangan SPM / Bencana Banjir / Ibu Bapa Outstation"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Catatan Tambahan Asrama
              </label>
              <input
                type="text"
                value={catatanKemasukan}
                onChange={(e) => setCatatanKemasukan(e.target.value)}
                placeholder="Contoh: Wakil atlet olahraga sekolah"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION C: KELULUSAN WARDEN / PENGETUA (Shown for staff, simplified perakuan for applicants) */}
        {userRole === 'pentadbir' ? (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                C. Keputusan & Perakuan Pihak Pengurusan Asrama (Mod Pentadbir)
              </h2>
              <span className="text-[11px] text-slate-500">
                * Kawalan Warden & Pengetua
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Keputusan Permohonan Asrama *
                </label>
                <select
                  value={statusKelulusan}
                  onChange={(e) => setStatusKelulusan(e.target.value as StatusPermohonan)}
                  className={`w-full font-semibold rounded-lg px-3 py-2.5 border focus:outline-none ${
                    statusKelulusan === 'DILULUSKAN'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : statusKelulusan === 'MENUNGGU KELULUSAN'
                      ? 'bg-amber-50 border-amber-400 text-amber-900'
                      : 'bg-rose-50 border-rose-400 text-rose-900'
                  }`}
                >
                  <option value="DILULUSKAN">■ DILULUSKAN (Borang Rasmi A4)</option>
                  <option value="MENUNGGU KELULUSAN">□ MENUNGGU KELULUSAN</option>
                  <option value="TIDAK DILULUSKAN">□ TIDAK DILULUSKAN</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Ulasan & Catatan Warden / Pengetua
                </label>
                <input
                  type="text"
                  value={catatanWarden}
                  onChange={(e) => setCatatanWarden(e.target.value)}
                  placeholder="Catatan pegawai pemeriksa"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Perakuan & Pengesahan Pemohon
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              Saya dengan ini memperakui bahawa segala maklumat yang diberikan dalam borang permohonan ini adalah benar dan sahih. Selepas menekan butang <strong>"Hantar & Cetak Borang PDF"</strong> di bawah, borang rasmi satu helaian A4 yang lengkap akan dijana serta-merta untuk simpanan dan cetakan anda.
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Hantar & Jana Borang PDF (A4)</span>
          </button>
        </div>

      </form>

      {/* Official 1-Page A4 Blank Health Examination Form Modal */}
      <BorangKesihatanA4Modal
        isOpen={isHealthFormModalOpen}
        onClose={() => setIsHealthFormModalOpen(false)}
        studentName={namaPelajar}
        studentIC={noKP}
        studentClass={tingkatanKelas}
        guardianName={namaPenjaga}
        guardianPhone={noTelefonPenjaga}
      />

      {/* Full-size Doctor Certified Health Document Viewer Lightbox */}
      <DokumenKesihatanViewerModal
        isOpen={isHealthDocViewerOpen}
        onClose={() => setIsHealthDocViewerOpen(false)}
        imageUrl={dokumenKesihatanUrl}
        studentName={namaPelajar}
        doctorName={namaDoktorKlinik}
        tarikhPemeriksaan={tarikhPemeriksaan}
      />

    </div>
  );
};
