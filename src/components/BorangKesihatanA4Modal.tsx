import React, { useRef } from 'react';
import { 
  Printer, 
  X, 
  Download, 
  CheckCircle2, 
  Stethoscope, 
  AlertCircle,
  FileText,
  Building
} from 'lucide-react';
import { SalapingLogo } from './SalapingLogo';
import { SCHOOL_INFO } from '../data/mockData';

interface BorangKesihatanA4ModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentIC?: string;
  studentClass?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export const BorangKesihatanA4Modal: React.FC<BorangKesihatanA4ModalProps> = ({
  isOpen,
  onClose,
  studentName = '',
  studentIC = '',
  studentClass = '',
  guardianName = '',
  guardianPhone = ''
}) => {
  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      
      {/* Container wrapper */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[96vh] flex flex-col border border-slate-200 overflow-hidden my-auto animate-in fade-in duration-200">
        
        {/* Modal Top Control Bar (Screen only, hidden on print) */}
        <div className="no-print p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                Borang Pemeriksaan Kesihatan & Kelayakan Berasrama (A4)
              </h2>
              <p className="text-[11px] text-slate-300">
                Format rasmi 1 muka surat A4 untuk dibawa berjumpa pegawai perubatan / klinik berdaftar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Instructions Bar (Screen only) */}
        <div className="no-print bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Panduan Tindakan Pelajar / Ibu Bapa:</strong> Cetak borang ini dalam <strong>1 helaian A4</strong>. Bawa borang ini semasa pemeriksaan doktor di Klinik Kesihatan / Hospital / Klinik Swasta berdaftar. Selepas doktor mengesahkan dan mengecop borang, <strong>ambil gambar / imbas</strong> borang tersebut dan muat naik ke dalam portal permohonan e-Asrama.
          </div>
        </div>

        {/* A4 Sheet Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/90 flex justify-center">
          
          {/* Exact Single Page A4 Form (Print-ready, styled strictly to fit 1 page) */}
          <div 
            ref={printContainerRef}
            className="a4-page-preview a4-print-document p-6 sm:p-7 text-slate-900 text-[10px] leading-tight select-text flex flex-col justify-between font-sans border border-slate-300 bg-white"
            style={{ width: '210mm', minHeight: '297mm', maxHeight: '297mm' }}
          >
            <div>
              {/* Institutional Header */}
              <div className="border-b-2 border-slate-900 pb-2 mb-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-13 h-13 shrink-0 flex items-center justify-center">
                    <SalapingLogo className="w-12 h-12 object-contain" />
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-[9px] font-semibold text-slate-600 uppercase tracking-widest leading-none">
                      {SCHOOL_INFO.namaKementerian} • {SCHOOL_INFO.namaJabatan}
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight mt-0.5">
                      {SCHOOL_INFO.namaSekolah}
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">
                      {SCHOOL_INFO.namaAsrama}
                    </div>
                    <div className="text-[8.5px] text-slate-500 mt-0.5">
                      {SCHOOL_INFO.alamat} • Tel: {SCHOOL_INFO.noTelefon}
                    </div>
                  </div>
                  <div className="w-13 text-right">
                    <span className="inline-block border border-slate-800 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase rounded-xs">
                      BORANG-KES/01
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center border-t border-slate-300 pt-1.5">
                  <h1 className="text-xs font-black uppercase tracking-wider text-slate-950">
                    BORANG LAPORAN PEMERIKSAAN KESIHATAN & PENGESAHAN DOKTOR
                  </h1>
                  <p className="text-[8.5px] text-slate-600 font-medium">
                    (Wajib dilengkapkan dan ditandatangani oleh Pegawai Perubatan Berdaftar bagi Kemasukan Asrama)
                  </p>
                </div>
              </div>

              {/* BAHAGIAN 1: MAKLUMAT MURID */}
              <div className="mb-2.5">
                <div className="bg-slate-800 text-white px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>BAHAGIAN 1: MAKLUMAT PEMOHON (Diisi oleh Pemohon / Ibu Bapa)</span>
                  <span className="text-[8px] font-normal text-slate-300">Sesi 2026</span>
                </div>
                <div className="border border-slate-300 border-t-0 p-2 grid grid-cols-12 gap-x-2 gap-y-1 text-[9.5px]">
                  <div className="col-span-8">
                    <span className="text-slate-500 block text-[8px] uppercase">Nama Penuh Pelajar:</span>
                    <strong className="text-slate-900 uppercase font-bold text-[10px]">
                      {studentName || '____________________________________________________'}
                    </strong>
                  </div>
                  <div className="col-span-4">
                    <span className="text-slate-500 block text-[8px] uppercase">No. Kad Pengenalan:</span>
                    <strong className="font-mono text-slate-900 text-[10px]">
                      {studentIC || '________________________'}
                    </strong>
                  </div>

                  <div className="col-span-4">
                    <span className="text-slate-500 block text-[8px] uppercase">Tingkatan / Kelas:</span>
                    <span className="font-medium text-slate-900">{studentClass || '____________________'}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-slate-500 block text-[8px] uppercase">Nama Ibu Bapa / Penjaga:</span>
                    <span className="font-medium text-slate-900">{guardianName || '____________________'}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-slate-500 block text-[8px] uppercase">No. Telefon Kecemasan:</span>
                    <span className="font-mono text-slate-900">{guardianPhone || '____________________'}</span>
                  </div>
                </div>
              </div>

              {/* BAHAGIAN 2: DEKLARASI SEJARAH KESIHATAN */}
              <div className="mb-2.5">
                <div className="bg-slate-800 text-white px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>BAHAGIAN 2: REKOD & SEJARAH KESIHATAN PELAJAR</span>
                  <span className="text-[8px] font-normal text-slate-300">Tandakan (✓) pada petak berkaitan</span>
                </div>
                <div className="border border-slate-300 border-t-0 p-2 text-[9px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span>1. Penyakit Lelah / Asma Kronik</span>
                      <div className="flex gap-2 font-mono"><span>[ &nbsp; ] Ya</span><span>[ &nbsp; ] Tidak</span></div>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span>5. Masalah Buah Pinggang / Urinari</span>
                      <div className="flex gap-2 font-mono"><span>[ &nbsp; ] Ya</span><span>[ &nbsp; ] Tidak</span></div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span>2. Penyakit Jantung / Tekanan Darah</span>
                      <div className="flex gap-2 font-mono"><span>[ &nbsp; ] Ya</span><span>[ &nbsp; ] Tidak</span></div>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span>6. Penyakit Kulit Berjangkit / Ekzema</span>
                      <div className="flex gap-2 font-mono"><span>[ &nbsp; ] Ya</span><span>[ &nbsp; ] Tidak</span></div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span>3. Sawan / Epilepsi / Gangguan Saraf</span>
                      <div className="flex gap-2 font-mono"><span>[ &nbsp; ] Ya</span><span>[ &nbsp; ] Tidak</span></div>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span>7. Sejarah Pembedahan Utama (2 Tahun)</span>
                      <div className="flex gap-2 font-mono"><span>[ &nbsp; ] Ya</span><span>[ &nbsp; ] Tidak</span></div>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span>4. Alahan Makanan / Ubat-ubatan</span>
                      <div className="flex gap-2 font-mono"><span>[ &nbsp; ] Ya</span><span>[ &nbsp; ] Tidak</span></div>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-0.5">
                      <span>8. Keperluan Ubat Rutin Harian</span>
                      <div className="flex gap-2 font-mono"><span>[ &nbsp; ] Ya</span><span>[ &nbsp; ] Tidak</span></div>
                    </div>
                  </div>

                  <div className="mt-1.5 pt-1 border-t border-slate-200">
                    <span className="text-slate-600 block text-[8px]">Jika YA, nyatakan butiran alahan / penyakit / ubat yang dibawa bersama ke asrama:</span>
                    <div className="border-b border-dotted border-slate-400 mt-1 pb-0.5 text-slate-700 italic">
                      ...............................................................................................................................................................................................................
                    </div>
                  </div>
                </div>
              </div>

              {/* BAHAGIAN 3: PEMERIKSAAN FIZIKAL & KLINIKAL */}
              <div className="mb-2.5">
                <div className="bg-slate-800 text-white px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>BAHAGIAN 3: PEMERIKSAAN FIZIKAL & KLINIKAL (Diisi oleh Pegawai Perubatan)</span>
                  <span className="text-[8px] font-normal text-slate-300">Pemeriksaan Am</span>
                </div>
                <div className="border border-slate-300 border-t-0 p-2 text-[9px]">
                  <table className="w-full border-collapse border border-slate-300 text-[9px] mb-1.5">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-1 font-semibold bg-slate-50 w-28">Tinggi (cm):</td>
                        <td className="p-1 w-24">___________ cm</td>
                        <td className="p-1 font-semibold bg-slate-50 w-28">Berat Badan (kg):</td>
                        <td className="p-1 w-24">___________ kg</td>
                        <td className="p-1 font-semibold bg-slate-50 w-28">BMI:</td>
                        <td className="p-1">___________</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-1 font-semibold bg-slate-50">Tekanan Darah:</td>
                        <td className="p-1">______/______ mmHg</td>
                        <td className="p-1 font-semibold bg-slate-50">Kadar Nadi:</td>
                        <td className="p-1">______ bpm</td>
                        <td className="p-1 font-semibold bg-slate-50">Penglihatan:</td>
                        <td className="p-1">Kanan: 6/___ &nbsp; Kiri: 6/___</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="grid grid-cols-3 gap-2 text-[8.5px]">
                    <div className="border border-slate-200 p-1.5 rounded-xs">
                      <strong className="block text-slate-800">Sistem Kardiovaskular:</strong>
                      <span className="text-slate-500">[ &nbsp; ] Normal &nbsp; [ &nbsp; ] Tidak Normal</span>
                    </div>
                    <div className="border border-slate-200 p-1.5 rounded-xs">
                      <strong className="block text-slate-800">Sistem Respiratori / Paru-Paru:</strong>
                      <span className="text-slate-500">[ &nbsp; ] Normal &nbsp; [ &nbsp; ] Tidak Normal</span>
                    </div>
                    <div className="border border-slate-200 p-1.5 rounded-xs">
                      <strong className="block text-slate-800">Abdomen & Anggota Fizikal:</strong>
                      <span className="text-slate-500">[ &nbsp; ] Normal &nbsp; [ &nbsp; ] Tidak Normal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BAHAGIAN 4: PENGESAHAN KELAYAKAN BERASRAMA OLEH PEGAWAI PERUBATAN */}
              <div className="mb-2">
                <div className="bg-slate-900 text-white px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider flex justify-between items-center">
                  <span>BAHAGIAN 4: PERAKUAN & KELAYAKAN BERASRAMA (PEGAWAI PERUBATAN)</span>
                  <span className="text-[8px] font-normal text-amber-300">Wajib Cop Rasmi</span>
                </div>
                <div className="border border-slate-300 border-t-0 p-2.5 text-[9px] bg-slate-50/50">
                  <p className="text-slate-800 mb-1.5 font-medium leading-relaxed">
                    Saya, Pegawai Perubatan yang bertandatangan di bawah, telah memeriksa murid bernama di atas pada hari ini dan mengesahkan bahawa keadaan kesihatan murid adalah seperti berikut:
                  </p>

                  <div className="space-y-1 mb-3 pl-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-950">
                      <span className="w-3.5 h-3.5 border border-slate-600 rounded-xs inline-block"></span>
                      <span>(A) SIHAT & LAYAK BERASRAMA PENUH (Bebas daripada sebarang penyakit kronik / berjangkit yang menghalang hidup berasrama).</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-950">
                      <span className="w-3.5 h-3.5 border border-slate-600 rounded-xs inline-block"></span>
                      <span>(B) LAYAK DENGAN PEMANTAUAN KHUSUS / RAWATAN (Perlu penjagaan ubat berjadual / alahan ringan):</span>
                    </label>

                    <div className="pl-6 text-[8.5px] text-slate-500 italic">
                      Catatan Doktor: ...........................................................................................................................................................
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-950">
                      <span className="w-3.5 h-3.5 border border-slate-600 rounded-xs inline-block"></span>
                      <span>(C) TIDAK LAYAK BERASRAMA atas sebab faktor kesihatan kritikal yang memerlukan penjagaan rapi keluarga.</span>
                    </label>
                  </div>

                  {/* Sign & Stamp Space */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-300">
                    <div>
                      <div className="text-[8px] text-slate-500 uppercase font-semibold mb-0.5">Tandatangan Pegawai Perubatan:</div>
                      <div className="h-10 border-b border-dotted border-slate-400"></div>
                      <div className="text-[8.5px] text-slate-700 mt-1">
                        <div>Nama Doktor: ................................................................</div>
                        <div className="mt-0.5">No. Pendaftaran MMC: .........................................</div>
                        <div className="mt-0.5">Tarikh Pemeriksaan: ............................................</div>
                      </div>
                    </div>

                    <div className="border border-dashed border-slate-400 p-2 rounded flex flex-col justify-between text-center bg-white min-h-[90px]">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">
                        RUANG COP RASMI KLINIK / HOSPITAL KERAJAAN / SWASTA
                      </span>
                      <div className="text-[7.5px] text-slate-400 italic">
                        (Cop mesti mengandungi nama pengamal perubatan dan alamat klinik)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Notice */}
            <div className="border-t border-slate-300 pt-1 text-[8px] text-slate-500 flex justify-between items-center">
              <span>SMK Salaping • Sistem Pengurusan e-Asrama • Dokumen Rasmi Pemeriksaan Kesihatan</span>
              <span>Helaian 1 daripada 1 (A4)</span>
            </div>

          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="no-print p-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-600 text-[11px]">
            * Pastikan tetapan pencetak diset kepada <strong>A4 Portrait</strong> dengan <strong>Margin: Default / Minimum</strong>.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Sekarang (A4)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
