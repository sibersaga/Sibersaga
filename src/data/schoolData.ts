// Data Statis Resmi SD Negeri 3 Purwosari

export interface SchoolConfig {
  name: string;
  shortName: string;
  npsn: string;
  status: string;
  akreditasi: string;
  alamat: string;
  telepon: string;
  email: string;
  socials: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  gmapsEmbedUrl: string;
}

export interface Teacher {
  name: string;
  nip: string;
  role: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface Facility {
  name: string;
  description: string;
  image: string;
  gridSpan?: number;
}

export interface Activity {
  id: string;
  title: string;
  category: 'intrakurikuler' | 'kokurikuler' | 'ekstrakurikuler';
  description: string;
  schedule: string;
  image: string;
  gridSpan?: number;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Akademik' | 'Non-Akademik';
  year: string;
  winner: string;
  level: string;
  image: string;
  description: string;
  gridSpan?: number;
}

export interface News {
  id: string;
  title: string;
  date: string;
  category: 'Pengumuman' | 'Kegiatan' | 'Prestasi' | 'Opini';
  excerpt: string;
  content: string;
  image: string;
  author: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'foto' | 'video';
  category: 'Kegiatan' | 'Fasilitas' | 'Prestasi' | 'Umum';
  url: string;
  caption: string;
}

export interface Innovation {
  id: string;
  title: string;
  slug: string;
  slogan: string;
  description: string;
  benefits: string[];
  image: string;
}

export interface PublicDocument {
  id: string;
  title: string;
  category: 'Transparansi' | 'Layanan Publik' | 'Kurikulum';
  fileSize: string;
  dateUploaded: string;
  pdfUrl: string; // we will use a simulated elegant PDF/iframe viewer
  description: string;
}

export const schoolConfig: SchoolConfig = {
  name: "SD Negeri 3 Purwosari",
  shortName: "SD Negeri 3 Purwosari",
  npsn: "20311221",
  status: "Negeri",
  akreditasi: "A (Amat Baik)",
  alamat: "Purwosari, Kec. Wonogiri, Kabupaten Wonogiri, Jawa Tengah 57615",
  telepon: "(0273) 321123",
  email: "websdn3purwosari@gmail.com",
  socials: {
    facebook: "https://facebook.com/sdn3purwosari",
    instagram: "https://instagram.com/sdn3purwosari",
    youtube: "https://youtube.com/c/sdn3purwosari"
  },
  gmapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15805.021035252518!2d110.9238385!3d-7.8542171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a2e2d63ab3fff%3A0x5027a7b45a64330!2sPurwosari%2C%20Wonogiri%20Regency%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v171052601020"
};

export const profilSekolah = {
  sambutanKepala: {
    name: "Suhartono, S.Pd., M.Pd.",
    nip: "19740512 199903 1 005",
    role: "Kepala Sekolah",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400",
    text: "Assalamualaikum Warahmatullahi Wabarakatuh,\n\nSelamat datang di website resmi SD Negeri 3 Purwosari. Kehadiran portal digital ini merupakan wujud komitmen kami dalam mengedepankan keterbukaan informasi, peningkatan layanan publik, dan adaptasi teknologi informasi di lingkungan pendidikan. Melalui platform ini, kami berupaya menyajikan informasi perkembangan akademik maupun non-akademik, dokumentasi kegiatan, transparansi pengelolaan anggaran, hingga berbagai inovasi pembelajaran yang kami kembangkan seperti GEMARI (Gerakan Gemar Membaca Sejak Dini) dan DITALI RAPIA.\n\nKami berharap website ini menjadi jembatan komunikasi yang efektif antara sekolah, orang tua, siswa, alumni, serta masyarakat luas untuk bersama-sama mencetak generasi yang cerdas, berkarakter, inovatif, dan berakhlak mulia. Terima kasih atas dukungan dan kepercayaan seluruh pihak kepada SD Negeri 3 Purwosari.\n\nWassalamualaikum Warahmatullahi Wabarakatuh."
  },
  sejarah: "SD Negeri 3 Purwosari didirikan pada tahun 1982 di tengah pemukiman ramah dan asri wilayah Kecamatan Wonogiri, Kabupaten Wonogiri, Jawa Tengah. Bermula dari sebuah gedung sederhana dengan tiga ruang kelas, sekolah ini terus berkembang seiring meningkatnya kepercayaan masyarakat sekitar. Berkat dedikasi jajaran kepala sekolah, para guru yang kompeten, serta sinergi komite sekolah yang solid, SD Negeri 3 Purwosari kini telah terakreditasi 'A' dan bertransformasi menjadi salah satu sekolah dasar rujukan di Wonogiri dengan fasilitas pembelajaran digital, lingkungan adiwiyata yang asri, serta reputasi prestasi yang membanggakan.",
  visiMisi: {
    visi: "Terwujudnya Sekolah yang Unggul dalam Prestasi, Cerdas Berteknologi, Berkarakter Pancasila, Berwawasan Adiwiyata, dan Religius Menuju Sukses Wonogiri.",
    misi: [
      "Menanamkan keimanan, ketakwaan, dan budi pekerti luhur melalui pembiasaan nilai-nilai religius dalam kehidupan sekolah.",
      "Melaksanakan pembelajaran aktif, kreatif, inovatif, dan berpusat pada siswa berbasis teknologi digital (Cyber-Learning).",
      "Mengembangkan minat, bakat, dan potensi akademis maupun non-akademis peserta didik secara optimal demi meraih prestasi gemilang.",
      "Mewujudkan profil Pelajar Pancasila yang mandiri, kreatif, bernalar kritis, gotong royong, berkebinekaan global, dan bertakwa.",
      "Membudayakan literasi digital dan literasi umum melalui program inovasi sekolah yang berkelanjutan.",
      "Menciptakan lingkungan sekolah yang asri, bersih, sehat, aman, dan peduli kelestarian alam (Adiwiyata)."
    ],
    tujuan: [
      "Menghasilkan lulusan yang saleh, bertata krama luhur, berkarakter kuat, serta memiliki bekal keterampilan abad ke-21.",
      "Mencapai standar kompetensi lulusan yang unggul dan mampu bersaing di tingkat kabupaten maupun nasional.",
      "Meningkatkan mutu pembelajaran interaktif dengan mengoptimalkan sarana Chromebook dan teknologi informasi sekolah.",
      "Meraih prestasi dalam bidang keagamaan, olahraga, seni, dan akademis (KSN/FLS2N/O2SN) tingkat regional.",
      "Menumbuhkan rasa cinta lingkungan, membiasakan pemilahan sampah, pengelolaan TOGA, dan penghematan energi di sekolah.",
      "Menjalin sinergitas yang kokoh antara sekolah, orang tua, komite, dan masyarakat dalam memajukan kualitas pendidikan."
    ]
  },
  guruTendik: [
    { name: "Suhartono, S.Pd., M.Pd.", nip: "19740512 199903 1 005", role: "Kepala Sekolah", image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400" },
    { name: "Siti Rahayu, S.Pd.", nip: "19780211 200501 2 008", role: "Wali Kelas 6 / Guru Senior", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
    { name: "Budi Santoso, S.Pd.", nip: "19830819 200902 1 003", role: "Wali Kelas 5", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
    { name: "Rina Wijayanti, S.Pd.SD.", nip: "19871105 201101 2 012", role: "Wali Kelas 4", image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400" },
    { name: "Eko Prasetyo, S.Pd.", nip: "19900424 201903 1 010", role: "Guru PJOK", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" },
    { name: "Dewi Lestari, S.Pd.", nip: "19941215 202221 2 021", role: "Guru PAI & Budi Pekerti", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
    { name: "Ahmad Fauzi, A.Md.", nip: "-", role: "Staff Tata Usaha & IT Support", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" }
  ],
  fasilitas: [
    { name: "Ruang Kelas Digital", description: "Setiap kelas dilengkapi LCD Projector, kipas angin, jaringan internet Wi-Fi, dan tata letak meja-kursi yang ergonomis demi kenyamanan siswa belajar.", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800" },
    { name: "Perpustakaan 'Widya Mandala'", description: "Perpustakaan nyaman ber-AC dengan koleksi ribuan buku pelajaran, fiksi, ensiklopedia, dan pojok literasi digital yang terintegrasi dengan program GEMARI.", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800" },
    { name: "Laboratorium Komputer & Chromebook", description: "Laboratorium modern yang difasilitasi dengan puluhan unit Chromebook bantuan pemerintah serta PC berspesifikasi tinggi untuk kelancaran Asesmen Nasional Berbasis Komputer (ANBK).", image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800" },
    { name: "Lapangan Olahraga & Upacara", description: "Lapangan serbaguna luas yang bersih, teduh, digunakan untuk upacara bendera mingguan, kegiatan senam, serta latihan bola voli, basket, dan futsal.", image: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800" },
    { name: "UKS (Usaha Kesehatan Sekolah)", description: "UKS bersih dan lengkap dengan peralatan medis pertolongan pertama, obat-obatan dasar, serta pembinaan rutin oleh dokter kecil dan tenaga Puskesmas setempat.", image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" },
    { name: "Taman Adiwiyata & Green House", description: "Kawasan budidaya tanaman obat keluarga (TOGA), tanaman hidroponik, dan komposting pupuk organik untuk melatih kepedulian lingkungan peserta didik.", image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800" }
  ]
};

export const testimonialSekolah: Testimonial[] = [
  {
    id: "testi-1",
    name: "Budi Santoso",
    role: "Alumni Angkatan 2020 - Mahasiswa Teknik",
    quote: "SDN 3 Purwosari benar-benar membentuk karakter saya. Guru-gurunya sangat suportif dalam menggali potensi bakat sejak dini.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "testi-2",
    name: "Siti Rahmawati",
    role: "Alumni Angkatan 2022 - Siswa SMA",
    quote: "Pengalaman belajar di sini sangat menyenangkan, terutama saat kegiatan P5 dan kunjungan perpustakaan yang asik.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "testi-3",
    name: "Andi Wijaya",
    role: "Alumni Angkatan 2021 - Siswa SMK",
    quote: "Fasilitas digital di SDN 3 Purwosari membantu saya terbiasa dengan teknologi sejak SD. Sangat membantu di jenjang pendidikan selanjutnya.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
  }
];

export const kegiatanSekolah: Activity[] = [
  {
    id: "act-1",
    title: "Pembelajaran Interaktif Berbasis Chromebook",
    category: "intrakurikuler",
    description: "Kegiatan belajar mengajar harian di kelas memanfaatkan media digital Interaktif, Google Classroom, dan game edukatif guna meningkatkan pemahaman kognitif siswa secara menyenangkan.",
    schedule: "Senin - Kamis, Jam Pelajaran Harian",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "act-2",
    title: "Projek Penguatan Profil Pelajar Pancasila (P5)",
    category: "kokurikuler",
    description: "Pembelajaran kolaboratif lintas disiplin ilmu yang melatih siswa memecahkan masalah kontekstual di lingkungan sekitar. SDN 3 Purwosari mengangkat tema 'Gaya Hidup Berkelanjutan' melalui daur ulang limbah kertas dan plastik menjadi aneka kerajinan tangan bernilai guna.",
    schedule: "Setiap hari Jumat pagi",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "act-3",
    title: "Ekstrakurikuler Pramuka Wajib",
    category: "ekstrakurikuler",
    description: "Pembinaan kepanduan Pramuka Siaga dan Penggalang guna melatih kemandirian, kedisiplinan, kerja sama tim, cinta alam, patriotisme, serta keterampilan bertahan hidup.",
    schedule: "Hari Sabtu, Pukul 13.00 - 15.00 WIB",
    image: "https://images.unsplash.com/photo-1564149504817-d1378368526f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "act-4",
    title: "Ekstrakurikuler Seni Tari & Karawitan",
    category: "ekstrakurikuler",
    description: "Pelatihan seni tari tradisional khas Jawa Timur dan musik gamelan (karawitan) sebagai wadah melestarikan budaya bangsa sejak dini serta bekal tampil pada acara seremonial tingkat kabupaten.",
    schedule: "Hari Rabu, Pukul 14.00 - 16.00 WIB",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "act-5",
    title: "Kelompok Ilmiah Cilik & Matematika",
    category: "intrakurikuler",
    description: "Pendalaman materi sains dan matematika yang dikemas dengan eksperimen sederhana laboratorium untuk melatih cara berpikir kritis-analitis, mempersiapkan siswa menghadapi Kompetisi Sains Nasional (KSN).",
    schedule: "Hari Selasa, Pukul 13.30 - 15.00 WIB",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "act-6",
    title: "Ekstrakurikuler Keagamaan: Seni Banjari & Tartil",
    category: "ekstrakurikuler",
    description: "Pembiasaan membaca Al-Qur'an secara tartil, menghafal juz amma, serta latihan musik religi hadrah banjari untuk mempertebal keimanan sekaligus mengasah bakat seni Islami siswa.",
    schedule: "Hari Jumat, Pukul 13.00 - 14.30 WIB",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
  }
];

export const prestasiSekolah: Achievement[] = [
  {
    id: "pres-1",
    title: "Juara 1 Lomba Cerdas Cermat Sains (Kecamatan)",
    category: "Akademik",
    year: "2025",
    winner: "Tim SDN 3 Purwosari (Rian, Amanda, Nafis)",
    level: "Kecamatan",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    description: "Mengalahkan puluhan tim perwakilan sekolah dasar se-Kecamatan Purwosari dalam lomba uji wawasan IPA dan Matematika berstandar kurikulum terbaru."
  },
  {
    id: "pres-2",
    title: "Juara 2 Lomba Tari Tradisional Kreasi (Kabupaten)",
    category: "Non-Akademik",
    year: "2025",
    winner: "Grup Tari 'Widya Ayu'",
    level: "Kabupaten Pasuruan",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800",
    description: "Tampil memukau di panggung kebudayaan Pasuruan membawakan tari bertema kelestarian lingkungan lokal yang disinkronisasi dengan musik tradisional karawitan."
  },
  {
    id: "pres-3",
    title: "Medali Emas Kejuaraan Pencak Silat Anak (Karesidenan)",
    category: "Non-Akademik",
    year: "2024",
    winner: "Arya Dwipangga (Kelas 5)",
    level: "Karesidenan Malang-Pasuruan",
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800",
    description: "Menyabet medali emas di kelas tanding putra setelah melalui rangkaian laga sengit, menonjolkan stamina tangguh dan sportivitas tinggi."
  },
  {
    id: "pres-4",
    title: "Juara Harapan 1 Lomba Lukis Edukatif Adiwiyata",
    category: "Non-Akademik",
    year: "2024",
    winner: "Siti Kholifah (Kelas 6)",
    level: "Kabupaten Pasuruan",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    description: "Melukis keindahan alam berkonsep ramah lingkungan di media kanvas, menyuarakan gerakan pelestarian hutan dari ancaman deforestasi."
  },
  {
    id: "pres-5",
    title: "Peringkat 5 Nilai Rata-rata ANBK Tertinggi",
    category: "Akademik",
    year: "2024",
    winner: "SD Negeri 3 Purwosari",
    level: "Kabupaten Pasuruan",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800",
    description: "Siswa kelas 5 berhasil menunjukkan kompetensi literasi dan numerasi luar biasa di atas rata-rata nasional dalam Asesmen Nasional Berbasis Komputer."
  }
];

export const beritaSekolah: News[] = [
  {
    id: "news-1",
    title: "SDN 3 Purwosari Luncurkan Inovasi 'DITALI RAPIA' guna Tingkatkan Layanan Rapor Pendidikan",
    date: "2026-06-25",
    category: "Kegiatan",
    excerpt: "Guna mendigitalisasi kemudahan orang tua memantau capaian mutu belajar putra-putrinya, SDN 3 Purwosari meluncurkan aplikasi web internal DITALI RAPIA.",
    content: "PURWOSARI - SD Negeri 3 Purwosari kembali menelurkan inovasi berbasis teknologi informasi yang diberi nama 'DITALI RAPIA' (Digitalisasi dan Literasi Rapor Pendidikan). Program ini diresmikan langsung oleh Bapak Suhartono, S.Pd., M.Pd. selaku Kepala Sekolah bersama jajaran Komite Sekolah pada rapat paripurna wali murid hari Kamis lalu.\n\nDengan sistem ini, wali murid tidak perlu lagi bingung menganalisis capaian belajar anak yang rumit. Melalui dashboard DITALI RAPIA, orang tua bisa memperoleh rangkuman analisis rapor karakter siswa secara interaktif yang mudah dipahami di HP masing-masing. 'Kami berkomitmen menyinkronkan data kemajuan anak antara sekolah dan rumah, sehingga intervensi bimbingan belajar bisa dilakukan lebih presisi,' ungkap Suhartono.\n\nInovasi ini diharapkan mampu mendongkrak keaktifan partisipasi orang tua dalam menyukseskan program belajar anak, sekaligus mendukung kebijakan digitalisasi administrasi pendidikan nasional.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    author: "Ahmad Fauzi (IT Support)"
  },
  {
    id: "news-2",
    title: "Kemeriahan Gelar Karya P5: Daur Ulang Plastik Menjadi Hiasan Taman Indah",
    date: "2026-06-20",
    category: "Kegiatan",
    excerpt: "Siswa-siswi SDN 3 Purwosari merayakan keberhasilan pembelajaran Projek Penguatan Profil Pelajar Pancasila dengan memamerkan puluhan karya seni ramah lingkungan.",
    content: "PASURUAN - Lapangan utama SD Negeri 3 Purwosari mendadak disulap menjadi ruang pameran seni yang meriah dan penuh warna. Ratusan botol plastik bekas, sedotan, hingga kantung kresek yang dikumpulkan siswa selama tiga bulan terakhir disulap menjadi aneka hiasan taman berupa pot bunga estetik, replika lampu lampion, tirai gantung, hingga gaun busana karnaval kreatif.\n\nKegiatan Gelar Karya P5 ini dikunjungi oleh Pengawas SD Dinas Pendidikan Kabupaten Pasuruan yang mengapresiasi kreativitas orisinal siswa. Selain pameran kerajinan daur ulang, siswa kelas 1 hingga 6 juga bergantian menyajikan performa gerak tari, menyanyi lagu daerah, serta mempresentasikan cara pembuatan pupuk organik cair buatan mandiri. Ini menjadi bukti bahwa SDN 3 Purwosari berkomitmen penuh dalam menciptakan generasi yang peduli lingkungan berjiwa Pancasila.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    author: "Rina Wijayanti, S.Pd."
  },
  {
    id: "news-3",
    title: "Pendaftaran Peserta Didik Baru (PPDB/SPMB) Tahun Pelajaran 2026/2027 Resmi Dibuka",
    date: "2026-06-15",
    category: "Pengumuman",
    excerpt: "Kesempatan emas bergabung bersama sekolah unggulan berakreditasi A di Purwosari. Simak jalur pendaftaran, kuota, persyaratan lengkap, dan alur pendaftaran.",
    content: "INFORMASI RESMI - Panitia Penerimaan Peserta Didik Baru (PPDB/SPMB) SD Negeri 3 Purwosari secara resmi membuka pendaftaran online maupun offline untuk calon siswa kelas 1 SD Tahun Pelajaran 2026/2027.\n\nPada tahun ini, SDN 3 Purwosari membuka kuota sebanyak 56 siswa baru yang terbagi dalam dua rombongan belajar (rombel). Jalur pendaftaran meliputi jalur zonasi (prioritas domisili dekat sekolah), jalur afirmasi (bagi keluarga pra-sejahtera), dan jalur perpindahan tugas orang tua. Pendaftaran dapat diakses secara digital melalui portal resmi sekolah ini atau langsung mendatangi sekretariat PPDB di ruang serbaguna sekolah setiap hari kerja pukul 08.00-12.00 WIB. Pendaftaran tidak dipungut biaya sepeser pun (gratis) demi menyukseskan program wajib belajar 9 tahun.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800",
    author: "Panitia PPDB"
  },
  {
    id: "news-4",
    title: "Siswa SDN 3 Purwosari Boyong Piala Lomba Cerdas Cermat Tingkat Kecamatan",
    date: "2026-06-05",
    category: "Prestasi",
    excerpt: "Sumbangsih emas di penutup tahun ajaran, tim cerdas cermat SDN 3 Purwosari tampil cemerlang mengamankan gelar juara umum mengungguli 24 sekolah kompetitor.",
    content: "PURWOSARI - Keberhasilan luar biasa berhasil diukir oleh tim perwakilan SD Negeri 3 Purwosari dalam ajang Lomba Cerdas Cermat (LCC) Matematika dan IPA yang diselenggarakan di SDN 1 Purwosari awal bulan ini. Tim yang beranggotakan Rian, Amanda, dan Nafis (seluruhnya kelas 5) berhasil mengumpulkan total skor tertinggi di babak final interaktif dengan skor telak 1.450 poin.\n\nKepala SDN 3 Purwosari menyatakan rasa bangganya yang luar biasa atas kerja keras para guru pembimbing dan siswa. 'Prestasi ini membuktikan bahwa metode pembelajaran aktif dan penggunaan teknologi interaktif di ruang kelas digital kami terbukti mendongkrak kualitas penguasaan materi analitik para siswa kami,' ucap beliau optimis.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
    author: "Budi Santoso, S.Pd."
  }
];

export const galeriSekolah: GalleryItem[] = [
  { id: "gal-1", title: "Upacara Bendera Hari Kebangkitan Nasional", type: "foto", category: "Kegiatan", url: "https://images.unsplash.com/photo-1564149504817-d1378368526f?auto=format&fit=crop&q=80&w=800", caption: "Siswa-siswi berbaris khidmat dan tertib mengenakan seragam Merah Putih lengkap saat upacara bendera hari Senin." },
  { id: "gal-2", title: "Pembelajaran Menyenangkan dengan Chromebook", type: "foto", category: "Fasilitas", url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800", caption: "Siswa kelas 5 antusias mengerjakan kuis interaktif sains menggunakan Chromebook bantuan pemerintah." },
  { id: "gal-3", title: "Penyerahan Trophy Juara Umum LCC", type: "foto", category: "Prestasi", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800", caption: "Kepala Sekolah menyerahkan piagam penghargaan dan piala kepada tim pemenang LCC Sains Kecamatan." },
  { id: "gal-4", title: "Pojok Baca Literasi Perpustakaan 'Widya Mandala'", type: "foto", category: "Fasilitas", url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800", caption: "Ruang baca perpustakaan ber-AC dilengkapi buku referensi terlengkap, menjadi tempat favorit siswa saat istirahat." },
  { id: "gal-5", title: "Simulasi Evakuasi Gempa & Mitigasi Bencana", type: "foto", category: "Kegiatan", url: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&q=80&w=800", caption: "Kegiatan pelatihan mitigasi bencana alam gempa bumi bekerja sama dengan BPBD Kabupaten Pasuruan." },
  { id: "gal-6", title: "Aktivitas Budidaya Tanaman Hidroponik di Green House", type: "foto", category: "Umum", url: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800", caption: "Kelompok Kader Adiwiyata merawat sayuran hidroponik selada dan pakcoy di kebun praktek sekolah." }
];

export const inovasiSekolah: Innovation[] = [
  {
    id: "inov-1",
    title: "GEMARI (Gerakan Gemar Membaca Sejak Dini)",
    slug: "gemari",
    slogan: "Buku Adalah Jendela Dunia, Membaca Adalah Kuncinya",
    description: "GEMARI adalah inovasi unggulan SDN 3 Purwosari berupa ekosistem literasi harian terpadu. Setiap siswa diwajibkan membaca buku fiksi/pengetahuan pilihan di Pojok Baca kelas selama 15 menit sebelum pelajaran dimulai, disusul dengan penulisan 'Jurnal GEMARI' mingguan untuk merangkum hal-hal berharga yang telah mereka baca.",
    benefits: [
      "Meningkatkan minat baca dan kemampuan literasi pemahaman siswa di atas standar rata-rata.",
      "Melatih kreativitas menulis ringkasan dan opini kritis pada jurnal harian.",
      "Menyediakan ribuan buku bacaan bergilir ke setiap ruang kelas melalui program Kereta Literasi.",
      "Diberikannya penghargaan 'Duta Literasi Kelas' setiap akhir semester bagi siswa teraktif."
    ],
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "inov-2",
    title: "DITALI RAPIA (Digitalisasi dan Literasi Rapor Pendidikan)",
    slug: "ditali-rapia",
    slogan: "Sinergi Data Sekolah & Orang Tua Menuju Layanan Mutu Prima",
    description: "DITALI RAPIA merupakan terobosan SDN 3 Purwosari dalam menyajikan keterbukaan dan penyederhanaan data performa rapor mutu pendidikan sekolah kepada wali murid. Melalui modul web interaktif, orang tua tidak hanya melihat angka nilai murni, melainkan mendapat grafis ketercapaian kompetensi dasar siswa, catatan karakter, serta tips bimbingan belajar personal di rumah yang sinkron.",
    benefits: [
      "Memudahkan orang tua memonitor kelebihan dan kelemahan bidang pelajaran putra-putri mereka.",
      "Menyediakan panduan pendampingan belajar di rumah yang disesuaikan dengan kondisi riil siswa.",
      "Transparansi rapor mutu sekolah sehingga masyarakat bisa memantau perkembangan kualitas SDN 3 Purwosari.",
      "Membangun kedekatan emosional dan kolaborasi positif antara wali murid dan wali kelas."
    ],
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
  }
];

export const dokumenTransparansi: PublicDocument[] = [
  {
    id: "doc-1",
    title: "RKAS (Rencana Kegiatan dan Anggaran Sekolah) Tahun 2026",
    category: "Transparansi",
    fileSize: "2.4 MB",
    dateUploaded: "2026-01-10",
    pdfUrl: "RKAS_SDN3_PURWOSARI_2026.pdf",
    description: "Dokumen rincian program kerja jangka menengah dan rencana penggunaan dana Bantuan Operasional Sekolah (BOS) reguler tahun anggaran 2026."
  },
  {
    id: "doc-2",
    title: "Laporan Realisasi Penggunaan Dana BOS Triwulan 1 (2026)",
    category: "Transparansi",
    fileSize: "1.8 MB",
    dateUploaded: "2026-04-15",
    pdfUrl: "Laporan_BOS_Triwulan_1_2026.pdf",
    description: "Laporan pertanggungjawaban penyerapan dana BOS untuk operasional pembelajaran harian, pemeliharaan sarana, dan pengadaan alat peraga kelas."
  },
  {
    id: "doc-3",
    title: "Dokumen Kurikulum Satuan Pendidikan (KSP) SDN 3 Purwosari",
    category: "Kurikulum",
    fileSize: "4.1 MB",
    dateUploaded: "2025-07-20",
    pdfUrl: "KSP_SDN3_Purwosari_2526.pdf",
    description: "Panduan kurikulum merdeka belajar komprehensif yang diterapkan dalam proses belajar mengajar harian di SD Negeri 3 Purwosari."
  },
  {
    id: "doc-4",
    title: "Standar Operasional Prosedur (SOP) Layanan Pengaduan Masyarakat",
    category: "Layanan Publik",
    fileSize: "980 KB",
    dateUploaded: "2025-08-05",
    pdfUrl: "SOP_Pengaduan_Masyarakat_SDN3.pdf",
    description: "Alur resmi pengajuan saran, kritik, maupun laporan keluhan wali murid atas penyelenggaraan pendidikan di sekolah."
  }
];

export interface StudentDemographic {
  kelas: string;
  laki: number;
  perempuan: number;
  total: number;
}

export const studentDemographics: StudentDemographic[] = [
  { kelas: 'Kelas 1', laki: 12, perempuan: 14, total: 26 },
  { kelas: 'Kelas 2', laki: 15, perempuan: 12, total: 27 },
  { kelas: 'Kelas 3', laki: 14, perempuan: 15, total: 29 },
  { kelas: 'Kelas 4', laki: 11, perempuan: 13, total: 24 },
  { kelas: 'Kelas 5', laki: 13, perempuan: 14, total: 27 },
  { kelas: 'Kelas 6', laki: 16, perempuan: 15, total: 31 },
];

export const spmbConfig = {
  schedule: [
    { phase: "Pendaftaran Online & Pengambilan Formulir", date: "15 Juni - 30 Juni 2026", status: "Sedang Berlangsung" },
    { phase: "Verifikasi Berkas Persyaratan & Usia", date: "01 Juli - 03 Juli 2026", status: "Mendatang" },
    { phase: "Pengumuman Hasil Seleksi PPDB", date: "05 Juli 2026", status: "Mendatang" },
    { phase: "Daftar Ulang Siswa Baru", date: "06 Juli - 08 Juli 2026", status: "Mendatang" },
    { phase: "Hari Pertama Masuk Sekolah & MPLS", date: "13 Juli - 15 Juli 2026", status: "Mendatang" }
  ],
  requirements: [
    "Berusia paling rendah 6 (enam) tahun pada tanggal 1 Juli 2026. Prioritas utama usia 7 (tujuh) tahun ke atas.",
    "Mengisi Formulir Pendaftaran PPDB SDN 3 Purwosari (tersedia online di website atau offline di sekolah).",
    "Fotokopi Akta Kelahiran Calon Siswa (2 lembar).",
    "Fotokopi Kartu Keluarga (KK) yang mencantumkan nama calon siswa (2 lembar).",
    "Fotokopi KTP kedua Orang Tua / Wali (masing-masing 1 lembar).",
    "Surat Keterangan Lulus dari TK/RA asal (jika ada, tidak wajib)."
  ],
  steps: [
    { step: 1, title: "Registrasi Awal", desc: "Isi data identitas diri calon siswa dan orang tua di menu SPMB secara online, atau ambil formulir cetak di pos panitia sekolah." },
    { step: 2, title: "Penyiapan Berkas", desc: "Kumpulkan seluruh dokumen fotokopi akta kelahiran, KK, KTP orang tua, lalu masukkan dalam stopmap berwarna Merah untuk laki-laki dan Kuning untuk perempuan." },
    { step: 3, title: "Verifikasi Fisik", desc: "Bawa berkas fisik dan tunjukkan KK/Akta asli ke sekolah untuk pencocokan data oleh panitia pada jadwal verifikasi berkas." },
    { step: 4, title: "Pantau Hasil", desc: "Pengumuman kelulusan berkas diumumkan langsung di papan informasi sekolah dan halaman pengumuman di website ini." },
    { step: 5, title: "Daftar Ulang", desc: "Datang kembali ke sekolah untuk melakukan konfirmasi penerimaan dan melakukan fitting seragam serta pembagian orientasi siswa baru." }
  ],
  faqs: [
    { q: "Apakah pendaftaran siswa baru di SDN 3 Purwosari dipungut biaya?", a: "Sama sekali tidak. Seluruh proses seleksi dan pendaftaran di SD Negeri 3 Purwosari bebas dari segala bentuk biaya (Gratis)." },
    { q: "Bagaimana jika calon siswa belum genap berusia 6 tahun pada 1 Juli?", a: "Sesuai regulasi Kemendikbud, anak berusia minimal 5 tahun 6 bulan dapat diterima jika memiliki potensi kecerdasan istimewa atau kesiapan psikis yang dibuktikan dengan rekomendasi psikolog profesional." },
    { q: "Apakah ada tes masuk calistung (Membaca, Menulis, Berhitung) saat seleksi?", a: "Sesuai aturan resmi pemerintah, seleksi masuk Sekolah Dasar tidak diperbolehkan menggunakan tes Calistung. Seleksi didasarkan pada prioritas usia dan jarak domisili (zonasi)." },
    { q: "Apa itu program MPLS di SDN 3 Purwosari?", a: "MPLS adalah Masa Pengenalan Lingkungan Sekolah yang diadakan selama 3 hari pertama masuk sekolah dengan metode yang menyenangkan, interaktif, ramah anak, tanpa kekerasan, untuk mengenalkan siswa pada bapak/ibu guru, teman baru, dan sarana prasarana sekolah." }
  ]
};

export const quotesList = [
  { text: "Pendidikan adalah senjata paling mematikan di dunia, karena dengan itu Anda dapat mengubah dunia.", author: "Nelson Mandela" },
  { text: "Tujuan utama pendidikan bukanlah ilmu pengetahuan, melainkan tindakan nyata dan budi pekerti.", author: "Herbert Spencer" },
  { text: "Ing ngarsa sung tulada, ing madya mangun karsa, tut wuri handayani. Di depan memberi contoh, di tengah memberi semangat, di belakang memberi dorongan.", author: "Ki Hajar Dewantara" },
  { text: "Jangan pernah berhenti belajar, karena hidup tidak pernah berhenti mengajarkan.", author: "Pepatah Bijak" }
];
