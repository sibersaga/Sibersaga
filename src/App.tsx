import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { AIAssistant } from './components/AIAssistant';
import { AdminProvider } from './context/AdminContext';
import { AdminHeader } from './components/AdminHeader';
import { beritaSekolah } from './data/schoolData';

// Pages
import { Beranda } from './pages/Beranda';
import { Profil } from './pages/Profil';
import { Kegiatan } from './pages/Kegiatan';
import { Berita } from './pages/Berita';
import { Galeri } from './pages/Galeri';
import { Inovasi } from './pages/Inovasi';
import { Transparansi } from './pages/Transparansi';
import { LayananPublik } from './pages/LayananPublik';
import { Spmb } from './pages/Spmb';
import { Kontak } from './pages/Kontak';
import { Workspace } from './pages/Workspace';
import { AdminPanel } from './pages/AdminPanel';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('beranda');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [currentPage]);

  // Dynamic Title & Meta Description for SEO
  useEffect(() => {
    let title = "Portal Resmi SD Negeri 3 Purwosari";
    let description = "Selamat datang di SD Negeri 3 Purwosari. Temukan informasi profil sekolah, pendaftaran siswa baru, inovasi digital, kegiatan, prestasi, transparansi dana BOS, serta layanan pengaduan publik.";

    switch (currentPage) {
      case 'beranda':
        title = "Portal Resmi SD Negeri 3 Purwosari";
        description = "Selamat datang di portal resmi SD Negeri 3 Purwosari. Temukan profil sekolah, berita terbaru, prestasi siswa, inovasi digital, transparansi dana BOS, dan pelayanan publik berkualitas.";
        break;
      case 'profil':
        title = "Profil & Sejarah Sekolah - SD Negeri 3 Purwosari";
        description = "Mengenal visi, misi, sejarah, jajaran pendidik, dan fasilitas modern penunjang pembelajaran berkualitas di SD Negeri 3 Purwosari.";
        break;
      case 'kegiatan':
        title = "Kegiatan Pembelajaran & Ekskul - SD Negeri 3 Purwosari";
        description = "Eksplorasi kegiatan siswa di SD Negeri 3 Purwosari, mulai dari kurikulum intrakurikuler, projek P5, hingga kegiatan ekstrakurikuler kepanduan, seni, dan keagamaan.";
        break;
      case 'prestasi':
        title = "Prestasi Siswa & Guru - SD Negeri 3 Purwosari";
        description = "Apresiasi prestasi gemilang putra-putri SD Negeri 3 Purwosari dalam bidang akademik, seni, dan olahraga di tingkat regional hingga nasional.";
        break;
      case 'berita':
        if (selectedNewsId) {
          const newsItem = beritaSekolah.find(n => n.id === selectedNewsId);
          if (newsItem) {
            title = `${newsItem.title} - SD Negeri 3 Purwosari`;
            description = newsItem.excerpt || `${newsItem.title}. Baca selengkapnya berita resmi dan pengumuman dari SD Negeri 3 Purwosari.`;
          } else {
            title = "Berita & Pengumuman Terbaru - SD Negeri 3 Purwosari";
            description = "Temukan berita terbaru, siaran pers, artikel pendidikan, dan pengumuman resmi terpercaya dari SD Negeri 3 Purwosari.";
          }
        } else {
          title = "Berita & Pengumuman Terbaru - SD Negeri 3 Purwosari";
          description = "Temukan berita terbaru, siaran pers, artikel pendidikan, dan pengumuman resmi terpercaya dari SD Negeri 3 Purwosari.";
        }
        break;
      case 'galeri':
        title = "Galeri Foto & Dokumentasi Kegiatan - SD Negeri 3 Purwosari";
        description = "Kumpulan dokumentasi foto dan video interaktif kegiatan belajar mengajar, fasilitas sekolah, serta acara seremonial penting di SD Negeri 3 Purwosari.";
        break;
      case 'inovasi':
        title = "Inovasi Pembelajaran Digital - SD Negeri 3 Purwosari";
        description = "Mengenal terobosan digitalisasi administrasi dan literasi orisinal di SD Negeri 3 Purwosari seperti program GEMARI dan DITALI RAPIA.";
        break;
      case 'transparansi':
        title = "Transparansi Anggaran & Dana BOS - SD Negeri 3 Purwosari";
        description = "Bentuk keterbukaan informasi dan pertanggungjawaban publik SD Negeri 3 Purwosari dalam mengelola Rencana Kegiatan Sekolah (RKAS) serta dana BOS.";
        break;
      case 'layanan':
        title = "Standar Layanan Publik & Pengaduan - SD Negeri 3 Purwosari";
        description = "Komitmen transparansi pelayanan publik SD Negeri 3 Purwosari yang terintegrasi dengan SIPPN Kemenpan RB untuk pelayanan tata kelola berkualitas tinggi.";
        break;
      case 'spmb':
        title = "Pendaftaran Peserta Didik Baru (PPDB) - SD Negeri 3 Purwosari";
        description = "Informasi lengkap penerimaan siswa baru (PPDB/SPMB) SD Negeri 3 Purwosari tahun pelajaran 2026/2027. Alur pendaftaran online, berkas persyaratan, dan FAQ.";
        break;
      case 'kontak':
        title = "Kontak Resmi & Peta Lokasi - SD Negeri 3 Purwosari";
        description = "Hubungi SD Negeri 3 Purwosari. Alamat lengkap sekolah, nomor telepon, email administrasi resmi, jam pelayanan, serta petunjuk arah Google Maps.";
        break;
      case 'workspace':
        title = "Workspace Admin & Kolaborasi - SD Negeri 3 Purwosari";
        description = "Dashboard admin dan sistem kolaborasi online terpadu SD Negeri 3 Purwosari untuk pengelolaan berkas cloud, spreadsheet data, formulir, dan korespondensi dinas.";
        break;
      default:
        break;
    }

    // Set document title
    document.title = title;

    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }, [currentPage, selectedNewsId]);

  const handlePageChange = (pageId: string) => {
    setCurrentPage(pageId);
    // Reset selected news when navigating away from news page, or to it afresh
    if (pageId !== 'berita') {
      setSelectedNewsId(null);
    }
  };

  const handleSelectNews = (newsId: string | null) => {
    setSelectedNewsId(newsId);
    setCurrentPage('berita');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'beranda':
        return <Beranda onPageChange={handlePageChange} onSelectNews={handleSelectNews} />;
      case 'profil':
        return <Profil />;
      case 'kegiatan':
        return <Kegiatan />;
      case 'berita':
        return <Berita selectedNewsId={selectedNewsId} onSelectNews={setSelectedNewsId} />;
      case 'galeri':
        return <Galeri />;
      case 'inovasi':
        return <Inovasi />;
      case 'transparansi':
        return <Transparansi />;
      case 'layanan':
      case 'kontak':
      case 'workspace':
        return <LayananPublik />;
      case 'spmb':
        return <Spmb />;
      case 'admin-panel':
        return <AdminPanel />;
      default:
        return <Beranda onPageChange={handlePageChange} onSelectNews={handleSelectNews} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans" id="app-root-container">
      {/* Floating Admin Header if logged in */}
      <AdminHeader />

      {/* Reusable Header Navbar */}
      <Navbar currentPage={currentPage} onPageChange={handlePageChange} onSelectNews={handleSelectNews} />

      {/* Main Page Stage area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 w-full" id="main-content-stage">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Reusable Footer */}
      <Footer onPageChange={handlePageChange} />

      {/* Floating Back to Top Button */}
      <BackToTop />
      
      {/* Floating AI Assistant (Only visible to admin) */}
      <AIAssistant />
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}
