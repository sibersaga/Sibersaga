import React, { useState } from 'react';
import { useAdmin, SchoolStatistic, AgendaItem } from '../context/AdminContext';
import { Activity, GalleryItem, News, PublicDocument, Testimonial, StudentDemographic } from '../data/schoolData';
import { 
  BarChart3, 
  Users,
  Megaphone, 
  Newspaper, 
  CalendarRange, 
  MessageSquare, 
  Compass, 
  Image as ImageIcon, 
  FileCheck2, 
  Briefcase, 
  Folder, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Check,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
  Info
} from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';

type AdminTab = 
  | 'statistik' 
  | 'demografi'
  | 'pengumuman' 
  | 'berita' 
  | 'agenda' 
  | 'testimoni' 
  | 'kegiatan' 
  | 'galeri' 
  | 'transparansi' 
  | 'layanan' 
  | 'dokumen';

export const AdminPanel: React.FC = () => {
  const { 
    isAdmin,
    statistikSekolah,
    updateStatistikSekolah,
    beritaSekolah,
    updateBeritaSekolah,
    agendaSekolah,
    updateAgendaSekolah,
    testimonialSekolah,
    updateTestimonialSekolah,
    kegiatanSekolah,
    updateKegiatanSekolah,
    galeriSekolah,
    updateGaleriSekolah,
    dokumenTransparansi,
    updateDokumenTransparansi,
    studentDemographics,
    updateStudentDemographics,
    profilSekolah,
    prestasiSekolah
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<AdminTab>('statistik');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form Editor States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // --- 1. STATISTIK FORM STATES ---
  const [statSiswa, setStatSiswa] = useState(statistikSekolah?.siswaAktif || 320);
  const [statPendidik, setStatPendidik] = useState(statistikSekolah?.pendidikStaff || 14);
  const [statJuara, setStatJuara] = useState(statistikSekolah?.penghargaanJuara || 25);
  const [statPojokBaca, setStatPojokBaca] = useState(statistikSekolah?.pojokBaca || 6);

  // --- 1.5. DEMOGRAFI FORM STATES ---
  const [demoKelas, setDemoKelas] = useState('');
  const [demoLaki, setDemoLaki] = useState<number | ''>('');
  const [demoPerempuan, setDemoPerempuan] = useState<number | ''>('');

  // --- 2. BERITA / PENGUMUMAN FORM STATES ---
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDate, setNewsDate] = useState('');
  const [newsCategory, setNewsCategory] = useState<'Pengumuman' | 'Kegiatan' | 'Prestasi' | 'Opini'>('Pengumuman');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('');

  // --- 3. AGENDA FORM STATES ---
  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaDate, setAgendaDate] = useState('');
  const [agendaStatus, setAgendaStatus] = useState<'Sedang Berlangsung' | 'Mendatang' | 'Selesai'>('Mendatang');

  // --- 4. TESTIMONI FORM STATES ---
  const [testiName, setTestiName] = useState('');
  const [testiRole, setTestiRole] = useState('');
  const [testiQuote, setTestiQuote] = useState('');
  const [testiImage, setTestiImage] = useState('');

  // --- 5. KEGIATAN FORM STATES ---
  const [kegTitle, setKegTitle] = useState('');
  const [kegCategory, setKegCategory] = useState<'intrakurikuler' | 'kokurikuler' | 'ekstrakurikuler'>('intrakurikuler');
  const [kegDesc, setKegDesc] = useState('');
  const [kegSchedule, setKegSchedule] = useState('');
  const [kegImage, setKegImage] = useState('');

  // --- 6. GALERI FORM STATES ---
  const [galTitle, setGalTitle] = useState('');
  const [galType, setGalType] = useState<'foto' | 'video'>('foto');
  const [galCategory, setGalCategory] = useState<'Kegiatan' | 'Fasilitas' | 'Prestasi' | 'Umum'>('Kegiatan');
  const [galUrl, setGalUrl] = useState('');
  const [galCaption, setGalCaption] = useState('');
  const [galFile, setGalFile] = useState<File | null>(null);
  const [uploadingGaleri, setUploadingGaleri] = useState(false);

  // --- 7. DOKUMEN FORM STATES ---
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'Transparansi' | 'Layanan Publik' | 'Kurikulum'>('Transparansi');
  const [docSize, setDocSize] = useState('');
  const [docDate, setDocDate] = useState('');
  const [docPdfUrl, setDocPdfUrl] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploadingDokumen, setUploadingDokumen] = useState(false);

  // Helper trigger Toast Notice
  const showToast = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUploadGaleri = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingGaleri(true);
    try {
      const base64 = await toBase64(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          base64Data: base64.split(',')[1],
          category: galType === 'video' ? 'video' : 'foto',
          subcategory: galCategory,
          title: galTitle || file.name,
          size: `${Math.round(file.size / 1024)} KB`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.driveUrl) {
        setGalUrl(data.driveUrl);
        showToast('File berhasil diunggah ke Google Drive!');
      } else {
        alert('Gagal mengunggah: ' + (data.error || 'Unknown'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal mengunggah file.');
    } finally {
      setUploadingGaleri(false);
    }
  };

  const handleUploadDokumen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDokumen(true);
    try {
      const base64 = await toBase64(file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          base64Data: base64.split(',')[1],
          category: 'pdf',
          subcategory: docCategory,
          title: docTitle || file.name,
          size: `${Math.round(file.size / 1024)} KB`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.driveUrl) {
        setDocPdfUrl(data.driveUrl);
        setDocSize(`${Math.round(file.size / 1024)} KB`);
        showToast('Dokumen PDF berhasil diunggah ke Google Drive!');
      } else {
        alert('Gagal mengunggah: ' + (data.error || 'Unknown'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal mengunggah dokumen.');
    } finally {
      setUploadingDokumen(false);
    }
  };

  // Guard access if not admin
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border-4 border-red-100 p-8 text-center space-y-6 shadow-xl" id="admin-panel-unauthorized">
        <div className="w-16 h-16 mx-auto bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
          <ShieldAlert size={36} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-800">Akses Ditolak</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Halaman ini eksklusif untuk Administrator SDN 3 Purwosari. Silakan login terlebih dahulu melalui tombol gembok di kanan bawah atau modal login resmi.
          </p>
        </div>
      </div>
    );
  }

  // --- SAVING PROCEDURES ---

  // 1. Save Statistik
  const handleSaveStatistik = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SchoolStatistic = {
      siswaAktif: Number(statSiswa),
      pendidikStaff: Number(statPendidik),
      penghargaanJuara: Number(statJuara),
      pojokBaca: Number(statPojokBaca)
    };
    updateStatistikSekolah(updated);
    showToast('Statistik Sekolah berhasil disimpan dan diperbarui harian!');
  };

  // 1.5. Manage Demografi
  const handleEditDemografi = (item: StudentDemographic) => {
    setEditingId(item.kelas);
    setIsAdding(true);
    setDemoKelas(item.kelas);
    setDemoLaki(item.laki);
    setDemoPerempuan(item.perempuan);
    setActiveTab('demografi');
  };

  const handleSaveDemografi = (e: React.FormEvent) => {
    e.preventDefault();
    const laki = Number(demoLaki) || 0;
    const perempuan = Number(demoPerempuan) || 0;
    const newItem: StudentDemographic = {
      kelas: demoKelas,
      laki,
      perempuan,
      total: laki + perempuan
    };

    let updated: StudentDemographic[];
    if (editingId) {
      updated = studentDemographics.map(item => item.kelas === editingId ? newItem : item);
    } else {
      updated = [...studentDemographics, newItem];
    }
    
    updateStudentDemographics(updated);
    setIsAdding(false);
    setEditingId(null);
    setDemoKelas('');
    setDemoLaki('');
    setDemoPerempuan('');
    showToast(editingId ? 'Data demografi berhasil diubah!' : 'Data demografi kelas baru berhasil ditambahkan!');
  };

  const handleDeleteDemografi = (kelas: string) => {
    if(confirm(`Yakin ingin menghapus data demografi ${kelas}?`)) {
      const updated = studentDemographics.filter(item => item.kelas !== kelas);
      updateStudentDemographics(updated);
      showToast('Data demografi berhasil dihapus.');
    }
  };

  // Reset Edit states
  const clearForm = () => {
    setEditingId(null);
    setIsAdding(false);
    
    // Reset inputs
    setNewsTitle('');
    setNewsDate('');
    setNewsExcerpt('');
    setNewsContent('');
    setNewsImage('');
    setNewsAuthor('');

    setAgendaTitle('');
    setAgendaDate('');
    setAgendaStatus('Mendatang');

    setTestiName('');
    setTestiRole('');
    setTestiQuote('');
    setTestiImage('');

    setKegTitle('');
    setKegDesc('');
    setKegSchedule('');
    setKegImage('');

    setGalTitle('');
    setGalUrl('');
    setGalCaption('');

    setDocTitle('');
    setDocSize('');
    setDocDate('');
    setDocPdfUrl('');
    setDocDesc('');
  };

  // 2. Save Berita / Pengumuman
  const handleSaveBerita = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsDate || !newsExcerpt) {
      alert('Mohon lengkapi judul, tanggal, dan ringkasan!');
      return;
    }

    const defaultImg = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800";
    const authorVal = newsAuthor || "Admin Sekolah";
    const categoryVal = activeTab === 'pengumuman' ? 'Pengumuman' : newsCategory;

    if (isAdding) {
      const newItem: News = {
        id: `news-${Date.now()}`,
        title: newsTitle,
        date: newsDate,
        category: categoryVal,
        excerpt: newsExcerpt,
        content: newsContent || newsExcerpt,
        image: newsImage || defaultImg,
        author: authorVal
      };
      updateBeritaSekolah([newItem, ...beritaSekolah]);
      showToast(`${categoryVal} baru berhasil ditambahkan!`);
    } else if (editingId) {
      const updatedList = beritaSekolah.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            title: newsTitle,
            date: newsDate,
            category: categoryVal,
            excerpt: newsExcerpt,
            content: newsContent || newsExcerpt,
            image: newsImage || defaultImg,
            author: authorVal
          };
        }
        return item;
      });
      updateBeritaSekolah(updatedList);
      showToast(`${categoryVal} berhasil diperbarui!`);
    }
    clearForm();
  };

  // Delete Berita/Pengumuman
  const handleDeleteBerita = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kabar ini?')) {
      const updatedList = beritaSekolah.filter(item => item.id !== id);
      updateBeritaSekolah(updatedList);
      showToast('Kabar berhasil dihapus.');
    }
  };

  // Edit Berita/Pengumuman Setup
  const setupEditBerita = (item: News) => {
    setEditingId(item.id);
    setNewsTitle(item.title);
    setNewsDate(item.date);
    setNewsCategory(item.category);
    setNewsExcerpt(item.excerpt);
    setNewsContent(item.content);
    setNewsImage(item.image);
    setNewsAuthor(item.author);
    setIsAdding(false);
  };

  // 3. Save Agenda
  const handleSaveAgenda = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaTitle || !agendaDate) {
      alert('Mohon lengkapi judul agenda dan tanggal kegiatan!');
      return;
    }

    if (isAdding) {
      const newItem: AgendaItem = {
        id: `agenda-${Date.now()}`,
        title: agendaTitle,
        date: agendaDate,
        status: agendaStatus
      };
      updateAgendaSekolah([...agendaSekolah, newItem]);
      showToast('Agenda kegiatan berhasil ditambahkan!');
    } else if (editingId) {
      const updatedList = agendaSekolah.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            title: agendaTitle,
            date: agendaDate,
            status: agendaStatus
          };
        }
        return item;
      });
      updateAgendaSekolah(updatedList);
      showToast('Agenda kegiatan berhasil diperbarui!');
    }
    clearForm();
  };

  // Delete Agenda
  const handleDeleteAgenda = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
      const updatedList = agendaSekolah.filter(item => item.id !== id);
      updateAgendaSekolah(updatedList);
      showToast('Agenda berhasil dihapus.');
    }
  };

  // Setup Edit Agenda
  const setupEditAgenda = (item: AgendaItem) => {
    setEditingId(item.id);
    setAgendaTitle(item.title);
    setAgendaDate(item.date);
    setAgendaStatus(item.status);
    setIsAdding(false);
  };

  // 4. Save Testimoni
  const handleSaveTestimoni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiName || !testiRole || !testiQuote) {
      alert('Mohon lengkapi nama, jabatan, dan kutipan testimoni!');
      return;
    }

    const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200";

    if (isAdding) {
      const newItem: Testimonial = {
        id: `testi-${Date.now()}`,
        name: testiName,
        role: testiRole,
        quote: testiQuote,
        image: testiImage || defaultAvatar
      };
      updateTestimonialSekolah([...testimonialSekolah, newItem]);
      showToast('Testimoni baru berhasil ditambahkan!');
    } else if (editingId) {
      const updatedList = testimonialSekolah.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            name: testiName,
            role: testiRole,
            quote: testiQuote,
            image: testiImage || defaultAvatar
          };
        }
        return item;
      });
      updateTestimonialSekolah(updatedList);
      showToast('Testimoni berhasil diperbarui!');
    }
    clearForm();
  };

  // Delete Testimoni
  const handleDeleteTestimoni = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
      const updatedList = testimonialSekolah.filter(item => item.id !== id);
      updateTestimonialSekolah(updatedList);
      showToast('Testimoni berhasil dihapus.');
    }
  };

  // Setup Edit Testimoni
  const setupEditTestimoni = (item: Testimonial) => {
    setEditingId(item.id);
    setTestiName(item.name);
    setTestiRole(item.role);
    setTestiQuote(item.quote);
    setTestiImage(item.image);
    setIsAdding(false);
  };

  // 5. Save Kegiatan
  const handleSaveKegiatan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kegTitle || !kegDesc || !kegSchedule) {
      alert('Mohon lengkapi nama kegiatan, deskripsi harian, dan jadwal!');
      return;
    }

    const defaultImg = "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800";

    if (isAdding) {
      const newItem: Activity = {
        id: `act-${Date.now()}`,
        title: kegTitle,
        category: kegCategory,
        description: kegDesc,
        schedule: kegSchedule,
        image: kegImage || defaultImg
      };
      updateKegiatanSekolah([...kegiatanSekolah, newItem]);
      showToast('Kegiatan baru berhasil ditambahkan!');
    } else if (editingId) {
      const updatedList = kegiatanSekolah.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            title: kegTitle,
            category: kegCategory,
            description: kegDesc,
            schedule: kegSchedule,
            image: kegImage || defaultImg
          };
        }
        return item;
      });
      updateKegiatanSekolah(updatedList);
      showToast('Kegiatan kurikulum berhasil diperbarui!');
    }
    clearForm();
  };

  // Delete Kegiatan
  const handleDeleteKegiatan = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan kurikulum ini?')) {
      const updatedList = kegiatanSekolah.filter(item => item.id !== id);
      updateKegiatanSekolah(updatedList);
      showToast('Kegiatan berhasil dihapus.');
    }
  };

  // Setup Edit Kegiatan
  const setupEditKegiatan = (item: Activity) => {
    setEditingId(item.id);
    setKegTitle(item.title);
    setKegCategory(item.category);
    setKegDesc(item.description);
    setKegSchedule(item.schedule);
    setKegImage(item.image);
    setIsAdding(false);
  };

  // 6. Save Galeri
  const handleSaveGaleri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle || !galUrl) {
      alert('Mohon lengkapi judul media dan tautan URL foto/video!');
      return;
    }

    if (isAdding) {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: galTitle,
        type: galType,
        category: galCategory,
        url: galUrl,
        caption: galCaption || galTitle
      };
      updateGaleriSekolah([newItem, ...galeriSekolah]);
      showToast('Media baru berhasil ditambahkan ke Galeri!');
    } else if (editingId) {
      const updatedList = galeriSekolah.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            title: galTitle,
            type: galType,
            category: galCategory,
            url: galUrl,
            caption: galCaption || galTitle
          };
        }
        return item;
      });
      updateGaleriSekolah(updatedList);
      showToast('Media galeri berhasil diperbarui!');
    }
    clearForm();
  };

  // Delete Galeri
  const handleDeleteGaleri = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus media galeri ini?')) {
      const updatedList = galeriSekolah.filter(item => item.id !== id);
      updateGaleriSekolah(updatedList);
      showToast('Media galeri dihapus.');
    }
  };

  // Setup Edit Galeri
  const setupEditGaleri = (item: GalleryItem) => {
    setEditingId(item.id);
    setGalTitle(item.title);
    setGalType(item.type);
    setGalCategory(item.category);
    setGalUrl(item.url);
    setGalCaption(item.caption);
    setIsAdding(false);
  };

  // 7. Save Dokumen / Transparansi / Layanan
  const handleSaveDokumen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docPdfUrl) {
      alert('Mohon lengkapi judul dokumen resmi dan link PDF!');
      return;
    }

    const defaultPdf = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    const sizeVal = docSize || "1.2 MB";
    const dateVal = docDate || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const categoryVal = 
      activeTab === 'transparansi' 
        ? 'Transparansi' 
        : activeTab === 'layanan' 
          ? 'Layanan Publik' 
          : docCategory;

    if (isAdding) {
      const newItem: PublicDocument = {
        id: `doc-${Date.now()}`,
        title: docTitle,
        category: categoryVal,
        fileSize: sizeVal,
        dateUploaded: dateVal,
        pdfUrl: docPdfUrl || defaultPdf,
        description: docDesc || `Dokumen resmi mengenai ${docTitle} SDN 3 Purwosari.`
      };
      updateDokumenTransparansi([...dokumenTransparansi, newItem]);
      showToast(`Dokumen kategori "${categoryVal}" berhasil ditambahkan!`);
    } else if (editingId) {
      const updatedList = dokumenTransparansi.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            title: docTitle,
            category: categoryVal,
            fileSize: sizeVal,
            dateUploaded: dateVal,
            pdfUrl: docPdfUrl || defaultPdf,
            description: docDesc || `Dokumen resmi mengenai ${docTitle} SDN 3 Purwosari.`
          };
        }
        return item;
      });
      updateDokumenTransparansi(updatedList);
      showToast('Dokumen berhasil diperbarui!');
    }
    clearForm();
  };

  // Delete Dokumen
  const handleDeleteDokumen = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus dokumen resmi ini?')) {
      const updatedList = dokumenTransparansi.filter(item => item.id !== id);
      updateDokumenTransparansi(updatedList);
      showToast('Dokumen berhasil dihapus.');
    }
  };

  // Setup Edit Dokumen
  const setupEditDokumen = (item: PublicDocument) => {
    setEditingId(item.id);
    setDocTitle(item.title);
    setDocCategory(item.category);
    setDocSize(item.fileSize);
    setDocDate(item.dateUploaded);
    setDocPdfUrl(item.pdfUrl);
    setDocDesc(item.description);
    setIsAdding(false);
  };

  // Sidebar navigation menu
  const menuItems: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
    { id: 'statistik', label: '1. Angka & Statistik', icon: <BarChart3 size={15} /> },
    { id: 'demografi', label: '2. Demografi Siswa', icon: <Users size={15} /> },
    { id: 'pengumuman', label: '3. Pengumuman', icon: <Megaphone size={15} /> },
    { id: 'berita', label: '4. Berita', icon: <Newspaper size={15} /> },
    { id: 'agenda', label: '5. Agenda', icon: <CalendarRange size={15} /> },
    { id: 'testimoni', label: '6. Testimoni', icon: <MessageSquare size={15} /> },
    { id: 'kegiatan', label: '7. Kegiatan', icon: <Compass size={15} /> },
    { id: 'galeri', label: '8. Galeri', icon: <ImageIcon size={15} /> },
    { id: 'transparansi', label: '9. Transparansi', icon: <FileCheck2 size={15} /> },
    { id: 'layanan', label: '10. Layanan Publik', icon: <Briefcase size={15} /> },
    { id: 'dokumen', label: '11. Semua Dokumen', icon: <Folder size={15} /> }
  ];

  return (
    <div className="space-y-8 animate-fade-in" id="admin-panel-viewport">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border-4 border-orange-500/20" id="admin-panel-header">
        <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto space-y-4 relative z-10 text-center md:text-left">
          <span className="text-xs bg-orange-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 w-fit mx-auto md:mx-0">
            <ShieldAlert size={14} />
            ADMIN MASTER DATA CONTROL
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-display">
            Sistem Entri & Modifikasi Konten
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
            Panel pusat untuk memasukkan angka statistik, memperbarui agenda harian, merilis pengumuman kilat, menulis kabar, mendaftarkan kegiatan kurikulum, serta mengunggah laporan transparansi dana BOS dan dokumen pelayanan.
          </p>
        </div>
      </section>

      {/* Main Toast Alerts */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white border-2 border-emerald-500 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100] animate-bounce" id="admin-toast">
          <div className="p-1 bg-emerald-500 rounded-lg text-white">
            <Check size={18} className="stroke-[3]" />
          </div>
          <span className="text-xs font-black tracking-wide font-mono">{successMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 space-y-4" id="admin-sidebar">
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono px-3 mb-2">Kategori Input Konten</h4>
            <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0" id="admin-sidebar-tabs">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      clearForm();
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer text-left w-full ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-md font-extrabold scale-[1.02]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-orange-50/50 rounded-3xl p-5 border border-orange-100 space-y-2">
            <h5 className="text-xs font-extrabold text-orange-800 flex items-center gap-1.5 font-mono">
              <Info size={14} /> Sinkronisasi Otomatis
            </h5>
            <p className="text-[11px] leading-relaxed text-orange-900/80 font-medium">
              Seluruh perubahan data yang disimpan di panel ini akan langsung tersimpan di penyimpanan perangkat lokal harian Anda, dan seketika memperbarui visual pada halaman beranda, halaman berita, transparansi, kegiatan, dll.
            </p>
          </div>
        </div>

        {/* WORKSPACE CONTENT AREA */}
        <div className="lg:col-span-3 space-y-6" id="admin-workspace-content">
          
          {/* TAB 1: STATISTIK */}
          {activeTab === 'statistik' && (() => {
            const calculatedSiswaAktif = studentDemographics.reduce((acc, curr) => acc + curr.total, 0);
            const calculatedPendidik = profilSekolah?.guruTendik?.length || 0;
            const calculatedPrestasi = prestasiSekolah?.length || 0;
            const calculatedRuangKelas = studentDemographics.length || 0;

            return (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <BarChart3 className="text-orange-500" />
                  Angka & Statistik Kebanggaan Kami
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Data statistik ini terintegrasi secara otomatis dengan data Demografi Siswa, Guru & Tenaga Kependidikan, serta Prestasi Sekolah.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5 p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Jumlah Siswa Aktif</label>
                  <p className="text-3xl font-black text-slate-800 font-display">{calculatedSiswaAktif}</p>
                </div>
                <div className="space-y-1.5 p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pendidik & Staff</label>
                  <p className="text-3xl font-black text-slate-800 font-display">{calculatedPendidik}</p>
                </div>
                <div className="space-y-1.5 p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Penghargaan / Juara</label>
                  <p className="text-3xl font-black text-slate-800 font-display">{calculatedPrestasi}</p>
                </div>
                <div className="space-y-1.5 p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ruang Kelas</label>
                  <p className="text-3xl font-black text-slate-800 font-display">{calculatedRuangKelas}</p>
                </div>
              </div>
            </div>
            );
          })()}

          {/* TAB 1.5: DEMOGRAFI */}
          {activeTab === 'demografi' && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Users className="text-sky-500" />
                    Manajemen Demografi Siswa
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Kelola data jumlah siswa per kelas berdasarkan jenis kelamin.</p>
                </div>
                {!isAdding ? (
                  <button
                    onClick={() => { clearForm(); setIsAdding(true); }}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-md w-full sm:w-auto"
                  >
                    <Plus size={14} /> Tambah Data Kelas
                  </button>
                ) : (
                  <button
                    onClick={() => { clearForm(); setIsAdding(false); }}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all w-full sm:w-auto"
                  >
                    <X size={14} /> Batal Tambah
                  </button>
                )}
              </div>

              {!isAdding ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentDemographics.map((item) => (
                    <div key={item.kelas} className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 relative group hover:border-sky-300 transition-all shadow-sm hover:shadow-md">
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm border border-slate-100">
                        <button onClick={() => handleEditDemografi(item)} className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-md" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDeleteDemografi(item.kelas)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md" title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">{item.kelas}</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between"><span className="text-slate-500">Laki-laki:</span><span className="font-bold text-blue-600">{item.laki}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Perempuan:</span><span className="font-bold text-rose-500">{item.perempuan}</span></div>
                        <div className="flex justify-between pt-1 border-t border-slate-50"><span className="font-bold text-slate-600">Total:</span><span className="font-black text-slate-800">{item.total}</span></div>
                      </div>
                    </div>
                  ))}
                  {studentDemographics.length === 0 && (
                    <div className="col-span-full py-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                      Belum ada data demografi kelas.
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveDemografi} className="space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200/60">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Nama Kelas / Rombel</label>
                      <input 
                        type="text" 
                        required 
                        value={demoKelas} 
                        onChange={e => setDemoKelas(e.target.value)} 
                        disabled={!!editingId}
                        placeholder="Contoh: Kelas 1" 
                        className="w-full text-sm p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none disabled:opacity-60"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Siswa Laki-laki</label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        value={demoLaki} 
                        onChange={e => setDemoLaki(e.target.value === '' ? '' : Number(e.target.value))} 
                        className="w-full text-sm p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Siswa Perempuan</label>
                      <input 
                        type="number" 
                        required 
                        min="0"
                        value={demoPerempuan} 
                        onChange={e => setDemoPerempuan(e.target.value === '' ? '' : Number(e.target.value))} 
                        className="w-full text-sm p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-slate-200 mt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-md w-full sm:w-auto justify-center"
                    >
                      <Save size={14} /> {editingId ? 'Simpan Perubahan' : 'Simpan Data Kelas'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2 & 3: NEWS & ANNOUNCEMENT LIST / EDIT */}
          {(activeTab === 'berita' || activeTab === 'pengumuman') && (
            <div className="space-y-6">
              {/* List Header */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      {activeTab === 'pengumuman' ? <Megaphone className="text-orange-500" /> : <Newspaper className="text-orange-500" />}
                      Kelola {activeTab === 'pengumuman' ? 'Pengumuman Resmi' : 'Kabar & Berita Sekolah'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeTab === 'pengumuman' 
                        ? 'Pengumuman penting dengan format peringatan tinggi yang langsung tayang pada slide pengumuman harian.' 
                        : 'Artikel berita lengkap mengenai prestasi, kegiatan harian, opini guru, serta dokumentasi pembelajaran.'}
                    </p>
                  </div>
                  
                  {!isAdding && !editingId && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus size={14} className="stroke-[2.5]" /> Tambah {activeTab === 'pengumuman' ? 'Pengumuman' : 'Berita'} Baru
                    </button>
                  )}
                </div>

                {/* News & Announcements Editor Form */}
                {(isAdding || editingId) && (
                  <form onSubmit={handleSaveBerita} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 mt-4 animate-fade-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 font-mono">
                      {isAdding ? 'Tambah Baru' : 'Modifikasi'} {activeTab === 'pengumuman' ? 'Pengumuman' : 'Berita'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Judul:</label>
                        <input
                          type="text"
                          required
                          value={newsTitle}
                          onChange={(e) => setNewsTitle(e.target.value)}
                          placeholder={`Contoh: ${activeTab === 'pengumuman' ? 'Pemberitahuan Libur Semester Ganjil' : 'Siswa SDN 3 Menjuarai Cerdas Cermat'}`}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Tanggal Rilis:</label>
                        <input
                          type="text"
                          required
                          value={newsDate}
                          onChange={(e) => setNewsDate(e.target.value)}
                          placeholder="Format: 2026-06-28 atau 28 Juni 2026"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      {activeTab !== 'pengumuman' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Kategori Berita:</label>
                          <select
                            value={newsCategory}
                            onChange={(e) => setNewsCategory(e.target.value as any)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="Kegiatan">Kegiatan</option>
                            <option value="Prestasi">Prestasi</option>
                            <option value="Opini">Opini</option>
                            <option value="Pengumuman">Pengumuman</option>
                          </select>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Penulis / Sumber Berita:</label>
                        <input
                          type="text"
                          value={newsAuthor}
                          onChange={(e) => setNewsAuthor(e.target.value)}
                          placeholder="Contoh: Humas Sekolah atau Suhartono, S.Pd."
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Link URL Gambar Headline:</label>
                        <input
                          type="url"
                          value={newsImage}
                          onChange={(e) => setNewsImage(e.target.value)}
                          placeholder="Tinggalkan kosong untuk gambar default sekolah"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Ringkasan Singkat (Excerpt):</label>
                        <textarea
                          required
                          value={newsExcerpt}
                          onChange={(e) => setNewsExcerpt(e.target.value)}
                          placeholder="Ringkasan 1-2 kalimat untuk pratinjau di halaman depan..."
                          rows={2}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Isi Berita Lengkap (Content):</label>
                        <textarea
                          value={newsContent}
                          onChange={(e) => setNewsContent(e.target.value)}
                          placeholder="Ketikkan teks utuh kabar di sini. Mendukung paragraf panjang..."
                          rows={6}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={13} /> Simpan {activeTab === 'pengumuman' ? 'Pengumuman' : 'Berita'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                    Daftar Arsip ({beritaSekolah.filter(n => activeTab === 'pengumuman' ? n.category === 'Pengumuman' : n.category !== 'Pengumuman').length})
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {beritaSekolah
                    .filter(n => activeTab === 'pengumuman' ? n.category === 'Pengumuman' : n.category !== 'Pengumuman')
                    .map((item) => (
                      <div key={item.id} className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded font-mono uppercase">
                              ID: {item.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono font-medium">{item.date}</span>
                            <span className="text-[10px] bg-orange-50 border border-orange-100 text-orange-600 font-bold px-2 py-0.5 rounded-lg">
                              {item.category}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-2">{item.excerpt}</p>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => setupEditBerita(item)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteBerita(item.id)}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AGENDA */}
          {activeTab === 'agenda' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <CalendarRange className="text-orange-500" />
                      Kelola Agenda & Kalender Kegiatan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Siklus agenda akademis, tenggat administratif, maupun perhelatan harian.</p>
                  </div>

                  {!isAdding && !editingId && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus size={14} className="stroke-[2.5]" /> Tambah Agenda Baru
                    </button>
                  )}
                </div>

                {/* Agenda Form */}
                {(isAdding || editingId) && (
                  <form onSubmit={handleSaveAgenda} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 mt-4 animate-fade-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 font-mono">
                      {isAdding ? 'Tambah Baru' : 'Modifikasi'} Agenda
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700">Nama Agenda / Kegiatan:</label>
                        <input
                          type="text"
                          required
                          value={agendaTitle}
                          onChange={(e) => setAgendaTitle(e.target.value)}
                          placeholder="Contoh: Rapat Komite Anggaran Baru atau Tryout ANBK Tahap 2"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Jadwal Tanggal:</label>
                        <input
                          type="text"
                          required
                          value={agendaDate}
                          onChange={(e) => setAgendaDate(e.target.value)}
                          placeholder="Contoh: 15 Juni - 30 Juni 2026 atau 12 Agustus 2026"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Status Agenda:</label>
                        <select
                          value={agendaStatus}
                          onChange={(e) => setAgendaStatus(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="Sedang Berlangsung">Sedang Berlangsung</option>
                          <option value="Mendatang">Mendatang</option>
                          <option value="Selesai">Selesai</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={13} /> Simpan Agenda
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                    Daftar Agenda ({agendaSekolah.length})
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {agendaSekolah.map((item) => (
                    <div key={item.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-mono px-2 py-0.5 rounded font-bold">
                            ID: {item.id}
                          </span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-lg border ${
                            item.status === 'Sedang Berlangsung' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600 animate-pulse'
                              : 'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-800">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 font-mono font-bold">{item.date}</p>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => setupEditAgenda(item)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteAgenda(item.id)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONI */}
          {activeTab === 'testimoni' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <MessageSquare className="text-orange-500" />
                      Kelola Testimoni Alumni & Wali Siswa
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Ulasan positif, cerita sukses alumni, atau tanggapan apresiatif masyarakat.</p>
                  </div>

                  {!isAdding && !editingId && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus size={14} className="stroke-[2.5]" /> Tambah Testimoni Baru
                    </button>
                  )}
                </div>

                {/* Testimonial Form */}
                {(isAdding || editingId) && (
                  <form onSubmit={handleSaveTestimoni} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 mt-4 animate-fade-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 font-mono">
                      {isAdding ? 'Tambah Baru' : 'Modifikasi'} Testimoni
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Nama Lengkap:</label>
                        <input
                          type="text"
                          required
                          value={testiName}
                          onChange={(e) => setTestiName(e.target.value)}
                          placeholder="Contoh: Rian Anggoro, S.T."
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Jabatan / Profil Singkat:</label>
                        <input
                          type="text"
                          required
                          value={testiRole}
                          onChange={(e) => setTestiRole(e.target.value)}
                          placeholder="Contoh: Alumni Angkatan 2018 - Mahasiswa UGM"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Link URL Foto Profil:</label>
                        <input
                          type="url"
                          value={testiImage}
                          onChange={(e) => setTestiImage(e.target.value)}
                          placeholder="Contoh: https://images.unsplash.com/... (atau kosongkan untuk default)"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Isi Kesaksian / Kutipan (Quote):</label>
                        <textarea
                          required
                          value={testiQuote}
                          onChange={(e) => setTestiQuote(e.target.value)}
                          placeholder="Tuliskan ulasan positif atau cerita pengalaman belajar di sekolah..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={13} /> Simpan Testimoni
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                    Kesaksian Terpublikasi ({testimonialSekolah.length})
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {testimonialSekolah.map((item) => (
                    <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-xs font-black text-slate-800">{item.name}</h4>
                          <p className="text-[10px] text-primary-600 font-black tracking-wide font-mono uppercase leading-none">{item.role}</p>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1 italic mt-1">"{item.quote}"</p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => setupEditTestimoni(item)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimoni(item.id)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: KEGIATAN */}
          {activeTab === 'kegiatan' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Compass className="text-orange-500" />
                      Kelola Kegiatan Kurikulum & Ekskul
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Daftar kegiatan intrakurikuler harian, kokurikuler P5, maupun ekstrakurikuler kepanduan/seni.</p>
                  </div>

                  {!isAdding && !editingId && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus size={14} className="stroke-[2.5]" /> Tambah Kegiatan Baru
                    </button>
                  )}
                </div>

                {/* Kegiatan Form */}
                {(isAdding || editingId) && (
                  <form onSubmit={handleSaveKegiatan} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 mt-4 animate-fade-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 font-mono">
                      {isAdding ? 'Tambah Baru' : 'Modifikasi'} Kegiatan
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700">Nama Kegiatan:</label>
                        <input
                          type="text"
                          required
                          value={kegTitle}
                          onChange={(e) => setKegTitle(e.target.value)}
                          placeholder="Contoh: Ekstrakurikuler Pramuka Siaga & Penggalang"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Kelompok Kegiatan:</label>
                        <select
                          value={kegCategory}
                          onChange={(e) => setKegCategory(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="intrakurikuler">Intrakurikuler (Harian Kelas)</option>
                          <option value="kokurikuler">Kokurikuler (Projek P5)</option>
                          <option value="ekstrakurikuler">Ekstrakurikuler (Bakat Minat)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Jadwal Pelaksanaan:</label>
                        <input
                          type="text"
                          required
                          value={kegSchedule}
                          onChange={(e) => setKegSchedule(e.target.value)}
                          placeholder="Contoh: Setiap hari Jumat, Jam 14:00 WIB"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Tautan Gambar Dokumentasi:</label>
                        <input
                          type="url"
                          value={kegImage}
                          onChange={(e) => setKegImage(e.target.value)}
                          placeholder="Tinggalkan kosong untuk memakai gambar default kurikulum"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Penjelasan & Deskripsi Kegiatan:</label>
                        <textarea
                          required
                          value={kegDesc}
                          onChange={(e) => setKegDesc(e.target.value)}
                          placeholder="Uraikan maksud dan capaian pembelajaran dari kegiatan ini..."
                          rows={4}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={13} /> Simpan Kegiatan
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                    Daftar Kegiatan Kurikulum ({kegiatanSekolah.length})
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {kegiatanSekolah.map((item) => (
                    <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors justify-between">
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-10 rounded-xl object-cover border border-slate-100 shadow-xs shrink-0"
                        />
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded font-mono uppercase">
                            {item.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono font-bold">{item.schedule}</p>
                        </div>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => setupEditKegiatan(item)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteKegiatan(item.id)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: GALERI */}
          {activeTab === 'galeri' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <ImageIcon className="text-orange-500" />
                      Kelola Media Galeri Foto & Video
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Dokumentasi visual kegiatan seremonial, fasilitas pendukung, atau prestasi sekolah.</p>
                  </div>

                  {!isAdding && !editingId && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus size={14} className="stroke-[2.5]" /> Tambah Media Baru
                    </button>
                  )}
                </div>

                {/* Galeri Form */}
                {(isAdding || editingId) && (
                  <form onSubmit={handleSaveGaleri} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 mt-4 animate-fade-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 font-mono">
                      {isAdding ? 'Tambah Baru' : 'Modifikasi'} Media Galeri
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700">Judul Media:</label>
                        <input
                          type="text"
                          required
                          value={galTitle}
                          onChange={(e) => setGalTitle(e.target.value)}
                          placeholder="Contoh: Upacara Hari Kemerdekaan RI Ke-81 atau Kunjungan Green House"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Tipe Media:</label>
                        <select
                          value={galType}
                          onChange={(e) => setGalType(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="foto">Foto</option>
                          <option value="video">Video (YouTube / Drive Embed)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Kelompok Galeri:</label>
                        <select
                          value={galCategory}
                          onChange={(e) => setGalCategory(e.target.value as any)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="Kegiatan">Kegiatan</option>
                          <option value="Fasilitas">Fasilitas</option>
                          <option value="Prestasi">Prestasi</option>
                          <option value="Umum">Umum</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Tautan Gambar / Video URL:</label>
                        <input
                          type="url"
                          value={galUrl}
                          onChange={(e) => setGalUrl(e.target.value)}
                          placeholder="Link Unsplash, Imgur, YouTube URL, atau asset awan lainnya"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">ATAU UNGGAH FILE:</label>
                          <input
                            type="file"
                            accept={galType === 'video' ? 'video/*' : 'image/*'}
                            onChange={handleUploadGaleri}
                            className="text-xs text-slate-600 font-semibold"
                            disabled={uploadingGaleri}
                          />
                          {uploadingGaleri && <span className="text-xs text-orange-600 font-bold animate-pulse">Mengunggah...</span>}
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Keterangan Gambar (Caption):</label>
                        <textarea
                          value={galCaption}
                          onChange={(e) => setGalCaption(e.target.value)}
                          placeholder="Tulis ringkasan penjelasan foto yang tampil saat diklik pembaca..."
                          rows={2}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={13} /> Simpan Media
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                    Dokumentasi Galeri ({galeriSekolah.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 max-h-[500px] overflow-y-auto">
                  {galeriSekolah.map((item) => (
                    <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-start justify-between gap-3 hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-start gap-3 min-w-0">
                        {item.type === 'foto' ? (
                          <img
                            src={item.url}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-16 h-12 rounded-lg object-cover border border-slate-200 shrink-0 bg-white"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0 font-mono text-[9px] font-black uppercase">
                            Video
                          </div>
                        )}
                        <div className="space-y-0.5 min-w-0 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] bg-slate-200 font-mono font-bold px-1.5 py-0.5 rounded text-slate-600 uppercase">{item.type}</span>
                            <span className="text-[9px] text-primary-600 font-extrabold">{item.category}</span>
                          </div>
                          <h5 className="text-xs font-black text-slate-800 truncate">{item.title}</h5>
                          <p className="text-[10px] text-slate-400 font-medium truncate">{item.caption}</p>
                        </div>
                      </div>

                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => setupEditGaleri(item)}
                          className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteGaleri(item.id)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 8, 9 & 10: DOKUMEN / TRANSPARANSI / LAYANAN */}
          {(activeTab === 'dokumen' || activeTab === 'transparansi' || activeTab === 'layanan') && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      {activeTab === 'transparansi' ? <FileCheck2 className="text-orange-500" /> : activeTab === 'layanan' ? <Briefcase className="text-orange-500" /> : <Folder className="text-orange-500" />}
                      Arsip Dokumen Resmi {activeTab === 'transparansi' ? '(Transparansi Dana BOS)' : activeTab === 'layanan' ? '(Layanan Publik)' : ''}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeTab === 'transparansi' 
                        ? 'Pengarsipan rincian Rencana Kegiatan & Anggaran Sekolah (RKAS) serta laporan realisasi Dana BOS.'
                        : activeTab === 'layanan'
                          ? 'Berkas administrasi publik, standar pelayanan harian, tata cara mutasi, dan pengaduan publik.'
                          : 'Arsip berkas publik lengkap sekolah (Kurikulum, SOP, Pelayanan, RKAS/BOS).'}
                    </p>
                  </div>

                  {!isAdding && !editingId && (
                    <button
                      onClick={() => setIsAdding(true)}
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Plus size={14} className="stroke-[2.5]" /> Tambah Dokumen Baru
                    </button>
                  )}
                </div>

                {/* Dokumen Form */}
                {(isAdding || editingId) && (
                  <form onSubmit={handleSaveDokumen} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 mt-4 animate-fade-in">
                    <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 font-mono">
                      {isAdding ? 'Tambah Baru' : 'Modifikasi'} Dokumen Resmi
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-700">Nama / Judul Dokumen:</label>
                        <input
                          type="text"
                          required
                          value={docTitle}
                          onChange={(e) => setDocTitle(e.target.value)}
                          placeholder="Contoh: Laporan Realisasi Anggaran Dana BOS Semester 1 Tahun 2026"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      {activeTab === 'dokumen' && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Kategori Dokumen:</label>
                          <select
                            value={docCategory}
                            onChange={(e) => setDocCategory(e.target.value as any)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="Transparansi">Transparansi (Dana BOS/RKAS)</option>
                            <option value="Layanan Publik">Layanan Publik (SOP/Panduan)</option>
                            <option value="Kurikulum">Kurikulum (Rapor/Modul Belajar)</option>
                          </select>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Ukuran File Dokumen:</label>
                        <input
                          type="text"
                          value={docSize}
                          onChange={(e) => setDocSize(e.target.value)}
                          placeholder="Contoh: 1.5 MB atau 850 KB"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Tanggal Pengunggahan:</label>
                        <input
                          type="text"
                          value={docDate}
                          onChange={(e) => setDocDate(e.target.value)}
                          placeholder="Tinggalkan kosong untuk memakai tanggal hari ini"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Tautan File PDF / Dokumen URL:</label>
                        <input
                          type="url"
                          value={docPdfUrl}
                          onChange={(e) => setDocPdfUrl(e.target.value)}
                          placeholder="URL dokumen PDF atau formulir pendaftaran dinas"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">ATAU UNGGAH PDF:</label>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleUploadDokumen}
                            className="text-xs text-slate-600 font-semibold"
                            disabled={uploadingDokumen}
                          />
                          {uploadingDokumen && <span className="text-xs text-orange-600 font-bold animate-pulse">Mengunggah...</span>}
                        </div>
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Ringkasan Deskripsi Dokumen:</label>
                        <textarea
                          value={docDesc}
                          onChange={(e) => setDocDesc(e.target.value)}
                          placeholder="Uraikan peruntukan berkas ini bagi pembaca..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        type="button"
                        onClick={clearForm}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Save size={13} /> Simpan Dokumen
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono">
                    Daftar Arsip Dokumen ({
                      dokumenTransparansi.filter(d => 
                        activeTab === 'transparansi' 
                          ? d.category === 'Transparansi' 
                          : activeTab === 'layanan' 
                            ? d.category === 'Layanan Publik' 
                            : true
                      ).length
                    })
                  </span>
                </div>

                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                  {dokumenTransparansi
                    .filter(d => 
                      activeTab === 'transparansi' 
                        ? d.category === 'Transparansi' 
                        : activeTab === 'layanan' 
                          ? d.category === 'Layanan Publik' 
                          : true
                    )
                    .map((item) => (
                      <div key={item.id} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors justify-between">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded font-mono">
                              ID: {item.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.dateUploaded}</span>
                            <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-100 font-black px-2 py-0.5 rounded-lg font-sans">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Ukuran: {item.fileSize}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1">{item.title}</h4>
                          <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{item.description}</p>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
                            title="Buka Berkas"
                          >
                            <ExternalLink size={14} />
                          </a>
                          <button
                            onClick={() => setupEditDokumen(item)}
                            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteDokumen(item.id)}
                            className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
