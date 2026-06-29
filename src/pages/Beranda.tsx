import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { EditableText } from '../components/EditableText';
import { 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Calendar, 
  ArrowRight, 
  Lightbulb, 
  ShieldCheck, 
  GraduationCap, 
  ArrowUpRight, 
  Sparkles, 
  Trophy, 
  Globe,
  Users,
  BookOpen,
  Cpu,
  Clock,
  Activity,
  Quote,
  Bell,
  Megaphone,
  MapPin,
  Play,
  Pause,
  Info,
  Building
} from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { quotesList, spmbConfig } from '../data/schoolData';
import { useAdmin } from '../context/AdminContext';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { ScrollReveal } from '../components/ScrollReveal';
import { StudentDemographics } from '../components/StudentDemographics';

const upcomingEvents = [
  {
    id: "event-1",
    title: "Pendaftaran Online PPDB 2026/2027",
    date: "15 Juni - 30 Juni 2026",
    time: "08:00 - 12:00 WIB",
    location: "Sistem Online & Sekretariat PPDB",
    category: "PPDB",
    description: "Masa pendaftaran calon siswa baru tahun pelajaran 2026/2027. Pengisian formulir online dan penyerahan berkas fisik.",
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "event-2",
    title: "Masa Pengenalan Lingkungan Sekolah (MPLS)",
    date: "13 Juli - 15 Juli 2026",
    time: "07:00 - 11:00 WIB",
    location: "Lingkungan Sekolah SD Negeri 3 Purwosari",
    category: "Akademik",
    description: "Masa pengenalan guru, staf, sarana prasarana, serta tata tertib sekolah bagi seluruh siswa baru kelas 1 secara ramah anak.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "event-3",
    title: "Verifikasi Berkas Fisik Calon Siswa Baru",
    date: "01 Juli - 03 Juli 2026",
    time: "08:00 - 13:00 WIB",
    location: "Ruang Kelas Digital SD Negeri 3 Purwosari",
    category: "PPDB",
    description: "Pemeriksaan dan pencocokan berkas asli akta kelahiran, kartu keluarga, dan KTP orang tua oleh panitia penerimaan siswa.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "event-4",
    title: "Rapat Koordinasi Komite Sekolah & Wali Murid",
    date: "18 Juli 2026",
    time: "09:00 WIB - Selesai",
    location: "Aula Multi-Fungsi SD Negeri 3 Purwosari",
    category: "Rapat",
    description: "Diskusi sinkronisasi program literasi harian GEMARI dan peluncuran laporan transparansi dana BOS tahun ajaran baru.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800"
  }
];

const importantAnnouncements = [
  {
    id: "ann-1",
    title: "Pengumuman Hasil Seleksi Kelulusan PPDB",
    date: "05 Juli 2026",
    importance: "Tinggi",
    target: "Calon Wali Murid Baru",
    content: "Daftar nama siswa baru yang dinyatakan lolos berkas PPDB TP 2026/2027 dapat diunduh di menu SPMB atau dilihat langsung di papan pengumuman sekolah mulai jam 08:00 WIB.",
    tag: "INFO PPDB"
  },
  {
    id: "ann-2",
    title: "Jadwal Pengambilan Buku Paket & Kelengkapan Belajar",
    date: "10 Juli - 11 Juli 2026",
    importance: "Sedang",
    target: "Siswa Kelas 1 - 6",
    content: "Diberitahukan kepada wali murid bahwa pengambilan buku paket kurikulum merdeka dan atribut sekolah dapat dilakukan di Koperasi Widya Mandala sesuai jadwal shift kelas.",
    tag: "AKADEMIK"
  },
  {
    id: "ann-3",
    title: "Pembiasaan Jurnal GEMARI & Pojok Baca Kelas",
    date: "13 Juli 2026",
    importance: "Rendah",
    target: "Seluruh Siswa",
    content: "Mengawali tahun ajaran baru, setiap siswa diharapkan menyiapkan satu buku catatan khusus untuk Jurnal GEMARI (Gerakan Gemar Membaca Sejak Dini) yang dikumpulkan tiap Jumat.",
    tag: "LITERASI"
  }
];

interface BerandaProps {
  onPageChange: (pageId: string) => void;
  onSelectNews: (newsId: string) => void;
}

