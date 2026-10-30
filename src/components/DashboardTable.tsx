import React, { useState } from 'react';
import { PermohonanAsrama } from '../types';
import { DokumenKesihatanViewerModal } from './DokumenKesihatanViewerModal';
import { 
  Search, 
  FileText, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Printer, 
  UserCheck, 
  Lock,
  ArrowRight,
  Stethoscope,
  Eye,
  Globe
} from 'lucide-react';

interface DashboardTableProps {
  students: PermohonanAsrama[];
  activeFilter: string;
  onViewA4: (student: PermohonanAsrama) => void;
  onEditStudent: (student: PermohonanAsrama) => void;
  onDeleteStudent: (id: string) => void;
  onToggleStatus: (id: string, newStatus: any) => void;
  onJanaSenaraiPengetua: () => void;
  onNewApplication?: () => void;
  onImportBackup?: () => void;
  onOpenDataTransfer?: () => void;
  onSelectFilter?: (filter: any) => void;
}

export const DashboardTable: React.FC<DashboardTableProps> = ({
  students,
  activeFilter,
  onViewA4,
  onEditStudent,
  onDeleteStudent,
  onToggleStatus,
  onJanaSenaraiPengetua,
  onNewApplication,
  onImportBackup,
  onOpenDataTransfer,
  onSelectFilter
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHealthDocStudent, setSelectedHealthDocStudent] = useState<PermohonanAsrama | null>(null);

  // Filtering
  const filteredStudents = students.filter(student => {
    // Category Filter
    if (activeFilter === 'Lelaki' && student.jantina !== 'Lelaki') return false;
    if (activeFilter === 'Perempuan' && student.jantina !== 'Perempuan') return false;
    if (activeFilter === 'DILULUSKAN' && student.statusKelulusan !== 'DILULUSKAN') return false;
    if (activeFilter === 'MENUNGGU KELULUSAN' && student.statusKelulusan !== 'MENUNGGU KELULUSAN') return false;

    // Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        student.namaPelajar.toLowerCase().includes(q) ||
        student.noKP.toLowerCase().includes(q) ||
        student.noRujukan.toLowerCase().includes(q) ||
        student.tingkatanKelas.toLowerCase().includes(q) ||
        student.namaPenjaga.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      
      {/* Table Action Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/70 to-indigo-50/20">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari mengikut nama, no. IC, no. rujukan atau kelas..."
            className="w-full bg-white border border-slate-300/80 rounded-xl pl-10 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-2xs transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          {activeFilter !== 'all' ? (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-950 px-3 py-1 rounded-xl text-xs font-semibold">
              <span>Tapisan aktif: <strong className="uppercase text-amber-900">{activeFilter}</strong> ({filteredStudents.length} daripada {students.length} rekod)</span>
              {onSelectFilter && (
                <button
                  onClick={() => onSelectFilter('all')}
                  className="ml-1 text-slate-900 underline font-black hover:text-rose-700 cursor-pointer text-[11px]"
                >
                  Batal Tapisan / Tunjuk Semua ({students.length})
                </button>
              )}
            </div>
          ) : (
            <span>Menunjukkan <strong className="text-slate-900 font-bold">{filteredStudents.length}</strong> daripada {students.length} rekod</span>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-slate-100">
          <thead className="bg-slate-50/90 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Maklumat Pemohon</th>
              <th className="py-3.5 px-3">Kategori & Tingkatan</th>
              <th className="py-3.5 px-3">Tempoh Kemasukan</th>
              <th className="py-3.5 px-3">Kesihatan & Bon</th>
              <th className="py-3.5 px-3 text-center">Status Kelulusan</th>
              <th className="py-3.5 px-4 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => {
                const isApproved = student.statusKelulusan === 'DILULUSKAN';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Student Info with Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                          {student.fotoUrl ? (
                            <img 
                              src={student.fotoUrl} 
                              alt={student.namaPelajar} 
                              className="w-full h-full object-cover object-top"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">FOTO</span>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 uppercase leading-snug tracking-tight">
                            {student.namaPelajar}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                            <span>{student.noKP}</span>
                            <span>·</span>
                            <span className="text-slate-400 font-sans">{student.noRujukan}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Penjaga: <span className="font-semibold text-slate-700">{student.namaPenjaga}</span> ({student.noTelefonPenjaga})
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Class */}
                    <td className="py-3 px-3">
                      <div>
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          student.jantina === 'Lelaki' 
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200/80'
                        }`}>
                          {student.jantina === 'Lelaki' ? 'Aspura' : 'Aspuri'}
                        </span>
                        <div className="font-bold text-slate-800 text-[11px] mt-1.5">
                          {student.tingkatanKelas}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px] font-medium">
                          {student.bilikDormDicadangkan && !student.bilikDormDicadangkan.includes('Al-Farabi') && !student.bilikDormDicadangkan.includes('Mawar') ? student.bilikDormDicadangkan : <span className="text-slate-400 italic">Belum ditetapkan</span>}
                        </div>
                      </div>
                    </td>

                    {/* Entry Period */}
                    <td className="py-3 px-3">
                      <div className="font-mono text-slate-800 text-[11px] font-medium">
                        <div>{student.tarikhMasuk}</div>
                        <div className="text-slate-400 text-[10px]">hingga {student.tarikhKeluar}</div>
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600 mt-0.5">
                        {student.tempohHari} Hari Kemasukan
                      </div>
                    </td>

                    {/* Health & Fee */}
                    <td className="py-3 px-3">
                      <div className="text-[11px] font-bold text-amber-900 bg-amber-50/90 border border-amber-200/80 px-2.5 py-0.5 rounded-lg inline-block font-mono shadow-2xs">
                        Bon: RM 30.00
                      </div>
                      <div className="text-[10px] text-slate-600 mt-1 truncate max-w-[150px] font-medium" title={student.statusKesihatan}>
                        {student.statusKesihatan}
                      </div>
                      <div className="mt-1">
                        {student.dokumenKesihatanUrl ? (
                          <button
                            onClick={() => setSelectedHealthDocStudent(student)}
                            className="inline-flex items-center gap-1 text-[9.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                            title="Klik untuk melihat imbasan borang pengesahan doktor"
                          >
                            <Stethoscope className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Borang Doktor [✓]</span>
                          </button>
                        ) : (
                          <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded inline-block">
                            Borang Doktor: Tiada
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Approval */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs ${
                          isApproved 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/80' 
                            : student.statusKelulusan === 'MENUNGGU KELULUSAN'
                            ? 'bg-amber-50 text-amber-800 border border-amber-300/80'
                            : 'bg-rose-50 text-rose-800 border border-rose-300/80'
                        }`}>
                          {isApproved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Diluluskan
                            </>
                          ) : student.statusKelulusan === 'MENUNGGU KELULUSAN' ? (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Menunggu
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Ditolak
                            </>
                          )}
                        </span>

                        {/* Toggle Quick Status */}
                        <button
                          onClick={() => onToggleStatus(student.id, isApproved ? 'MENUNGGU KELULUSAN' : 'DILULUSKAN')}
                          className="mt-1 text-[9px] text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
                        >
                          {isApproved ? 'Tukar ke Semakan' : 'Luluskan Sekarang'}
                        </button>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Borang A4 View & Print */}
                        <button
                          onClick={() => onViewA4(student)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isApproved
                              ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-2xs hover:shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={isApproved ? "Cetak Borang Rasmi A4" : "Borang Dikunci (Menunggu Kelulusan)"}
                        >
                          {isApproved ? (
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>Borang A4</span>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer border border-slate-200/60"
                          title="Kemas Kini Maklumat"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (confirm(`Adakah anda pasti ingin memadam rekod ${student.namaPelajar}?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg transition-colors cursor-pointer border border-rose-200/60"
                          title="Padam Permohonan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-2xs">
                      {searchTerm ? (
                        <Search className="w-6 h-6 text-slate-400" />
                      ) : (
                        <UserCheck className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {searchTerm 
                        ? 'Tiada pemohon ditemui untuk kriteria carian ini.' 
                        : 'Belum Ada Permohonan Didaftarkan.'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 mb-3">
                      {searchTerm 
                        ? 'Sila cuba carian menggunakan kata kunci lain.' 
                        : 'Sistem sedia digunakan. Sila daftar pemohon baru untuk memulakan rekod kemasukan sementara asrama.'}
                    </p>
                    {!searchTerm && (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {onOpenDataTransfer && (
                          <button
                            onClick={onOpenDataTransfer}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <Globe className="w-4 h-4 text-amber-300" />
                            <span>Pindah / Masukkan Data (Vercel / Netlify)</span>
                          </button>
                        )}
                        {onNewApplication && (
                          <button
                            onClick={onNewApplication}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                          >
                            + Daftar Pemohon Sekarang
                          </button>
                        )}
                        {onImportBackup && (
                          <button
                            onClick={onImportBackup}
                            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                          >
                            Pulihkan Fail Backup (JSON)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div>
          * Perhatian: Mengikut syarat sekolah, cetakan Borang A4 boleh dilakukan selepas status permohonan berstatus <strong>DILULUSKAN</strong>.
        </div>
        <button
          onClick={onJanaSenaraiPengetua}
          className="text-slate-900 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>Lihat & Cetak Senarai Pengetua</span>
          <ArrowRight className="w-3 h-3 text-slate-700" />
        </button>
      </div>

      {/* Health Document Viewer Modal for Warden / Admin */}
      {selectedHealthDocStudent && selectedHealthDocStudent.dokumenKesihatanUrl && (
        <DokumenKesihatanViewerModal
          isOpen={!!selectedHealthDocStudent}
          onClose={() => setSelectedHealthDocStudent(null)}
          imageUrl={selectedHealthDocStudent.dokumenKesihatanUrl}
          studentName={selectedHealthDocStudent.namaPelajar}
          doctorName={selectedHealthDocStudent.namaDoktorKlinik}
          tarikhPemeriksaan={selectedHealthDocStudent.tarikhPemeriksaan}
        />
      )}

    </div>
  );
};
