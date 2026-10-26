import { PermohonanAsrama } from '../types';
import salapingLogoUrl from '../assets/images/smk_salaping_logo.svg';
import studentMalePhoto from '../assets/images/student_sample_photo_1790991039757.jpg';
import studentFemalePhoto from '../assets/images/student_female_sample_1790991051930.jpg';
import { SAMPLE_DOCTOR_CERTIFIED_FORM } from '../utils/sampleCertifiedHealthForm';

// Default: KOSONG untuk sedia diguna pakai oleh pihak sekolah
export const INITIAL_STUDENTS: PermohonanAsrama[] = [];

// Data Contoh Demo (Boleh dimuat semula bila-bila masa jika ingin diuji)
export const DEMO_STUDENTS: PermohonanAsrama[] = [
  {
    id: 'kks-2026-001',
    noRujukan: 'AS/2026/KKS-001',
    tarikhPermohonan: '2026-09-28',
    namaPelajar: 'MUHAMMAD DANIAL BIN ARIFFIN',
    noKP: '090514-10-5431',
    jantina: 'Lelaki',
    tingkatanKelas: 'Tingkatan 4 Sains 1',
    namaSekolah: 'SMK Salaping Perdana',
    namaPenjaga: 'Ariffin bin Mohd Yusof',
    noTelefonPenjaga: '012-3456789',
    hubunganPenjaga: 'Bapa',
    alamatRumah: 'No. 24, Jalan Salaping Murni 3, Taman Desa Salaping, 43000 Kajang, Selangor',
    fotoUrl: studentMalePhoto,
    fotoType: 'passport',
    
    // Laporan Kesihatan
    statusKesihatan: 'Sihat & Layak Asrama',
    namaDoktorKlinik: 'Dr. Zulkifli Rahman (Klinik Kesihatan Kajang)',
    tarikhPemeriksaan: '2026-09-28',
    rekodAlahanPenyakit: 'Tiada rekod penyakit kronik atau alahan makanan',
    catatanKesihatan: 'Telah disahkan sihat fizikal & mental untuk aktiviti asrama',
    dokumenKesihatanUrl: SAMPLE_DOCTOR_CERTIFIED_FORM,
    tarikhUploadKesihatan: '2026-09-28',
    
    // Yuran & Bon
    bayaranBon: 30.00,
    kadarHarian: 0,
    tempohHari: 14,
    yuranMakan: 0,
    yuranPenginapan: 0,
    jumlahYuran: 30.00,
    statusBayaran: 'Percuma / Kutipan di Kaunter',
    noResit: '-',
    kaedahBayaran: 'Kaunter Pendaftaran Masuk Asrama',

    // Butiran Kemasukan
    tarikhMasuk: '2026-10-05',
    tarikhKeluar: '2026-10-19',
    sebabKemasukan: 'Menghadiri Kem Intensif Kecemerlangan SPM & Ibu Bapa Bertugas Luar Stesen',
    bilikDormDicadangkan: 'Dorm Al-Farabi 02 (Blok Aspura)',
    catatanKemasukan: 'Pelajar berdisiplin tinggi, wakil debat sekolah',

    // Kelulusan
    statusKelulusan: 'DILULUSKAN',
    tarikhKeputusan: '2026-09-30',
    namaWardenPenilai: 'Ustaz Ahmad Fauzi (Ketua Warden Asrama Salaping)',
    catatanWarden: 'Permohonan lengkap, dokumen perubatan disahkan. Diluluskan penempatan sementara di Dorm Al-Farabi 02.',
    namaPengetua: 'Tn. Haji Mohd Radzi bin Kassim',
    tarikhPengesahanPengetua: '2026-10-01'
  },
  {
    id: 'kks-2026-002',
    noRujukan: 'AS/2026/KKS-002',
    tarikhPermohonan: '2026-09-29',
    namaPelajar: 'NUR AMIRA BINTI KAMARULZAMAN',
    noKP: '090822-10-6724',
    jantina: 'Perempuan',
    tingkatanKelas: 'Tingkatan 4 Sastera Dinamik',
    namaSekolah: 'SMK Salaping Perdana',
    namaPenjaga: 'Kamarulzaman bin Othman',
    noTelefonPenjaga: '013-8877665',
    hubunganPenjaga: 'Bapa',
    alamatRumah: 'No. 11, Lorong Seri Damai 4, Seksyen 7, Bandar Salaping, Selangor',
    fotoUrl: studentFemalePhoto,
    fotoType: 'swafoto',
    
    // Laporan Kesihatan
    statusKesihatan: 'Ada Alahan / Rawatan Khas',
    namaDoktorKlinik: 'Dr. Noraini binti Sulaiman (Klinik Famili Salaping)',
    tarikhPemeriksaan: '2026-09-27',
    rekodAlahanPenyakit: 'Alahan kekacang ringan (mild peanut allergy). Bawa ubat antihistamin.',
    catatanKesihatan: 'Dewan makan asrama perlu dimaklumkan berkenaan diet bebas kacang.',
    
    // Yuran & Bon
    bayaranBon: 30.00,
    kadarHarian: 0,
    tempohHari: 10,
    yuranMakan: 0,
    yuranPenginapan: 0,
    jumlahYuran: 30.00,
    statusBayaran: 'Percuma / Kutipan di Kaunter',
    noResit: '-',
    kaedahBayaran: 'Kaunter Pendaftaran Masuk Asrama',

    // Butiran Kemasukan
    tarikhMasuk: '2026-10-06',
    tarikhKeluar: '2026-10-16',
    sebabKemasukan: 'Latihan Pusat Pertandingan Robotik Peringkat Negeri & Rumah Sedang Dibaikpulih',
    bilikDormDicadangkan: 'Dorm Mawar Putih 04 (Blok Aspuri)',
    catatanKemasukan: 'Perlu kebenaran keluar latihan pada petang Rabu',

    // Kelulusan
    statusKelulusan: 'DILULUSKAN',
    tarikhKeputusan: '2026-09-30',
    namaWardenPenilai: 'Cikgu Siti Hajar binti Daud (Warden Aspuri)',
    catatanWarden: 'Borang & perakuan ibu bapa lengkap. Catatan alahan telah direkodkan dalam fail dewan makan.',
    namaPengetua: 'Tn. Haji Mohd Radzi bin Kassim',
    tarikhPengesahanPengetua: '2026-10-01'
  }
];

export const SCHOOL_INFO = {
  namaKementerian: 'KEMENTERIAN PENDIDIKAN MALAYSIA',
  namaJabatan: 'JABATAN PENDIDIKAN NEGERI SELANGOR',
  namaSekolah: 'SEKOLAH MENENGAH KEBANGSAAN SALAPING',
  namaAsrama: 'PENGURUSAN ASRAMA SALAPING (ASRAMA HARIAN)',
  alamat: 'Jalan Asrama Perdana, 43000 Kajang, Selangor Darul Ehsan',
  noTelefon: '03-8733 4590 / 03-8733 4591',
  emel: 'asrama.salaping@moe.edu.my',
  portal: 'www.smksalaping.edu.my',
  logoUrl: salapingLogoUrl,
  namaPengetua: 'TN. HAJI MOHD RADZI BIN KASSIM',
  namaKetuaWarden: 'USTAZ AHMAD FAUZI BIN HAMID',
  namaWardenAspuri: 'CIKGU SITI HAJAR BINTI DAUD',
  namaPenyeliaAsrama: 'EN. WAN AZLAN BIN WAN EMBONG'
};