export const Beranda: React.FC<BerandaProps> = ({ onPageChange, onSelectNews }) => {
  const { schoolConfig, beritaSekolah, prestasiSekolah, profilSekolah, isEditMode, testimonialSekolah, statistikSekolah, agendaSekolah, studentDemographics } = useAdmin();
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1400",
      title: "Selamat Datang di SDN 3 Purwosari",
      subtitle: "Membentuk Generasi Cerdas Literasi, Berkarakter Luhur, dan Unggul dalam Prestasi.",
      ctaText: "Profil Sekolah",
      page: "profil",
      tag: "PENDIDIKAN BERKARAKTER"
    },
    {
      image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1400",
      title: "PPDB Online Tahun Pelajaran 2026/2027",
      subtitle: "Mari Bergabung Bersama Kami! Kuota Terbatas untuk Tahun Pelajaran Baru.",
      ctaText: "Daftar SPMB Sekarang",
      page: "spmb",
      tag: "PENDAFTARAN SISWA BARU"
    },
    {
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1400",
      title: "Inovasi Pendidikan Digital 'DITALI RAPIA'",
      subtitle: "Sinergi Layanan Rapor Mutu Interaktif Demi Masa Depan Anak Tercinta.",
      ctaText: "Pelajari Inovasi",
      page: "inovasi",
      tag: "INOVASI UNGGULAN"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

  // Dynamic Quote State
  const [quoteIndex, setQuoteIndex] = useState(0);
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotesList.length);
    }, 10000);
    return () => clearInterval(quoteTimer);
  }, []);

  // News, Event, & Announcement Carousel/Slider State
  const [activeCarouselTab, setActiveCarouselTab] = useState<'berita' | 'event' | 'pengumuman'>('berita');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  const dynamicEvents = agendaSekolah.map(item => ({
    id: item.id,
    title: item.title,
    date: item.date,
    time: "08:00 WIB - Selesai",
    location: "SD Negeri 3 Purwosari",
    category: item.status === 'Sedang Berlangsung' ? "UTAMA" : "AGENDA",
    description: `Agenda kegiatan "${item.title}" dijadwalkan pada tanggal ${item.date} dengan status ${item.status}.`,
    image: item.status === 'Sedang Berlangsung'
      ? "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"
      : "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800"
  }));

  const dynamicAnnouncements = beritaSekolah.filter(n => n.category === 'Pengumuman');
  const announcementsList = dynamicAnnouncements.length > 0 
    ? dynamicAnnouncements.map(n => ({
        id: n.id,
        title: n.title,
        date: n.date,
        importance: 'Tinggi',
        target: 'Semua Warga Sekolah',
        content: n.content || n.excerpt,
        tag: 'PENGUMUMAN'
      }))
    : importantAnnouncements;

  const currentItems = activeCarouselTab === 'berita' 
    ? beritaSekolah 
    : activeCarouselTab === 'event' 
      ? dynamicEvents 
      : announcementsList;

  const translatePercent = -(carouselIndex * (100 / visibleCount));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCarouselIndex(0);
  }, [activeCarouselTab]);

  useEffect(() => {
    if (!isAutoPlay || currentItems.length <= visibleCount) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex > currentItems.length - visibleCount) {
          return 0;
        }
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, currentItems.length, visibleCount]);

  const handlePrevCarousel = () => {
    setIsAutoPlay(false);
    setCarouselIndex((prev) => {
      if (prev === 0) {
        return Math.max(0, currentItems.length - visibleCount);
      }
      return prev - 1;
    });
  };

  const handleNextCarousel = () => {
    setIsAutoPlay(false);
    setCarouselIndex((prev) => {
      if (prev >= currentItems.length - visibleCount) {
        return 0;
      }
      return prev + 1;
    });
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-12" id="beranda-page">
      
      {/* ROW 1: PRESTISIUS CINEMATIC HERO SLIDESHOW (Sky Blue, Orange & White Premium Theme) */}
      <section className="w-full animate-slideUp" id="hero-exclusive-section">
        <div 
          className="w-full bg-sky-900 rounded-[2.5rem] overflow-hidden relative shadow-2xl border-4 border-white flex flex-col justify-end h-[calc(100vh-140px)] min-h-[580px] md:min-h-[640px]" 
          id="hero-block"
        >
          {/* Background Images with Cross-Fade style transitions */}
          <div className="absolute inset-0 z-0">
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover scale-102 filter brightness-[0.45]"
                />
              </div>
            ))}
          </div>

          {/* Premium Modern Overlays with Sky Blue accents */}
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-full lg:w-[70%] bg-gradient-to-r from-sky-950/80 via-sky-950/40 to-transparent z-10 pointer-events-none" />
          
          {/* Animated Ambient Glowing Elements (Sky Blue & Orange) */}
          <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none z-10" />

          {/* Foreground Responsive Layout */}
          <div className="relative z-20 w-full h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16 text-white">
            
            {/* Top Area: Badges and Quick Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="px-4 py-2 bg-orange-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg border-2 border-white inline-block">
                  {schoolConfig.shortName}
                </span>
                <span className="px-3 py-2 bg-white/10 backdrop-blur-md text-sky-200 font-extrabold text-[10px] uppercase tracking-wider rounded-xl border border-white/10 inline-flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                  SISTEM SIBER AKTIF
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-xs font-mono text-sky-100 font-semibold">
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                <span>ONLINE PORTAL</span>
                <span className="text-white/20">|</span>
                <span>TP 2026/2027</span>
              </div>
            </div>

            {/* Middle Area: Slide-Specific High-Contrast Content */}
            <div className="max-w-3xl space-y-6 my-auto pt-10 text-left">
              <div className="space-y-4 animate-slideRight">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/25 border border-orange-400/30 rounded-full text-[11px] font-black text-orange-300 uppercase tracking-widest font-mono">
                  <Sparkles size={12} className="text-orange-400 animate-spin" />
                  {slides[currentSlide].tag}
                </div>
                
                <h1 className="text-3.5xl sm:text-5xl lg:text-6.5xl font-extrabold tracking-tight leading-[1.1] font-display text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {slides[currentSlide].title.split(" '")[0]} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-white to-orange-400 font-black drop-shadow-[0_2px_10px_rgba(14,165,233,0.3)]">
                    {slides[currentSlide].title.includes("'") ? `'${slides[currentSlide].title.split("'")[1]}'` : "Pendidikan Cerdas"}
                  </span>
                </h1>
                
                <p className="text-sm sm:text-base lg:text-lg text-sky-100 font-medium leading-relaxed max-w-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

              {/* Action Buttons with Ultimate Visibility */}
              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => onPageChange(slides[currentSlide].page)}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-3xl font-extrabold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-orange-600 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)] cursor-pointer text-xs uppercase tracking-wider border-2 border-white/50"
                >
                  <span>{slides[currentSlide].ctaText}</span>
                  <ArrowRight size={14} className="stroke-[3] transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
                <button
                  onClick={() => onPageChange('inovasi')}
                  className="group inline-flex items-center gap-2 px-6 py-4 bg-white/10 text-white font-extrabold rounded-3xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.2)] cursor-pointer text-xs border border-white/20 hover:border-orange-400/40"
                >
                  <span>Layanan 'DITALI RAPIA'</span>
                  <Award size={14} className="text-orange-400 transition-transform duration-300 group-hover:scale-110" />
                </button>
              </div>
            </div>

            {/* Bottom Area: Controls & Indicators */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-6 text-left">
                <div>
                  <span className="block text-[10px] font-mono uppercase text-sky-300 tracking-wider font-extrabold">Kurikulum Resmi</span>
                  <span className="font-bold text-white text-sm">Merdeka & Literasi Dini</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10" />
                <div className="hidden sm:block">
                  <span className="block text-[10px] font-mono uppercase text-sky-300 tracking-wider font-extrabold">Sertifikasi & Status</span>
                  <span className="font-bold text-orange-400 flex items-center gap-1.5 text-sm">
                    <ShieldCheck size={14} className="stroke-[2.5]" /> Akreditasi A Amat Baik
                  </span>
                </div>
              </div>

              {/* Slider Dots & Navigation Buttons */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <button 
                    onClick={prevSlide}
                    className="p-1 hover:text-orange-400 text-white transition-colors cursor-pointer"
                    aria-label="Slide Sebelumnya"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex gap-1 mx-2">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          idx === currentSlide ? 'bg-orange-500 w-5' : 'bg-white/40 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={nextSlide}
                    className="p-1 hover:text-orange-400 text-white transition-colors cursor-pointer"
                    aria-label="Slide Berikutnya"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ROW 2: INSPIRATIONAL QUOTE STRIP (Sky Blue, Orange & White Theme) */}
      <section className="max-w-7xl mx-auto" id="quote-section">
        <ScrollReveal duration={800} threshold={0.1}>
          <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 border-2 border-sky-100 rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="p-3.5 bg-orange-500/10 text-orange-600 rounded-2xl shrink-0 border border-orange-400/20">
              <Lightbulb size={24} className="animate-pulse" />
            </div>
            <div className="flex-grow text-center md:text-left min-w-0">
              <p className="text-sm sm:text-base font-extrabold text-sky-950 italic leading-relaxed">
                &ldquo;{quotesList[quoteIndex].text}&rdquo;
              </p>
              <p className="text-xs text-orange-600 font-black mt-1.5 uppercase tracking-widest font-mono">
                &mdash; {quotesList[quoteIndex].author}
              </p>
            </div>
            <button 
              onClick={() => setQuoteIndex((quoteIndex + 1) % quotesList.length)}
              className="text-xs font-bold text-sky-600 hover:text-orange-600 cursor-pointer shrink-0 transition-colors uppercase tracking-widest font-mono border border-sky-100 bg-white px-4 py-2 rounded-xl hover:shadow-sm"
            >
              Berikutnya &rsaquo;
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ROW 3: IDENTITAS RESMI SEKOLAH (Sky Blue, Orange & White Theme) */}
      <section className="space-y-6" id="official-identity-section">
        <ScrollReveal duration={600} threshold={0.05}>
          <SectionTitle 
            title="Profil & Akreditasi Resmi" 
            subtitle="Selayang pandang sejarah berdirinya sekolah serta status kelayakan rujukan mutu kemendikbudristek."
          />
        </ScrollReveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Profile Card (spans 8 cols) */}
          <div className="lg:col-span-8 flex">
            <ScrollReveal duration={800} delay={100} threshold={0.05} className="w-full flex">
              <div 
                className="bg-gradient-to-br from-sky-900 to-sky-950 text-white rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-xl border-4 border-white w-full" 
                id="bento-profile-card"
              >
                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/70 to-sky-900/40 z-10" />
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <img 
                  src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800"
                  alt="Siswa Belajar"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 z-0"
                />

                {/* Top Area */}
                <div className="relative z-20 space-y-3">
                  <span className="text-[10px] bg-orange-500 text-white font-black px-4 py-1.5 rounded-full uppercase tracking-widest inline-block shadow-md border border-white/20">
                    Sejak Tahun 1982
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight font-display text-white">
                    Dedikasi Pendidikan Terbaik di Wonogiri
                  </h3>
                </div>

                {/* Bottom Area with Visi Highlight & Sejarah */}
                <div className="relative z-20 space-y-6 pt-8">
                  <div className="bg-white/10 border border-white/10 backdrop-blur-md p-5 rounded-2xl space-y-2">
                    <p className="text-[11px] text-orange-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={12} className="text-orange-400" />
                      <span>Visi Utama Sekolah</span>
                    </p>
                    <p className="text-xs sm:text-sm text-white font-bold italic leading-relaxed">
                      &ldquo;{profilSekolah.visiMisi.visi}&rdquo;
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-sky-100 leading-relaxed font-medium line-clamp-3">
                    {profilSekolah.sejarah.substring(0, 240)}... Kami mengedepankan program pembelajaran terpadu untuk membentuk karakter yang cerdas, mandiri, serta peduli lingkungan.
                  </p>

                  <div>
                    <button
                      onClick={() => onPageChange('profil')}
                      className="group inline-flex items-center gap-1.5 px-6 py-3 bg-white/10 text-orange-400 font-black rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.1)] cursor-pointer text-xs uppercase tracking-wider border border-white/20"
                    >
                      <span>Selidiki Profil Selengkapnya</span>
                      <ArrowRight size={14} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1.5" />
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Accreditation Card (spans 4 cols) - Ultra Modern White, Sky Blue & Orange Layout */}
          <div className="lg:col-span-4 flex">
            <ScrollReveal duration={800} delay={250} threshold={0.05} className="w-full flex">
              <div 
                className="bg-white text-sky-950 rounded-[2.5rem] p-8 shadow-xl border-4 border-sky-100 flex flex-col justify-between relative overflow-hidden min-h-[380px] w-full" 
                id="akreditasi-card"
              >
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-6 -top-6 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[10px] bg-sky-50 text-sky-700 font-black px-3.5 py-1.5 rounded-xl border border-sky-100 uppercase tracking-widest">
                    KEMENDIKBUDRISTEK
                  </span>
                  <Award className="text-orange-500 shrink-0 stroke-[2.5]" size={26} />
                </div>

                <div className="space-y-1.5 my-6 relative z-10">
                  <h4 className="text-[10px] text-sky-700 uppercase tracking-widest font-black font-mono">
                    Status Kelayakan
                  </h4>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-sky-950 tracking-tight leading-none font-display flex items-center gap-2">
                    Akreditasi <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent font-black text-4xl sm:text-5xl">A</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-900 leading-normal font-semibold mt-2">
                    Sertifikasi kelayakan tertinggi penyelenggara pendidikan dasar rujukan nasional dengan penilaian Amat Baik.
                  </p>
                </div>

                <div className="pt-6 border-t-2 border-sky-100 flex flex-col gap-2.5 text-xs font-mono text-sky-900 font-bold relative z-10">
                  <div className="flex justify-between">
                    <span>NPSN</span>
                    <span className="text-sky-950 font-black">{schoolConfig.npsn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-sky-950 font-black">{schoolConfig.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bentuk</span>
                    <span className="text-sky-950 font-black">Sekolah Dasar (SD)</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ROW 3.5: AGENDA & KEGIATAN MENDATANG (Exclusive Academic Calendar & Events Context) */}
      <section className="space-y-6" id="upcoming-agenda-section">
        <ScrollReveal duration={600} threshold={0.05}>
          <SectionTitle 
            title="Agenda & Kegiatan Mendatang" 
            subtitle="Pantau siklus administrasi, agenda akademis, serta jadwal terdekat di lingkungan SD Negeri 3 Purwosari."
          />
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="agenda-cards-grid">
          {spmbConfig.schedule.slice(0, 3).map((item, idx) => (
            <ScrollReveal key={idx} duration={800} delay={idx * 100} threshold={0.05} className="flex">
              <div 
                className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between w-full relative overflow-hidden group"
                id={`agenda-card-${idx}`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="p-2.5 bg-primary-500/10 text-primary-600 rounded-2xl border border-primary-500/20">
                      <Calendar size={18} />
                    </span>
                    <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono ${
                      item.status === 'Sedang Berlangsung' 
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 animate-pulse' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Jadwal Kegiatan
                    </h4>
                    <h3 className="text-base font-black text-slate-800 leading-snug font-display group-hover:text-primary-600 transition-colors">
                      {item.phase}
                    </h3>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-600 font-mono">
                    {item.date}
                  </span>
                  <button 
                    onClick={() => onPageChange('spmb')}
                    className="text-[10px] font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                  >
                    Detail SPMB <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ROW 4: STATISTIK & DATA MUTU REAL-TIME (Sky Blue, Orange & White Theme) */}
      <section className="space-y-6" id="live-statistics-section">
        <ScrollReveal duration={600} threshold={0.05}>
          <SectionTitle 
            title="Angka & Statistik Kebanggaan Kami" 
            subtitle="Representasi kuantitatif dari sarana pendukung, siswa aktif, tenaga pendidik, serta iklim harian membaca literasi."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10" id="achievements-counters-grid">
          
          {/* Card 1: Siswa */}
          <ScrollReveal duration={600} delay={100} threshold={0.05} className="flex">
            <div className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 text-center flex flex-col items-center justify-between hover:border-orange-400 hover:shadow-xl transition-all duration-300 shadow-md w-full">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border-2 border-sky-100 mb-4">
                <Users size={26} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-sky-950 tracking-tight font-display">
                  <AnimatedCounter targetValue={studentDemographics.reduce((acc, curr) => acc + curr.total, 0)} suffix="+" />
                </p>
                <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mt-2">
                  Siswa Aktif
                </h4>
                <p className="text-xs text-sky-900 font-bold mt-1">Terbina dalam kegiatan intrakurikuler & ekskul.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Guru */}
          <ScrollReveal duration={600} delay={200} threshold={0.05} className="flex">
            <div className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 text-center flex flex-col items-center justify-between hover:border-orange-400 hover:shadow-xl transition-all duration-300 shadow-md w-full">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border-2 border-orange-100 mb-4">
                <GraduationCap size={26} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-sky-950 tracking-tight font-display">
                  <AnimatedCounter targetValue={profilSekolah?.guruTendik?.length || 0} suffix="" />
                </p>
                <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mt-2">
                  Pendidik & Staff
                </h4>
                <p className="text-xs text-sky-900 font-bold mt-1">Tenaga profesional bersertifikasi kompetensi pendidik.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Penghargaan */}
          <ScrollReveal duration={600} delay={300} threshold={0.05} className="flex">
            <div className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 text-center flex flex-col items-center justify-between hover:border-orange-400 hover:shadow-xl transition-all duration-300 shadow-md w-full">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border-2 border-sky-100 mb-4">
                <Trophy size={26} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-sky-950 tracking-tight font-display">
                  <AnimatedCounter targetValue={prestasiSekolah?.length || 0} suffix="+" />
                </p>
                <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mt-2">
                  Penghargaan & Juara
                </h4>
                <p className="text-xs text-sky-900 font-bold mt-1">Prestasi tingkat kecamatan, kabupaten, hingga provinsi.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Fasilitas Ruang Kelas */}
          <ScrollReveal duration={600} delay={400} threshold={0.05} className="flex">
            <div className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 text-center flex flex-col items-center justify-between hover:border-orange-400 hover:shadow-xl transition-all duration-300 shadow-md w-full">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border-2 border-orange-100 mb-4">
                <Building size={26} className="stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <p className="text-4xl font-black text-sky-950 tracking-tight font-display">
                  <AnimatedCounter targetValue={studentDemographics.length || 0} suffix="" />
                </p>
                <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mt-2">
                  Ruang Kelas
                </h4>
                <p className="text-xs text-sky-900 font-bold mt-1">Fasilitas kelas modern dan nyaman untuk kegiatan belajar mengajar.</p>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ROW 4.25: DEMOGRAFI SISWA (Infografis) */}
      <StudentDemographics />

      {/* ROW 4.5: PUSAT LAYANAN SIBER & INTEGRASI MUTU (Sky Blue, Orange & White Theme) */}
      <section className="space-y-6" id="cyber-integrations-section">
        <ScrollReveal duration={600} threshold={0.05}>
          <SectionTitle 
            title="Sinergi Layanan Siber & Mutu" 
            subtitle="SDN 3 Purwosari mengadopsi integrasi tata kelola pendidikan berbasis awan demi transparansi publik."
          />
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="cyber-dashboard-grid">
          
          {/* Card 1: Rapor Mutu */}
          <ScrollReveal duration={800} delay={100} threshold={0.05} className="flex">
            <motion.div 
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => onPageChange('inovasi')}
              className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between w-full group cursor-pointer"
              id="cyber-widget-rapor"
            >
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] bg-sky-50 text-sky-700 font-extrabold px-3 py-1.5 rounded-xl border border-sky-100 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Cpu size={12} className="text-sky-600" />
                    INTEGRASI INTERNAL
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-sky-950 leading-tight font-display group-hover:text-orange-500 transition-colors">
                  Rapor Mutu 'DITALI RAPIA'
                </h3>
                <p className="text-xs sm:text-sm text-sky-900 font-semibold mt-2 leading-relaxed">
                  Modul visualisasi data rapor mutu interaktif yang menyederhanakan pemantauan hasil evaluasi sekolah bagi wali murid.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-sky-100 flex justify-between items-center text-xs font-mono text-sky-900 font-bold">
                <span>VERSI v2.6 SYNCED</span>
                <span className="text-orange-500 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Detail Inovasi <ArrowRight size={14} className="stroke-[2.5]" />
                </span>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Card 2: DAPODIK */}
          <ScrollReveal duration={800} delay={200} threshold={0.05} className="flex">
            <motion.div 
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between w-full group"
              id="cyber-widget-dapodik"
            >
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] bg-orange-50 text-orange-700 font-extrabold px-3 py-1.5 rounded-xl border border-orange-100 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Activity size={12} className="text-orange-600 animate-pulse" />
                    KEMENDIKBUDRISTEK
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-sky-950 leading-tight font-display">
                  Sinkronisasi Dapodik
                </h3>
                <p className="text-xs sm:text-sm text-sky-900 font-semibold mt-2 leading-relaxed">
                  Penyelarasan berkala data siswa, profil guru, rombongan belajar, dan sarana prasarana sekolah dengan database pusat Kemendikbudristek.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-sky-100 flex justify-between items-center text-xs font-mono text-sky-900 font-bold">
                <span>STATUS: AKTIF & VALID</span>
                <span className="text-green-600 font-black flex items-center gap-1">
                  SECURE LINKED
                </span>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Card 3: SIPPN */}
          <ScrollReveal duration={800} delay={300} threshold={0.05} className="flex">
            <div 
              onClick={() => onPageChange('layanan')}
              className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between w-full group cursor-pointer hover:border-orange-400 transition-all duration-300"
              id="cyber-widget-sippn"
            >
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] bg-sky-50 text-sky-700 font-extrabold px-3 py-1.5 rounded-xl border border-sky-100 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Globe size={12} className="text-sky-600" />
                    MENPAN PAN-RB
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
                
                <h3 className="text-lg font-black text-sky-950 leading-tight font-display group-hover:text-orange-500 transition-colors">
                  Portal SIPPN Nasional
                </h3>
                <p className="text-xs sm:text-sm text-sky-900 font-semibold mt-2 leading-relaxed">
                  Keterbacaan profil pelayanan publik SDN 3 Purwosari pada portal Sistem Informasi Pelayanan Publik Nasional milik Kemenpan RB.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-sky-100 flex justify-between items-center text-xs font-mono text-sky-900 font-bold">
                <span>STATUS: TERDATA RESMI</span>
                <span className="text-orange-500 font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Cek Layanan <ArrowRight size={14} className="stroke-[2.5]" />
                </span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ROW 5: PROGRAM & LAYANAN DIGITAL UNGGULAN (Sky Blue, Orange & White Theme) */}
      <section className="space-y-6" id="bento-hub-section">
        <ScrollReveal duration={600} threshold={0.05}>
          <SectionTitle 
            title="Program & Layanan Unggulan" 
            subtitle="Sinergi fungsionalitas digital layanan pendaftaran, peningkatan rapor mutu, dan transparansi anggaran."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch" id="bento-grid-container">
          
          {/* PPDB Online Card (Double Wide: spans 2 cols on desktop) */}
          <div className="md:col-span-2 flex">
            <ScrollReveal duration={800} delay={100} threshold={0.05} className="w-full flex">
              <div 
                onClick={() => onPageChange('spmb')}
                className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-xl border-4 border-white cursor-pointer group transition-transform duration-300 hover:-translate-y-1 w-full"
                id="bento-spmb-card"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
                
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-white/20 text-white font-black px-3 py-1.5 rounded-full uppercase tracking-widest inline-block border border-white/20">
                      PPDB ONLINE 2026/2027
                    </span>
                    <h3 className="text-2xl font-black tracking-tight mt-2 font-display">
                      Penerimaan Peserta Didik Baru
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:rotate-45 transition-transform duration-300 border border-white/10">
                    <ArrowUpRight size={20} className="stroke-[2.5]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10 mt-6">
                  <div>
                    <span className="text-[10px] text-orange-100 uppercase tracking-widest font-black font-mono">Kuota PPDB</span>
                    <p className="text-lg sm:text-xl font-black mt-0.5">56 Calon Siswa</p>
                    <p className="text-xs text-orange-50/80 mt-0.5 font-medium">Terbagi dalam 2 Rombongan Belajar</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-orange-100 uppercase tracking-widest font-black font-mono">Uang Pendaftaran</span>
                    <p className="text-lg sm:text-xl font-black mt-0.5 text-yellow-300">GRATIS 100%</p>
                    <p className="text-xs text-orange-50/80 mt-0.5 font-medium">Dibiayai APBN Pemerintah</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Inovasi 'DITALI RAPIA' Card (Square Block) */}
          <div className="flex">
            <ScrollReveal duration={800} delay={250} threshold={0.05} className="w-full flex">
              <div 
                onClick={() => onPageChange('inovasi')}
                className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 flex flex-col justify-between min-h-[220px] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 w-full hover:border-orange-400"
                id="bento-inovasi-card"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 border-2 border-sky-100 group-hover:scale-105 transition-transform">
                    <Lightbulb size={24} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-black text-sky-950 group-hover:text-orange-500 transition-colors font-display">
                    Inovasi Pendidikan
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-900 font-semibold leading-relaxed mt-2">
                    Rapor Mutu 'DITALI RAPIA' dan ekosistem harian literasi dini GEMARI.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-sky-100 flex justify-between items-center text-xs font-black text-orange-500 font-mono">
                  <span>BACA INOVASI</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Transparansi Dana BOS Card (Square Block) */}
          <div className="flex">
            <ScrollReveal duration={800} delay={350} threshold={0.05} className="w-full flex">
              <div 
                onClick={() => onPageChange('transparansi')}
                className="bg-white border-4 border-sky-100/70 rounded-[2rem] p-6 flex flex-col justify-between min-h-[220px] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1 w-full hover:border-orange-400"
                id="bento-transparansi-card"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border-2 border-orange-100 group-hover:scale-105 transition-transform">
                    <ShieldCheck size={24} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-black text-sky-950 group-hover:text-orange-500 transition-colors font-display">
                    Transparansi Dana
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-900 font-semibold leading-relaxed mt-2">
                    Keterbukaan anggaran RKAS serta laporan realisasi dana BOS resmi teratur.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-sky-100 flex justify-between items-center text-xs font-black text-orange-500 font-mono">
                  <span>CEK LAPORAN BOS</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* ROW 6: KABAR, AGENDA & PENGUMUMAN MULTI-CAROUSEL (Sky Blue, Orange & White Premium Theme) */}
      <section className="space-y-8" id="news-section">
        <ScrollReveal duration={600} threshold={0.05}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] bg-sky-50 text-sky-700 font-black px-4 py-1.5 rounded-xl border border-sky-100 uppercase tracking-widest inline-block">
                PUSAT INFORMASI INTERAKTIF
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-sky-950 mt-3 font-display">
                Kabar, Agenda & Pengumuman Sekolah
              </h3>
              <p className="text-xs sm:text-sm text-sky-900 font-bold mt-1.5">
                Pantau seluruh berita terkini, agenda penting, dan pengumuman resmi SD Negeri 3 Purwosari dalam satu tempat secara interaktif.
              </p>
            </div>

            {/* Slider Navigation Controls (Manual + AutoPlay toggle) */}
            <div className="flex items-center gap-3 self-start md:self-end">
              {/* Autoplay Toggle */}
              <button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  isAutoPlay 
                    ? 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100' 
                    : 'bg-white border-sky-100 text-sky-400 hover:text-sky-600 hover:border-sky-300'
                }`}
                title={isAutoPlay ? "Jeda Putar Otomatis" : "Mulai Putar Otomatis"}
              >
                {isAutoPlay ? <Pause size={16} className="stroke-[2.5]" /> : <Play size={16} className="stroke-[2.5]" />}
              </button>

              {/* Prev Button */}
              <button
                onClick={handlePrevCarousel}
                className="p-3 rounded-2xl bg-white border-2 border-sky-100 text-sky-700 hover:border-orange-400 hover:text-orange-500 transition-all cursor-pointer shadow-sm"
                aria-label="Slide Sebelumnya"
              >
                <ChevronLeft size={16} className="stroke-[2.5]" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextCarousel}
                className="p-3 rounded-2xl bg-white border-2 border-sky-100 text-sky-700 hover:border-orange-400 hover:text-orange-500 transition-all cursor-pointer shadow-sm"
                aria-label="Slide Berikutnya"
              >
                <ChevronRight size={16} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Dynamic Segmented Pill Tabs */}
        <div className="flex flex-wrap gap-2.5 bg-sky-50/55 border border-sky-100/50 p-2 rounded-3xl max-w-2xl" id="carousel-tab-trigger-container">
          <button
            onClick={() => setActiveCarouselTab('berita')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeCarouselTab === 'berita'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-sky-950 hover:bg-sky-100/50'
            }`}
          >
            <Megaphone size={14} className="stroke-[2.5]" />
            <span>Berita Terbaru</span>
          </button>

          <button
            onClick={() => setActiveCarouselTab('event')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeCarouselTab === 'event'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-sky-950 hover:bg-sky-100/50'
            }`}
          >
            <Calendar size={14} className="stroke-[2.5]" />
            <span>Agenda Kegiatan</span>
          </button>

          <button
            onClick={() => setActiveCarouselTab('pengumuman')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeCarouselTab === 'pengumuman'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-sky-950 hover:bg-sky-100/50'
            }`}
          >
            <Bell size={14} className="stroke-[2.5]" />
            <span>Pengumuman</span>
          </button>
        </div>

        {/* Carousel Slider Container */}
        <div className="relative overflow-hidden w-full pb-2" id="carousel-viewport-container">
          {/* Slider Gutter Wrap */}
          <div className="overflow-hidden mx-[-12px] px-3">
            <motion.div 
              className="flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(${translatePercent}%)`,
                width: `${(currentItems.length / visibleCount) * 100}%`
              }}
            >
              {currentItems.map((item: any) => {
                if (activeCarouselTab === 'berita') {
                  return (
                    <div 
                      key={item.id} 
                      style={{ width: `${100 / currentItems.length}%` }} 
                      className="px-3 shrink-0"
                    >
                      <article className="bg-white border-4 border-sky-100/70 rounded-[2.5rem] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-orange-400/80 flex flex-col justify-between group h-full w-full">
                        <div className="relative aspect-video w-full overflow-hidden bg-sky-50">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-4 left-4 px-3.5 py-1.5 bg-sky-600 text-white font-black rounded-xl text-[10px] uppercase tracking-wider shadow-md">
                            {item.category || "BERITA"}
                          </span>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow justify-between text-left">
                          <div>
                            <div className="flex items-center space-x-3 text-xs text-sky-800 font-bold mb-3 font-mono">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} className="text-orange-500 stroke-[2.5]" />
                                <span>{new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </span>
                              <span>&bull;</span>
                              <span className="truncate max-w-[120px]">{item.author}</span>
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-sky-950 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 font-display">
                              {item.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-sky-900 font-semibold mt-2 line-clamp-3 leading-relaxed">
                              {item.excerpt}
                            </p>
                          </div>
                          <div className="pt-4 mt-6 border-t-2 border-sky-100">
                            <button
                              onClick={() => onSelectNews(item.id)}
                              className="group inline-flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-orange-100 cursor-pointer text-[11px] uppercase tracking-wider"
                            >
                              <span>Baca Selengkapnya</span>
                              <ArrowRight size={13} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                } else if (activeCarouselTab === 'event') {
                  return (
                    <div 
                      key={item.id} 
                      style={{ width: `${100 / currentItems.length}%` }} 
                      className="px-3 shrink-0"
                    >
                      <div className="bg-white border-4 border-sky-100/70 rounded-[2.5rem] overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-orange-400/80 flex flex-col justify-between group h-full w-full">
                        <div className="relative aspect-video w-full overflow-hidden bg-sky-50">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-4 left-4 px-3 py-1 bg-orange-500 text-white font-black rounded-xl text-[10px] uppercase tracking-wider shadow-md">
                            {item.category}
                          </span>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow justify-between text-left">
                          <div>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-1.5 text-xs text-sky-800 font-bold font-mono">
                                <Calendar size={13} className="text-orange-500 stroke-[2.5]" />
                                <span>{item.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-sky-700 font-semibold font-mono">
                                <Clock size={12} className="text-sky-500" />
                                <span>{item.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-sky-700 font-semibold font-mono">
                                <MapPin size={12} className="text-red-500" />
                                <span className="truncate">{item.location}</span>
                              </div>
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-sky-950 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 font-display">
                              {item.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-sky-900 font-semibold mt-2 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                          <div className="pt-4 mt-6 border-t-2 border-sky-100">
                            <button
                              onClick={() => onPageChange('spmb')}
                              className="group inline-flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-orange-100 cursor-pointer text-[11px] uppercase tracking-wider"
                            >
                              <span>Lihat Agenda PPDB</span>
                              <ArrowRight size={13} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // announcement card
                  const importanceColors = item.importance === 'Tinggi' 
                    ? 'bg-rose-50 text-rose-700 border-rose-100' 
                    : item.importance === 'Sedang' 
                      ? 'bg-amber-50 text-amber-700 border-amber-100' 
                      : 'bg-sky-50 text-sky-700 border-sky-100';

                  return (
                    <div 
                      key={item.id} 
                      style={{ width: `${100 / currentItems.length}%` }} 
                      className="px-3 shrink-0"
                    >
                      <div className="bg-white border-4 border-sky-100/70 rounded-[2.5rem] p-6 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:border-orange-400/80 flex flex-col justify-between group h-full w-full relative overflow-hidden">
                        {/* Subtle Accent Background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
                        
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${importanceColors}`}>
                              PENTING: {item.importance}
                            </span>
                            <span className="text-[10px] text-sky-700 font-mono font-bold">
                              {item.date}
                            </span>
                          </div>

                          <div className="space-y-2 text-left">
                            <div className="inline-block px-2.5 py-0.5 bg-sky-50 border border-sky-100 rounded-lg text-[10px] font-bold text-sky-800 uppercase tracking-widest font-mono">
                              {item.tag}
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-sky-950 leading-tight group-hover:text-orange-500 transition-colors font-display line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-sky-900 font-medium leading-relaxed">
                              Target: <span className="font-bold text-sky-950">{item.target}</span>
                            </p>
                            <p className="text-xs sm:text-sm text-sky-900 font-semibold mt-3 leading-relaxed line-clamp-4">
                              {item.content}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 mt-6 border-t-2 border-sky-100 text-left">
                          <span className="inline-flex items-center text-[10px] font-black text-sky-800 uppercase tracking-wider font-mono gap-1">
                            <Info size={12} className="text-sky-500" />
                            SD Negeri 3 Purwosari
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </motion.div>
          </div>

          {/* Dots Indicators */}
          {currentItems.length > visibleCount && (
            <div className="flex justify-center items-center gap-1.5 mt-6" id="carousel-dots-indicators">
              {Array.from({ length: currentItems.length - visibleCount + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCarouselIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === carouselIndex ? 'bg-orange-500 w-6' : 'bg-sky-200 hover:bg-sky-300'
                  }`}
                  aria-label={`Slide ke-${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ROW 7: PRESTASI KEBANGGAAN SISWA (Sky Blue, Orange & White Theme) */}
      <section className="space-y-6" id="achievements-section">
        <ScrollReveal duration={600} threshold={0.05}>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] bg-sky-50 text-sky-700 font-black px-4 py-1.5 rounded-xl border border-sky-100 uppercase tracking-widest">
                PRESTASI UNGGUL
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-sky-950 mt-3 font-display">
                Siswa Berprestasi & Kebanggaan Juara
              </h3>
            </div>
            <button
              onClick={() => onPageChange('prestasi')}
              className="inline-flex items-center gap-1.5 text-xs font-black text-orange-500 hover:text-orange-600 cursor-pointer uppercase tracking-wider"
            >
              <span>Semua Prestasi</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>
          </div>
        </ScrollReveal>

        {/* 3-Column Prestasi Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="stacked-achievements">
          {prestasiSekolah.slice(0, 3).map((ach, idx) => (
            <ScrollReveal key={ach.id} duration={800} delay={idx * 150} threshold={0.05} className="flex">
              <div 
                onClick={() => onPageChange('prestasi')}
                className="bg-white border-4 border-sky-100/70 rounded-[2.5rem] p-5 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-sm h-full hover:-translate-y-1 hover:shadow-md hover:border-orange-400 w-full"
                id={`achievement-bento-item-${idx}`}
              >
                <div>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-sky-100 bg-sky-50 mb-4">
                    <img 
                      src={ach.image} 
                      alt={ach.title} 
                      referrerPolicy="no-referrer" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-1 text-[10px] text-orange-600 font-black uppercase tracking-widest font-mono">
                      <Trophy size={12} className="text-orange-500 stroke-[2.5]" />
                      <span>Tingkat {ach.level}</span>
                    </div>
                    <h4 className="text-base font-black text-sky-950 leading-snug group-hover:text-orange-500 transition-colors font-display line-clamp-2">
                      {ach.title}
                    </h4>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t-2 border-sky-100 flex justify-between items-center text-xs text-sky-900 font-bold">
                  <span>Siswa: <span className="text-sky-950 font-black">{ach.winner}</span></span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimoni Alumni */}
      <section className="max-w-7xl mx-auto px-4 py-16" id="testimoni-alumni">
        <ScrollReveal duration={800} threshold={0.05}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-sky-950 font-display">Testimoni Alumni</h2>
            <p className="text-sky-600 mt-2">Cerita dari mereka yang pernah menimba ilmu di SDN 3 Purwosari</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialSekolah.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-3xl shadow-sm border border-sky-100 flex flex-col h-full">
                <Quote className="text-orange-400 mb-4" size={32} />
                <p className="text-sky-800 italic flex-grow mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-sky-950">{t.name}</h4>
                    <p className="text-xs text-sky-600 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ROW 8: PORTAL LAYANAN PUBLIK & SIPPN (Sky Blue, Orange & White Theme) */}
      <section className="w-full" id="sippn-exclusive-section">
        <ScrollReveal duration={800} threshold={0.05}>
          <div 
            className="w-full bg-gradient-to-br from-sky-900 to-sky-950 text-white rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-xl border-4 border-white flex flex-col md:flex-row justify-between items-center gap-8" 
            id="footer-sippn-card"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent)] pointer-events-none" />
            <div className="absolute top-1/2 -translate-y-1/2 right-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4 max-w-2xl">
              <span className="px-3.5 py-1.5 bg-orange-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest inline-block border border-white/20 shadow-md">
                INTEGRASI LAYANAN NASIONAL
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight font-display">
                Terdaftar Resmi di SIPPN PAN-RB Republik Indonesia
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 font-medium leading-relaxed">
                SD Negeri 3 Purwosari berkomitmen penuh dalam menyelaraskan mutu transparansi pelayanan publik yang handal, terbuka, dan dapat dipantau langsung oleh seluruh masyarakat secara online.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onPageChange('layanan')}
                className="group px-6 py-3.5 bg-orange-500 text-white font-black text-xs rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-orange-600 hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)] text-center cursor-pointer whitespace-nowrap uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span>Layanan & Pengaduan</span>
                <ArrowRight size={14} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
              <a
                href="https://sippn.menpan.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-white/10 text-white font-bold text-xs rounded-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.2)] text-center cursor-pointer whitespace-nowrap font-mono"
              >
                <Globe size={14} className="text-orange-400 stroke-[2.5]" />
                <span>Cek SIPPN PAN-RB</span>
                <ArrowUpRight size={14} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ROW 9: PPDB ONLINE CALL-TO-ACTION (Sky Blue, Orange & White Theme) */}
      <section className="w-full" id="spmb-cta-exclusive-section">
        <ScrollReveal duration={800} threshold={0.05}>
          <div 
            className="w-full bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-[2.5rem] p-8 sm:p-12 relative overflow-hidden shadow-xl border-4 border-white flex flex-col md:flex-row justify-between items-center gap-8" 
            id="footer-spmb-card"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent)] pointer-events-none" />
            
            <div className="relative z-10 space-y-4 max-w-2xl">
              <span className="px-3.5 py-1.5 bg-sky-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow border border-white/20 inline-block">
                PPDB ONLINE T.P. 2026/2027
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight font-display">
                Mulai Langkah Sukses Putra-Putri Anda Bersama Kami!
              </h3>
              <p className="text-xs sm:text-sm text-orange-50 font-medium leading-relaxed">
                Daftarkan putra-putri Anda segera ke ekosistem belajar berstandar Akreditasi A secara GRATIS tanpa pungutan biaya pendidikan sepeser pun.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={() => onPageChange('spmb')}
                className="group px-6 py-3.5 bg-white text-orange-600 font-black rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-sky-50 hover:shadow-[0_8px_20px_rgba(255,255,255,0.3)] cursor-pointer text-center text-xs uppercase tracking-widest whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight size={14} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
              <button
                onClick={() => onPageChange('kontak')}
                className="group px-6 py-3.5 bg-white/10 text-white font-bold rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white/20 hover:shadow-[0_8px_20px_rgba(255,255,255,0.2)] text-center text-xs whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Hubungi Panitia</span>
                <ArrowRight size={14} className="stroke-[2.5] transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
