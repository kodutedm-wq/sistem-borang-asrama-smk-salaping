import React, { useState } from 'react';
import { PermohonanAsrama } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { SalapingLogo } from './SalapingLogo';
import { BorangKesihatanA4Modal } from './BorangKesihatanA4Modal';
import { 
  Printer, 
  FileSpreadsheet, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Calendar,
  Stethoscope
} from 'lucide-react';

interface SenaraiPengetuaPrintProps {
  students: PermohonanAsrama[];
  onBackToDashboard: () => void;
  onViewStudentA4: (student: PermohonanAsrama) => void;
}

export const SenaraiPengetuaPrint: React.FC<SenaraiPengetuaPrintProps> = ({
  students,
  onBackToDashboard,
  onViewStudentA4
}) => {
  const [filterJantina, setFilterJantina] = useState<'Semua' | 'Lelaki' | 'Perempuan'>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  const filteredStudents = students.filter(student => {
    if (filterJantina !== 'Semua' && student.jantina !== filterJantina) return false;
    if (filterStatus !== 'Semua' && student.statusKelulusan !== filterStatus) return false;
    return true;
  });

  const totalAspura = students.filter(s => s.jantina === 'Lelaki').length;
  const totalAspuri = students.filter(s => s.jantina === 'Perempuan').length;
  const totalKeseluruhan = students.length;
  const totalDiluluskan = students.filter(s => s.statusKelulusan === 'DILULUSKAN').length;
  const totalMenunggu = students.filter(s => s.statusKelulusan === 'MENUNGGU KELULUSAN').length;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-4">
      
      {/* Top Action Bar (Hidden on Print) */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            title="Kembali ke Papan Pemuka"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-500" />
              Senarai Rasmi Pemohon (Format Pengetua)
            </h1>
            <p className="text-xs text-slate-500">
              Dokumen ringkas, teratur dan sedia untuk dicetak serta-merta apabila diminta oleh Tuan Pengetua.
            </p>
          </div>
        </div>

        {/* Filter Controls & Print Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Jantina:</span>
            <select
              value={filterJantina}
              onChange={(e) => setFilterJantina(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
            >
              <option value="Semua">Semua ({totalKeseluruhan})</option>
              <option value="Lelaki">Aspura Sahaja ({totalAspura})</option>
              <option value="Perempuan">Aspuri Sahaja ({totalAspuri})</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="DILULUSKAN">Diluluskan Sahaja ({totalDiluluskan})</option>
              <option value="MENUNGGU KELULUSAN">Menunggu Kelulusan ({totalMenunggu})</option>
            </select>
          </div>

          <button
            onClick={() => setIsHealthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
            title="Cetak Borang Kosong Pemeriksaan Kesihatan (A4)"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>Borang Kesihatan (A4)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Cetak Senarai Pengetua (A4)</span>
          </button>

        </div>
      </div>

      {/* PRINT-READY CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xs p-6 lg:p-8 senarai-pengetua-print-area max-w-5xl mx-auto">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-3 mb-4">
          <div className="flex items-center justify-between gap-4">
            
            <div className="w-14 h-14 shrink-0 flex items-center justify-center">
              <SalapingLogo className="w-13 h-13 object-contain" />
            </div>

            <div className="text-center flex-1">
              <div className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                {SCHOOL_INFO.namaKementerian} • {SCHOOL_INFO.namaSekolah}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-tight">
                {SCHOOL_INFO.namaAsrama}
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5 uppercase tracking-wide">
                SENARAI NAMA PEMOHON KEMASUKAN SEMENTARA ASRAMA
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                (Untuk Semakan, Pengesahan & Rekod Tuan Pengetua)
              </div>
            </div>

            <div className="text-right text-[10px] text-slate-600 shrink-0">
              <div>Tarikh Laporan: <strong>{currentDate}</strong></div>
              <div>Sesi Persekolahan: <strong>2026</strong></div>
              <div className="font-mono text-[9px] text-slate-500 mt-0.5">KOD: AS-SENARAI-PENG</div>
            </div>

          </div>

          {/* Quick Metrics Bar for Pengetua */}
          <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs bg-slate-50 px-3 py-1.5 rounded-sm">
            <div className="flex items-center gap-4">
              <span>Jumlah Keseluruhan: <strong className="font-mono text-slate-900">{totalKeseluruhan}</strong> orang</span>
              <span>·</span>
              <span>Aspura (Lelaki): <strong className="font-mono text-blue-700">{totalAspura}</strong> orang</span>
              <span>·</span>
              <span>Aspuri (Perempuan): <strong className="font-mono text-rose-700">{totalAspuri}</strong> orang</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <span>Status: <strong className="text-emerald-700">{totalDiluluskan} Diluluskan</strong>, <strong className="text-amber-700">{totalMenunggu} Semakan</strong></span>
            </div>
          </div>
        </div>

        {/* The Requested Table: Bil. | Nama | No. IC | Kelas | Jantina | Status (+ Tempoh & Catatan) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white uppercase text-[10px] tracking-wider">
                <th className="py-2 px-2 text-center w-8 border border-slate-700">Bil.</th>
                <th className="py-2 px-3 border border-slate-700">Nama Pelajar</th>
                <th className="py-2 px-2 border border-slate-700 w-28 text-center">No. IC</th>
                <th className="py-2 px-2 border border-slate-700 w-28">Tingkatan / Kelas</th>
                <th className="py-2 px-2 border border-slate-700 w-20 text-center">Jantina</th>
                <th className="py-2 px-2 border border-slate-700 w-32 text-center">Tempoh Kemasukan</th>
                <th className="py-2 px-2 border border-slate-700 w-24 text-center">Yuran / Bayaran</th>
                <th className="py-2 px-2 border border-slate-700 w-24 text-center">Status</th>
                <th className="py-2 px-2 border border-slate-700 w-36">Bilik / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50 transition-colors odd:bg-white even:bg-slate-50/50"
                  >
                    <td className="py-2 px-2 text-center font-bold text-slate-700 border border-slate-200">
                      {index + 1}
                    </td>

                    <td className="py-2 px-3 font-semibold text-slate-900 border border-slate-200">
                      <div className="flex items-center justify-between gap-1">
                        <span className="uppercase">{student.namaPelajar}</span>
                        {/* Hidden on print trigger to view specific A4 */}
                        <button
                          onClick={() => onViewStudentA4(student)}
                          className="no-print text-[10px] text-blue-600 hover:underline shrink-0"
                          title="Lihat Borang A4 Pelajar Ini"
                        >
                          [Borang A4]
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-500 font-normal">
                        Penjaga: {student.namaPenjaga} ({student.noTelefonPenjaga})
                      </div>
                      {student.dokumenKesihatanUrl ? (
                        <div className="text-[8.5px] text-emerald-800 font-bold flex items-center gap-0.5 mt-0.5">
                          <span>✓ Borang Doktor Disahkan</span>
                        </div>
                      ) : (
                        <div className="text-[8px] text-amber-700 italic mt-0.5">
                          Borang Doktor: Belum Dimuat Naik
                        </div>
                      )}
                    </td>

                    <td className="py-2 px-2 font-mono text-center text-slate-800 border border-slate-200 text-[11px]">
                      {student.noKP}
                    </td>

                    <td className="py-2 px-2 text-slate-800 border border-slate-200 text-[11px]">
                      {student.tingkatanKelas}
                    </td>

                    <td className="py-2 px-2 text-center border border-slate-200 text-[11px]">
                      <span className={`font-semibold ${student.jantina === 'Lelaki' ? 'text-blue-700' : 'text-rose-700'}`}>
                        {student.jantina === 'Lelaki' ? 'Aspura' : 'Aspuri'}
                      </span>
                    </td>

                    <td className="py-2 px-2 text-center font-mono text-[10px] border border-slate-200 text-slate-700">
                      <div>{student.tarikhMasuk} - {student.tarikhKeluar}</div>
                      <div className="text-[9px] text-slate-500">({student.tempohHari} Hari)</div>
                    </td>

                    <td className="py-2 px-2 text-center font-bold text-slate-900 border border-slate-200 text-[10.5px] font-mono">
                      RM 30.00
                      <div className="text-[8.5px] font-sans text-slate-500 font-normal">Bon Asrama</div>
                    </td>

                    <td className="py-2 px-2 text-center border border-slate-200">
                      <span className={`inline-block px-1.5 py-0.5 rounded-xs text-[9.5px] font-bold uppercase tracking-tight ${
                        student.statusKelulusan === 'DILULUSKAN'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : student.statusKelulusan === 'MENUNGGU KELULUSAN'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {student.statusKelulusan === 'DILULUSKAN' ? 'LULUS' : student.statusKelulusan === 'MENUNGGU KELULUSAN' ? 'SEMAKAN' : 'DITOLAK'}
                      </span>
                    </td>

                    <td className="py-2 px-2 text-[10px] text-slate-700 border border-slate-200">
                      <div className="font-medium text-slate-900">
                        {student.bilikDormDicadangkan && !student.bilikDormDicadangkan.includes('Al-Farabi') && !student.bilikDormDicadangkan.includes('Mawar') 
                          ? student.bilikDormDicadangkan 
                          : '-'}
                      </div>
                      <div className="text-[9px] text-slate-500 truncate" title={student.sebabKemasukan}>
                        {student.sebabKemasukan}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Tiada rekod pemohon mengikut tapisan yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sign-off & Verification Section for Pengetua (Print-Ready) */}
        <div className="mt-8 pt-4 border-t-2 border-slate-800 grid grid-cols-2 gap-8 text-xs">
          
          {/* Disediakan oleh Warden */}
          <div className="flex flex-col justify-between h-32">
            <div>
              <div className="font-semibold text-slate-600 uppercase text-[10px]">
                Disediakan Oleh:
              </div>
              <div className="text-slate-800 font-bold mt-1">
                {SCHOOL_INFO.namaKetuaWarden}
              </div>
              <div className="text-[10px] text-slate-500">
                Ketua Warden / Pentadbiran Asrama Salaping
              </div>
            </div>
            
            <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-600">
              <div>Tandatangan: ________________________</div>
              <div className="mt-1">Tarikh: <strong>{currentDate}</strong></div>
            </div>
          </div>

          {/* Disahkan oleh Pengetua */}
          <div className="flex flex-col justify-between h-32 border-l border-slate-200 pl-8">
            <div>
              <div className="font-semibold text-slate-600 uppercase text-[10px]">
                Disemak & Disahkan Oleh:
              </div>
              <div className="text-slate-900 font-black mt-1">
                {SCHOOL_INFO.namaPengetua}
              </div>
              <div className="text-[10px] text-slate-500">
                Pengetua, {SCHOOL_INFO.namaSekolah}
              </div>
            </div>
            
            <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-600 flex items-end justify-between">
              <div>
                <div>Tandatangan: ________________________</div>
                <div className="mt-1">Tarikh: ________________________</div>
              </div>
              <div className="border border-dashed border-slate-300 text-[8px] text-slate-400 px-3 py-1 rounded text-center">
                Cop Rasmi Pengetua
              </div>
            </div>
          </div>

        </div>

        {/* Print Footer note */}
        <div className="mt-6 pt-2 border-t border-slate-200 flex items-center justify-between text-[8px] text-slate-400">
          <span>Dicetak secara automatik daripada Sistem e-Borang Asrama Salaping • Dokumen ini sah untuk urusan rasmi sekolah.</span>
          <span className="font-mono">Muka Surat 1/1</span>
        </div>

      </div>

      {/* Official 1-Page A4 Blank Health Examination Form Modal */}
      <BorangKesihatanA4Modal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />

    </div>
  );
};
