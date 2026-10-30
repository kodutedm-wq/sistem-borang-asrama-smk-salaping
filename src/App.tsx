import React, { useState, useEffect } from 'react';
import { PermohonanAsrama, StatusPermohonan } from './types';
import { INITIAL_STUDENTS, DEMO_STUDENTS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { AnalyticsCards } from './components/AnalyticsCards';
import { DashboardTable } from './components/DashboardTable';
import { BorangA4Official } from './components/BorangA4Official';
import { SenaraiPengetuaPrint } from './components/SenaraiPengetuaPrint';
import { BorangPermohonanForm } from './components/BorangPermohonanForm';
import { LoginModal, AdminUser } from './components/LoginModal';
import { DataTransferModal } from './components/DataTransferModal';
import { 
  subscribeToPermohonan, 
  savePermohonanToCloud, 
  updatePermohonanStatusInCloud, 
  deletePermohonanFromCloud 
} from './firebase';
import { 
  CheckCircle2, 
  RotateCcw, 
  Trash2, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  UserCheck,
  Cloud,
  Loader2,
  RefreshCw,
  Download,
  Upload,
  AlertCircle,
  Globe
} from 'lucide-react';

const MASTER_STORAGE_KEY = 'asrama_salaping_master_v3';
const MY_SUBMISSION_KEY = 'asrama_salaping_my_submission_v2';
const ALL_STORAGE_KEYS = [
  'asrama_salaping_master_v3',
  'asrama_salaping_prod_clean_v2',
  'asrama_salaping_students_v1',
  'asrama_salaping_students',
  'permohonan_asrama',
  'asrama_students'
];

// Helper to write to ALL local keys at once so they NEVER diverge or resurrect stale/deleted data
const persistToAllStorage = (items: PermohonanAsrama[]) => {
  try {
    const json = JSON.stringify(items);
    ALL_STORAGE_KEYS.forEach(key => {
      try {
        localStorage.setItem(key, json);
      } catch (e) {}
    });
  } catch (err) {
    console.error("Storage write error:", err);
  }
};

// Helper to clear ALL local storage keys
const clearAllStorage = () => {
  ALL_STORAGE_KEYS.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  });
};

// Helper to replace any lingering demo names from earlier records
const sanitizeOfficialNames = (item: PermohonanAsrama): PermohonanAsrama => {
  let warden = item.namaWardenPenilai;
  let pengetua = item.namaPengetua;
  let dorm = item.bilikDormDicadangkan || '';
  let changed = false;

  if (!warden || warden.includes('Ahmad Fauzi') || warden.includes('Fauzi')) {
    warden = 'SYED MOHAMAD ASHRAF BIN MOKDIN (Ketua Warden Asrama Salaping)';
    changed = true;
  }

  if (!pengetua || pengetua.includes('Radzi') || pengetua.includes('Kassim')) {
    pengetua = 'SANALEH BIN DAUD';
    changed = true;
  }

  // Clear demo dorm room names so they remain empty
  if (dorm && (dorm.includes('Al-Farabi') || dorm.includes('Mawar') || dorm.includes('Sementara') || dorm.includes('Melati') || dorm.includes('Al-Ghazali') || dorm.includes('Ibnu Sina'))) {
    dorm = '';
    changed = true;
  }

  if (changed) {
    return {
      ...item,
      namaWardenPenilai: warden,
      namaPengetua: pengetua,
      bilikDormDicadangkan: dorm
    };
  }
  return item;
};

