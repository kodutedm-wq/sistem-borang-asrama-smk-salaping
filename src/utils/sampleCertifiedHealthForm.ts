/**
 * Sample Doctor-Certified Health Form SVG Data URI
 * Provides a high-fidelity scan representation of a doctor-certified and stamped
 * Borang Pemeriksaan Kesihatan SMK Salaping for demo / instant testing.
 */
export const SAMPLE_DOCTOR_CERTIFIED_FORM = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1130" width="100%" height="100%" style="background:#ffffff; font-family: Arial, sans-serif;">
  <!-- Paper Background with subtle texture -->
  <rect width="800" height="1130" fill="#fcfbf7" stroke="#e2e8f0" stroke-width="2"/>
  
  <!-- Institutional Header -->
  <g transform="translate(40, 40)">
    <rect width="720" height="90" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    <text x="360" y="28" text-anchor="middle" font-size="12" font-weight="bold" fill="#334155" letter-spacing="1">KEMENTERIAN PENDIDIKAN MALAYSIA • JABATAN PENDIDIKAN NEGERI SELANGOR</text>
    <text x="360" y="50" text-anchor="middle" font-size="16" font-weight="900" fill="#0f172a">SEKOLAH MENENGAH KEBANGSAAN SALAPING</text>
    <text x="360" y="68" text-anchor="middle" font-size="13" font-weight="bold" fill="#0369a1">PENGURUSAN ASRAMA SALAPING (ASRAMA HARIAN)</text>
    <text x="360" y="82" text-anchor="middle" font-size="10" fill="#64748b">Jalan Asrama Perdana, 43000 Kajang, Selangor Darul Ehsan</text>
  </g>

  <!-- Title Banner -->
  <g transform="translate(40, 140)">
    <rect width="720" height="35" fill="#0f172a"/>
    <text x="360" y="23" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff" letter-spacing="1">BORANG LAPORAN PEMERIKSAAN KESIHATAN &amp; PENGESAHAN DOKTOR</text>
  </g>

  <!-- Section 1: Maklumat Pelajar -->
  <g transform="translate(40, 185)">
    <rect width="720" height="24" fill="#334155"/>
    <text x="15" y="16" font-size="11" font-weight="bold" fill="#ffffff">BAHAGIAN 1: MAKLUMAT PEMOHON</text>
    
    <rect y="24" width="720" height="70" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    <text x="15" y="48" font-size="11" fill="#475569">Nama Pelajar:</text>
    <text x="130" y="48" font-size="13" font-weight="bold" fill="#0f172a">MUHAMMAD DANIAL BIN ARIFFIN</text>
    
    <text x="450" y="48" font-size="11" fill="#475569">No. K/P:</text>
    <text x="510" y="48" font-size="12" font-weight="bold" font-family="monospace" fill="#0f172a">090514-10-5431</text>

    <text x="15" y="75" font-size="11" fill="#475569">Tingkatan/Kelas:</text>
    <text x="130" y="75" font-size="12" font-weight="bold" fill="#0f172a">Tingkatan 4 Sains 1</text>

    <text x="350" y="75" font-size="11" fill="#475569">Penjaga:</text>
    <text x="410" y="75" font-size="12" fill="#0f172a">Ariffin bin Mohd Yusof (012-3456789)</text>
  </g>

  <!-- Section 2: Rekod Kesihatan -->
  <g transform="translate(40, 290)">
    <rect width="720" height="24" fill="#334155"/>
    <text x="15" y="16" font-size="11" font-weight="bold" fill="#ffffff">BAHAGIAN 2: REKOD &amp; SEJARAH KESIHATAN</text>
    
    <rect y="24" width="720" height="110" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    
    <!-- Ticks & checklist -->
    <text x="20" y="55" font-size="11" fill="#1e293b">1. Penyakit Lelah / Asma Kronik: [ ] Ya  [✓] Tidak</text>
    <text x="380" y="55" font-size="11" fill="#1e293b">5. Masalah Buah Pinggang: [ ] Ya  [✓] Tidak</text>

    <text x="20" y="80" font-size="11" fill="#1e293b">2. Penyakit Jantung / Tekanan Darah: [ ] Ya  [✓] Tidak</text>
    <text x="380" y="80" font-size="11" fill="#1e293b">6. Penyakit Kulit Berjangkit: [ ] Ya  [✓] Tidak</text>

    <text x="20" y="105" font-size="11" fill="#1e293b">3. Sawan / Gangguan Saraf: [ ] Ya  [✓] Tidak</text>
    <text x="380" y="105" font-size="11" fill="#1e293b">7. Sejarah Pembedahan Utama: [ ] Ya  [✓] Tidak</text>

    <!-- Doctor's pen handwriting note -->
    <path d="M 220 120 Q 250 115 320 122" stroke="#1d4ed8" stroke-width="1.5" fill="none"/>
    <text x="20" y="125" font-size="10" fill="#64748b">Catatan Alahan:</text>
    <text x="110" y="125" font-size="11" font-style="italic" fill="#1e3a8a">Tiada rekod alahan kronik. Pesakit dalam keadaan sihat fizikal.</text>
  </g>

  <!-- Section 3: Pemeriksaan Fizikal -->
  <g transform="translate(40, 435)">
    <rect width="720" height="24" fill="#334155"/>
    <text x="15" y="16" font-size="11" font-weight="bold" fill="#ffffff">BAHAGIAN 3: PEMERIKSAAN FIZIKAL &amp; KLINIKAL DOKTOR</text>
    
    <rect y="24" width="720" height="120" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    
    <text x="20" y="55" font-size="11" fill="#334155">Tinggi: <tspan font-weight="bold" fill="#0f172a">168 cm</tspan></text>
    <text x="180" y="55" font-size="11" fill="#334155">Berat: <tspan font-weight="bold" fill="#0f172a">58 kg</tspan></text>
    <text x="340" y="55" font-size="11" fill="#334155">BMI: <tspan font-weight="bold" fill="#0f172a">20.5 (Normal)</tspan></text>
    <text x="520" y="55" font-size="11" fill="#334155">Tekanan Darah: <tspan font-weight="bold" fill="#0f172a">118/76 mmHg</tspan></text>

    <text x="20" y="90" font-size="11" fill="#334155">Kadar Nadi: <tspan font-weight="bold" fill="#0f172a">74 bpm (Normal)</tspan></text>
    <text x="240" y="90" font-size="11" fill="#334155">Penglihatan: <tspan font-weight="bold" fill="#0f172a">Kanan: 6/6  Kiri: 6/6</tspan></text>

    <text x="20" y="125" font-size="11" fill="#334155">Kardiovaskular: <tspan font-weight="bold" fill="#047857">[✓] Normal</tspan></text>
    <text x="240" y="125" font-size="11" fill="#334155">Respiratori/Paru-Paru: <tspan font-weight="bold" fill="#047857">[✓] Normal</tspan></text>
    <text x="480" y="125" font-size="11" fill="#334155">Abdomen: <tspan font-weight="bold" fill="#047857">[✓] Normal</tspan></text>
  </g>

  <!-- Section 4: Perakuan Doktor & Cop Rasmi (Highlight) -->
  <g transform="translate(40, 590)">
    <rect width="720" height="24" fill="#0f172a"/>
    <text x="15" y="16" font-size="11" font-weight="bold" fill="#38bdf8">BAHAGIAN 4: PERAKUAN KELAYAKAN BERASRAMA OLEH PEGAWAI PERUBATAN</text>
    
    <rect y="24" width="720" height="260" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>

    <text x="20" y="55" font-size="12" font-weight="bold" fill="#0f172a">KEPUTUSAN PEMERIKSAAN KELAYAKAN:</text>
    
    <!-- Big Certified Checkbox -->
    <rect x="20" y="70" width="680" height="42" fill="#ecfdf5" stroke="#059669" stroke-width="1.5" rx="6"/>
    <circle cx="45" cy="91" r="12" fill="#059669"/>
    <path d="M 39 91 L 43 95 L 51 86" stroke="#ffffff" stroke-width="2.5" fill="none"/>
    <text x="68" y="96" font-size="13" font-weight="bold" fill="#065f46">(A) DISAHKAN SIHAT &amp; LAYAK BERASRAMA PENUH SESI 2026</text>

    <!-- Sign and Official Medical Clinic Stamp -->
    <g transform="translate(40, 130)">
      <!-- Signature line -->
      <text x="0" y="20" font-size="10" font-weight="bold" fill="#475569">TANDATANGAN PEGAWAI PERUBATAN:</text>
      <!-- Simulated pen signature -->
      <path d="M 20 55 C 50 25, 70 80, 110 35 C 130 50, 160 30, 180 50 C 190 40, 220 50, 240 45" stroke="#1e3a8a" stroke-width="2.5" fill="none"/>
      
      <text x="0" y="80" font-size="11" font-weight="bold" fill="#0f172a">DR. ZULKIFLI BIN ABDUL RAHMAN</text>
      <text x="0" y="96" font-size="10" fill="#475569">Pegawai Perubatan (MMC No: 48921)</text>
      <text x="0" y="112" font-size="10" fill="#475569">Tarikh: 28 September 2026</text>
    </g>

    <!-- OFFICIAL STAMP (Realistic Red/Blue Medical Stamp) -->
    <g transform="translate(440, 130) rotate(-4)">
      <!-- Outer Oval -->
      <ellipse cx="120" cy="55" rx="115" ry="50" fill="none" stroke="#dc2626" stroke-width="3" opacity="0.85"/>
      <ellipse cx="120" cy="55" rx="108" ry="44" fill="none" stroke="#dc2626" stroke-width="1.2" opacity="0.85"/>
      
      <!-- Stamp Text -->
      <text x="120" y="32" text-anchor="middle" font-size="10" font-weight="900" fill="#dc2626" letter-spacing="1">KLINIK KESIHATAN KAJANG</text>
      <text x="120" y="48" text-anchor="middle" font-size="11" font-weight="bold" fill="#dc2626">DISAHKAN SIHAT</text>
      <text x="120" y="62" text-anchor="middle" font-size="9" font-weight="bold" fill="#dc2626">DR. ZULKIFLI (MMC 48921)</text>
      <text x="120" y="76" text-anchor="middle" font-size="8" fill="#dc2626">28 SEP 2026 • KEMENTERIAN KESIHATAN</text>
      <text x="120" y="90" text-anchor="middle" font-size="7.5" fill="#dc2626">43000 KAJANG, SELANGOR</text>
    </g>
  </g>

  <!-- Watermark Badge -->
  <g transform="translate(620, 890)">
    <rect width="140" height="70" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5" rx="8"/>
    <text x="70" y="28" text-anchor="middle" font-size="10" font-weight="bold" fill="#15803d">STATUS DOKUMEN</text>
    <text x="70" y="48" text-anchor="middle" font-size="11" font-weight="900" fill="#166534">DISAHKAN LENGKAP</text>
  </g>

  <!-- Security Verification Footer -->
  <g transform="translate(40, 980)">
    <line x1="0" y1="0" x2="720" y2="0" stroke="#0f172a" stroke-width="1.5"/>
    <text x="0" y="20" font-size="9" fill="#64748b">SMK Salaping e-Asrama • Dokumen Laporan Kesihatan Rasmi Disahkan Doktor • No. Siri Kesihatan: KES-2026-0928-8831</text>
    <text x="0" y="34" font-size="8.5" fill="#94a3b8">Borang ini sah untuk kegunaan pendaftaran kemasukan asrama harian sesi persekolahan 2026.</text>
  </g>
</svg>
`)}`;
