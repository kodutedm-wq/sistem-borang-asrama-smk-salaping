export type Jantina = 'Lelaki' | 'Perempuan'; // Aspura / Aspuri

export type StatusPermohonan = 'DILULUSKAN' | 'MENUNGGU KELULUSAN' | 'TIDAK DILULUSKAN';

export type StatusBayaran = 'Percuma / Kutipan di Kaunter' | 'Telah Selesai' | 'Belum Selesai (Bayar Semasa Pendaftaran)' | 'Pengecualian Khas';

export type StatusKesihatan = 'Sihat & Layak Asrama' | 'Memerlukan Pemantauan' | 'Ada Alahan / Rawatan Khas';

export interface PermohonanAsrama {
  id: string;
  noRujukan: string;
  tarikhPermohonan: string;
  
  // A. Maklumat Pelajar
  namaPelajar: string;
  noKP: string;
  jantina: Jantina; // Lelaki = Aspura, Perempuan = Aspuri
  tingkatanKelas: string;
  namaSekolah: string;
  namaPenjaga: string;
  noTelefonPenjaga: string;
  hubunganPenjaga: string;
  alamatRumah: string;
  fotoUrl: string;
  fotoType: 'passport' | 'swafoto';

  // Laporan Kesihatan Doktor (Reorganized in structured section)
  statusKesihatan: StatusKesihatan;
  namaDoktorKlinik: string;
  tarikhPemeriksaan: string;
  rekodAlahanPenyakit: string;
  catatanKesihatan: string;
  dokumenKesihatanUrl?: string; // Gambar/imbasan borang laporan kesihatan disahkan doktor
  tarikhUploadKesihatan?: string;

  // Ringkasan Yuran & Bon Asrama (Reorganized in structured section)
  bayaranBon?: number; // Bayaran BON asrama RM30
  kadarHarian: number; // e.g. RM 8.00 / hari
  tempohHari: number;
  yuranMakan: number;
  yuranPenginapan: number;
  jumlahYuran: number; // RM 30.00 (Bon)
  statusBayaran: StatusBayaran;
  noResit: string;
  kaedahBayaran: string;

  // B. Butiran Kemasukan Sementara
  tarikhMasuk: string;
  tarikhKeluar: string;
  sebabKemasukan: string;
  bilikDormDicadangkan: string;
  catatanKemasukan: string;

  // C. Perakuan & Keputusan Warden/Asrama
  statusKelulusan: StatusPermohonan;
  tarikhKeputusan: string;
  namaWardenPenilai: string;
  catatanWarden: string;
  copRasmiUrl?: string;
  namaPengetua?: string;
  tarikhPengesahanPengetua?: string;
}

export interface StatistikAsrama {
  totalPemohon: number;
  totalAspura: number;
  totalAspuri: number;
  totalDiluluskan: number;
  totalMenunggu: number;
  totalDitolak: number;
  totalKutipanYuran: number;
}