export default function App() {
  // User role: 'pemohon' (Pelajar/Pemohon - Default) vs 'pentadbir' (Warden/Pengetua)
  const [userRole, setUserRole] = useState<'pemohon' | 'pentadbir'>('pemohon');
  const [loggedInUser, setLoggedInUser] = useState<AdminUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [isDataTransferModalOpen, setIsDataTransferModalOpen] = useState(false);
  const backupInputRef = React.useRef<HTMLInputElement>(null);

  // The applicant's OWN submitted application (stored strictly for this browser/applicant)
  const [mySubmission, setMySubmission] = useState<PermohonanAsrama | null>(() => {
    try {
      const saved = localStorage.getItem(MY_SUBMISSION_KEY);
      if (saved) return sanitizeOfficialNames(JSON.parse(saved));
    } catch (e) {
      console.error("Error loading my submission:", e);
    }
    return null;
  });

  // Students state with bulletproof multi-key scan ONCE on startup, then immediately normalized
  const [students, setStudents] = useState<PermohonanAsrama[]>(() => {
    try {
      const mergedMap = new Map<string, PermohonanAsrama>();
      // 1. Scan all storage keys on initial startup
      ALL_STORAGE_KEYS.forEach(key => {
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const items = Array.isArray(parsed) ? parsed : [parsed];
            items.forEach((item: any) => {
              if (item && item.id && item.namaPelajar) {
                const cleanItem = sanitizeOfficialNames(item as PermohonanAsrama);
                if (!mergedMap.has(cleanItem.id)) {
                  mergedMap.set(cleanItem.id, cleanItem);
                }
              }
            });
          } catch (e) {}
        }
      });

      // Seed with INITIAL_STUDENTS (18 official records) so Vercel or any fresh device always has full records
      INITIAL_STUDENTS.forEach(student => {
        if (!mergedMap.has(student.id)) {
          mergedMap.set(student.id, student);
        }
      });

      const list = Array.from(mergedMap.values());
      list.sort((a, b) => (b.tarikhPermohonan || '').localeCompare(a.tarikhPermohonan || '') || b.id.localeCompare(a.id));
      // Immediately normalize all keys to this consolidated list!
      persistToAllStorage(list);
      return list;
    } catch (e) {
      console.error("Error loading stored students:", e);
    }
    persistToAllStorage(INITIAL_STUDENTS);
    return INITIAL_STUDENTS;
  });

  // Real-time Cloud Firestore synchronization (Stable, Non-Destructive, No Ghost Resurrections)
  useEffect(() => {
    setIsSyncing(true);
    const unsubscribe = subscribeToPermohonan(
      (cloudList) => {
        setIsCloudConnected(true);
        setIsSyncing(false);

        setStudents(prev => {
          const map = new Map<string, PermohonanAsrama>();

          // 1. Preserve all existing local students
          prev.forEach(s => {
            if (s && s.id && s.namaPelajar) {
              map.set(s.id, sanitizeOfficialNames(s));
            }
          });

          // 2. Merge cloud updates (e.g. approved statuses, official timestamps)
          cloudList.forEach(s => {
            if (s && s.id && s.namaPelajar) {
              const cleanCloud = sanitizeOfficialNames(s);
              const localExisting = map.get(cleanCloud.id);
              if (localExisting) {
                map.set(cleanCloud.id, { ...localExisting, ...cleanCloud });
              } else {
                map.set(cleanCloud.id, cleanCloud);
              }
            }
          });

          // 3. Any record present locally but missing in Cloud Firestore is uploaded in background
          const cloudIds = new Set(cloudList.map(c => c.id));
          map.forEach((student, id) => {
            if (!cloudIds.has(id)) {
              savePermohonanToCloud(student).catch(() => {});
            }
          });

          const consolidated = Array.from(map.values());
          consolidated.sort((a, b) => (b.tarikhPermohonan || '').localeCompare(a.tarikhPermohonan || '') || b.id.localeCompare(a.id));
          
          // Persist the consolidated list across all local keys
          persistToAllStorage(consolidated);
          return consolidated;
        });
      },
      (error) => {
        setIsSyncing(false);
        const quotaError = error?.message?.includes('Quota limit exceeded') || (error as any)?.code === 'resource-exhausted';
        if (quotaError) {
          setIsQuotaExceeded(true);
        }
        setIsCloudConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Default tab: 'form' (Borang Permohonan Baru) for applicants, 'dashboard' for admins
  const [activeTab, setActiveTab] = useState<'dashboard' | 'form' | 'borang-a4' | 'senarai-pengetua'>('form');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<PermohonanAsrama | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'Lelaki' | 'Perempuan' | 'DILULUSKAN' | 'MENUNGGU KELULUSAN'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage as reactive fallback
  useEffect(() => {
    if (students && students.length > 0) {
      persistToAllStorage(students);
    }
  }, [students]);

  // Update selectedStudentId if list changes (ONLY for Admin role to auto-select first student)
  useEffect(() => {
    if (userRole === 'pentadbir') {
      if (students.length === 0) {
        setSelectedStudentId(null);
      } else if (!selectedStudentId || !students.some(s => s.id === selectedStudentId)) {
        setSelectedStudentId(students[0].id);
      }
    }
  }, [students, selectedStudentId, userRole]);

  // Show Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Find currently selected student:
  // For 'pentadbir': allows browsing any student in the database
  // For 'pemohon': STRICTLY their own submitted application (mySubmission) or specifically searched student.
  // NEVER fallback to students[0] (which is someone else's name)!
  const selectedStudent: PermohonanAsrama | null = userRole === 'pentadbir'
    ? (students.find(s => s.id === selectedStudentId) || (students.length > 0 ? students[0] : null))
    : (mySubmission 
        ? (students.find(s => s.id === mySubmission.id) || mySubmission)
        : (selectedStudentId ? (students.find(s => s.id === selectedStudentId) || null) : null));

  // Quick Approve Student
  const handleApproveStudent = async (id: string) => {
    const updatePayload: Partial<PermohonanAsrama> = {
      statusKelulusan: 'DILULUSKAN' as StatusPermohonan,
      tarikhKeputusan: new Date().toISOString().split('T')[0],
      namaWardenPenilai: 'SYED MOHAMAD ASHRAF BIN MOKDIN (Ketua Warden Asrama Salaping)',
      catatanWarden: 'Permohonan diluluskan setelah semakan dokumen dan slot dorm disahkan.',
      namaPengetua: 'SANALEH BIN DAUD',
      tarikhPengesahanPengetua: new Date().toISOString().split('T')[0]
    };

    setStudents(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updatePayload } : s);
      persistToAllStorage(next);
      return next;
    });

    try {
      await updatePermohonanStatusInCloud(id, 'DILULUSKAN', updatePayload);
      showToast("Permohonan berjaya DILULUSKAN & disegerakkan ke pangkalan data awan!");
    } catch (e) {
      console.error("Cloud update error:", e);
      showToast("Permohonan diluluskan (mod tempatan terpelihara).");
    }
  };

  // Toggle status
  const handleToggleStatus = async (id: string, newStatus: StatusPermohonan) => {
    const updatePayload: Partial<PermohonanAsrama> = {
      statusKelulusan: newStatus,
      tarikhKeputusan: newStatus === 'DILULUSKAN' ? new Date().toISOString().split('T')[0] : '-'
    };

    setStudents(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updatePayload } : s);
      persistToAllStorage(next);
      return next;
    });

    try {
      await updatePermohonanStatusInCloud(id, newStatus, updatePayload);
      showToast(`Status permohonan dikemas kini kepada: ${newStatus}`);
    } catch (e) {
      console.error("Cloud status error:", e);
    }
  };

  // Delete student
  const handleDeleteStudent = async (id: string) => {
    const target = students.find(s => s.id === id);
    const name = target?.namaPelajar || 'permohonan';

    if (confirm(`Adakah anda pasti ingin memadamkan permohonan ${name}?`)) {
      setStudents(prev => {
        const next = prev.filter(s => s.id !== id);
        persistToAllStorage(next);
        return next;
      });

      try {
        await deletePermohonanFromCloud(id);
        showToast("Rekod permohonan telah dipadam.");
      } catch (e) {
        showToast("Rekod permohonan telah dipadam.");
      }
    }
  };

  // Save new or updated student
  const handleSaveStudent = async (savedStudent: PermohonanAsrama) => {
    const cleanStudent = sanitizeOfficialNames(savedStudent);

    // 1. Immediately store to this applicant's dedicated session & localStorage
    setMySubmission(cleanStudent);
    try {
      localStorage.setItem(MY_SUBMISSION_KEY, JSON.stringify(cleanStudent));
    } catch (e) {
      console.error(e);
    }

    // 2. Set active student and tab
    setSelectedStudentId(cleanStudent.id);
    setEditingStudent(null);
    setActiveTab('borang-a4');

    // 3. UI update and immediate persistence to all storage keys
    setStudents(prev => {
      const exists = prev.some(s => s.id === cleanStudent.id);
      const next = exists
        ? prev.map(s => s.id === cleanStudent.id ? cleanStudent : s)
        : [cleanStudent, ...prev];
      persistToAllStorage(next);
      return next;
    });

    // 4. Save to Cloud Firestore
    try {
      await savePermohonanToCloud(cleanStudent);
      showToast(`✓ Permohonan untuk ${cleanStudent.namaPelajar} berjaya didaftarkan ke Pangkalan Data Sekolah!`);
    } catch (err) {
      console.error("Cloud save error:", err);
      showToast(`✓ Borang permohonan untuk ${cleanStudent.namaPelajar} disimpan selamat di peranti ini.`);
    }
  };

  // Empty all data handler
  const handleClearAll = async () => {
    if (confirm("Adakah anda pasti ingin mengosongkan semua data pemohon?")) {
      const toDelete = [...students];
      setStudents([]);
      setSelectedStudentId(null);
      clearAllStorage();

      try {
        await Promise.all(toDelete.map(s => deletePermohonanFromCloud(s.id)));
        showToast("Semua data pangkalan data telah dikosongkan.");
      } catch (e) {
        console.error("Clear error:", e);
        showToast("Data tempatan telah dikosongkan.");
      }
    }
  };

  // Load demo test data (optional testing tool)
  const handleLoadDemo = async () => {
    if (confirm("Adakah anda ingin memuatkan data contoh demo untuk tujuan ujian sistem?")) {
      setStudents(DEMO_STUDENTS);
      persistToAllStorage(DEMO_STUDENTS);
      setSelectedStudentId(DEMO_STUDENTS[0].id);
      try {
        await Promise.all(DEMO_STUDENTS.map(s => savePermohonanToCloud(s)));
        showToast("Data contoh demo telah dimuatkan & dihantar ke pangkalan data.");
      } catch (e) {
        console.error(e);
        showToast("Data contoh demo telah dimuatkan.");
      }
    }
  };

  // Export all students as a JSON backup file
  const handleExportBackup = () => {
    if (students.length === 0) {
      alert("Tiada rekod data untuk dieksport.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `asrama_salaping_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Salinan sandaran fail JSON berjaya dimuat turun!");
  };

  // Import students from a JSON backup file
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported: PermohonanAsrama[] = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0) {
          const cleaned = imported.map(s => sanitizeOfficialNames(s));
          setStudents(cleaned);
          persistToAllStorage(cleaned);
          // Sync each imported record to cloud if possible
          cleaned.forEach(item => savePermohonanToCloud(item).catch(() => {}));
          showToast(`Berjaya memulihkan ${cleaned.length} rekod pemohon daripada fail sandaran!`);
        } else {
          alert("Format fail tidak mengandungi senarai pemohon yang sah.");
        }
      } catch (err) {
        alert("Fail tidak sah. Sila pastikan anda memilih fail sandaran JSON yang betul.");
      }
      if (backupInputRef.current) {
        backupInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Next reference number generator
  const nextRef = `AS/2026/KKS-${String(students.length + 1).padStart(3, '0')}`;

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col text-slate-900">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewApplication={() => {
          setEditingStudent(null);
          setActiveTab('form');
        }}
        selectedStudentName={selectedStudent?.namaPelajar}
        totalStudents={students.length}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={() => {
          setUserRole('pemohon');
          setLoggedInUser(null);
          setActiveTab('form');
          showToast("Log keluar berjaya. Anda kini berada di Portal Pemohon.");
        }}
        loggedInUser={loggedInUser}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Real-time Cloud Firestore Status Banner */}
        <div className="no-print mb-6 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isCloudConnected 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200 ring-2 ring-emerald-400/20' 
                : isQuotaExceeded
                ? 'bg-amber-50 text-amber-600 border-amber-200 ring-2 ring-amber-400/20'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm">
                  Pangkalan Data SMK Salaping
                </span>
                {isCloudConnected ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-100 text-emerald-800 border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    Cloud Firestore (Online)
                  </span>
                ) : isQuotaExceeded ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-100 text-amber-900 border-amber-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    Mod Simpanan Tempatan Aktif (Had Kuota Percuma Google)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-100 text-slate-700 border-slate-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    Mod Simpanan Pelayar (Luar Talian)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isQuotaExceeded 
                  ? 'Aplikasi berjalan lancar dalam mod simpanan peranti setempat kerana had bacaan percuma Google Cloud harian telah dicapai. Semua data borang tetap selamat, boleh diisi, dicetak dan disimpan.'
                  : 'Setiap borang yang diisi oleh pelajar disimpan secara berpusat dan boleh disemak serta dicetak serta-merta.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <div className="bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-slate-500 uppercase block font-medium">Jumlah Pemohon Pusat</span>
              <strong className="text-base font-black text-slate-900 font-mono">
                {students.length} orang
              </strong>
            </div>

            {/* Direct Pindah Data ke Vercel / Netlify button */}
            <button
              onClick={() => setIsDataTransferModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Salin atau Pindahkan Data Pemohon ke Vercel atau Netlify"
            >
              <Globe className="w-4 h-4 text-amber-300" />
              <span>Pindah Data (Vercel / Netlify)</span>
            </button>

            {userRole === 'pemohon' ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Papan Warden ({students.length})</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3.5 py-2 font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'dashboard' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                }`}
              >
                <span>Lihat Senarai Pemohon ({students.length})</span>
              </button>
            )}
          </div>
        </div>
        
        {/* VIEW 1: DASHBOARD & AUTOMATED ANALYTICS (PENTADBIR ONLY) */}
        {activeTab === 'dashboard' && userRole === 'pentadbir' && (
          <div className="space-y-6">
            <AnalyticsCards
              students={students}
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              onJanaSenaraiPengetua={() => setActiveTab('senarai-pengetua')}
            />

            <DashboardTable
              students={students}
              activeFilter={activeFilter}
              onViewA4={(student) => {
                setSelectedStudentId(student.id);
                setActiveTab('borang-a4');
              }}
              onEditStudent={(student) => {
                setEditingStudent(student);
                setActiveTab('form');
              }}
              onDeleteStudent={handleDeleteStudent}
              onToggleStatus={handleToggleStatus}
              onJanaSenaraiPengetua={() => setActiveTab('senarai-pengetua')}
              onNewApplication={() => {
                setEditingStudent(null);
                setActiveTab('form');
              }}
              onImportBackup={() => backupInputRef.current?.click()}
              onOpenDataTransfer={() => setIsDataTransferModalOpen(true)}
              onSelectFilter={setActiveFilter}
            />

            {/* Bottom Admin Helper: State management & Data Backup */}
            <div className="no-print flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 gap-3">
              <span>Sistem Pengurusan e-Borang Asrama Salaping • Panel Pentadbiran Sesi 2026</span>
              
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Export Backup JSON */}
                <button
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  title="Muat turun salinan sandaran semua data pelajar ke dalam fail JSON"
                >
                  <Download className="w-3.5 h-3.5 text-sky-600" />
                  <span>Backup Data (JSON)</span>
                </button>

                {/* Import Backup JSON */}
                <button
                  onClick={() => backupInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                  title="Pulihkan data daripada fail sandaran JSON"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pulihkan Backup</span>
                </button>
                <input
                  type="file"
                  ref={backupInputRef}
                  onChange={handleImportBackup}
                  accept=".json,application/json"
                  className="hidden"
                />

                {students.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1 px-3 py-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                    title="Kosongkan Semua Data"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Kosongkan Data</span>
                  </button>
                )}
                
                {students.length === 0 && (
                  <button
                    onClick={handleLoadDemo}
                    className="flex items-center gap-1 px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                    title="Muat Data Contoh Demo untuk Pengujian"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Muat Data Demo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FORM REGISTRATION / EDIT (FOR BOTH PEMOHON & PENTADBIR) */}
        {activeTab === 'form' && (
          <div className="space-y-6">
            {/* Soft Pastel Welcome Banner for Applicants */}
            {userRole === 'pemohon' && (
              <div className="bg-gradient-to-r from-sky-50/80 via-white to-amber-50/40 border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100/70 border border-sky-200 px-2.5 py-0.5 rounded-full">
                      Portal Kemasukan Pelajar 2026
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight mt-1.5">
                    Selamat Datang ke Sistem e-Asrama SMK Salaping
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl font-medium">
                    Permohonan kemasukan khas sementara adalah percuma. Hanya bayaran <strong className="text-amber-900">BON asrama sebanyak RM30</strong> (cagaran) dikutip di kaunter pendaftaran semasa hari pendaftaran masuk pelajar.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs shrink-0">
                  <div className="bg-white/95 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-center shadow-2xs">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">1. Isi Borang</div>
                    <div className="text-xs font-bold text-sky-800">Percuma</div>
                  </div>
                  <div className="text-slate-300 font-bold">→</div>
                  <div className="bg-white/95 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-center shadow-2xs">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">2. Jana Dokumen</div>
                    <div className="text-xs font-bold text-emerald-800">Format A4</div>
                  </div>
                  <div className="text-slate-300 font-bold">→</div>
                  <div className="bg-white/95 border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-center shadow-2xs">
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">3. Hari Masuk</div>
                    <div className="text-xs font-bold font-mono text-amber-900">Bon RM30</div>
                  </div>
                </div>
              </div>
            )}

            <BorangPermohonanForm
              key={editingStudent?.id || 'fresh-form'}
              initialData={editingStudent}
              onSave={handleSaveStudent}
              onCancel={() => {
                setEditingStudent(null);
                setActiveTab(userRole === 'pentadbir' ? 'dashboard' : 'borang-a4');
              }}
              nextReferenceNumber={nextRef}
              userRole={userRole}
            />
          </div>
        )}

        {/* VIEW 3: OFFICIAL 1-PAGE A4 FORM (PRINT-READY PDF FOR PEMOHON & PENTADBIR) */}
        {activeTab === 'borang-a4' && (
          <BorangA4Official
            student={selectedStudent}
            onApproveStudent={handleApproveStudent}
            allStudents={students}
            onSwitchStudent={(s) => setSelectedStudentId(s.id)}
            onSelectAnotherStudent={() => setActiveTab(userRole === 'pentadbir' ? 'dashboard' : 'form')}
            onNewApplication={() => {
              setEditingStudent(null);
              setActiveTab('form');
            }}
            userRole={userRole}
          />
        )}

        {/* VIEW 4: AUTOMATED PRINCIPAL LIST (PENTADBIR ONLY) */}
        {activeTab === 'senarai-pengetua' && userRole === 'pentadbir' && (
          <SenaraiPengetuaPrint
            students={students}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onViewStudentA4={(s) => {
              setSelectedStudentId(s.id);
              setActiveTab('borang-a4');
            }}
          />
        )}

      </main>

      {/* Subtle Footer Switcher for Quick Access */}
      <footer className="no-print py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Hak Cipta Terpelihara © 2026 SMK Salaping • Asrama Harian</span>
          
          <div className="flex items-center gap-3 text-[11px]">
            {userRole === 'pemohon' ? (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Log Masuk Warden & Pengetua</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setUserRole('pemohon');
                  setLoggedInUser(null);
                  setActiveTab('form');
                  showToast("Log keluar berjaya. Anda kini berada di Portal Pemohon.");
                }}
                className="text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Kembali ke Portal Pemohon (Pelajar)</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      {/* Official Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setUserRole('pentadbir');
          setLoggedInUser(user);
          setActiveTab('dashboard');
          showToast(`Log masuk berjaya sebagai ${user.role === 'warden' ? 'Warden' : 'Pengetua'}!`);
        }}
      />

      {/* Netlify Data Transfer & Sync Modal */}
      <DataTransferModal
        isOpen={isDataTransferModalOpen}
        onClose={() => setIsDataTransferModalOpen(false)}
        students={students}
        onImportStudents={(imported) => {
          const cleaned = imported.map(s => sanitizeOfficialNames(s));
          setStudents(cleaned);
          persistToAllStorage(cleaned);
          cleaned.forEach(s => savePermohonanToCloud(s).catch(() => {}));
          showToast(`✓ Berjaya memasukkan ${cleaned.length} rekod pemohon ke dalam sistem!`);
        }}
      />

    </div>
  );
}
