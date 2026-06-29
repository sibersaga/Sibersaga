import React, { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { NewsCard } from '../components/Cards';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';
import { RichTextEditor } from '../components/RichTextEditor';
import { Calendar, User, Search, RefreshCw, ChevronLeft, ArrowLeft, PlusCircle, Trash2, Newspaper, Trophy, LayoutGrid, Megaphone } from 'lucide-react';
import { News } from '../data/schoolData';
import { Prestasi } from './Prestasi';

interface BeritaProps {
  selectedNewsId: string | null;
  onSelectNews: (newsId: string | null) => void;
}

export const Berita: React.FC<BeritaProps> = ({ selectedNewsId, onSelectNews }) => {
  const { beritaSekolah, updateBeritaSekolah, isEditMode } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Berita' | 'Pengumuman' | 'Prestasi'>('Semua');

  const filteredNews = beritaSekolah.filter((news) => {
    const matchSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    let matchCategory = true;
    if (activeCategory === 'Pengumuman') {
      matchCategory = news.category === 'Pengumuman';
    } else if (activeCategory === 'Berita') {
      matchCategory = news.category !== 'Pengumuman' && news.category !== 'Prestasi';
    } else if (activeCategory === 'Prestasi') {
      matchCategory = false;
    }
    return matchSearch && matchCategory;
  });

  const selectedArticle = beritaSekolah.find((n) => n.id === selectedNewsId);

  const updateArticle = (articleId: string, updatedFields: Partial<News>) => {
    const updated = beritaSekolah.map((item) =>
      item.id === articleId ? { ...item, ...updatedFields } as News : item
    );
    updateBeritaSekolah(updated);
  };

  const handleAddNews = () => {
    const newArticle: News = {
      id: `news-${Date.now()}`,
      title: 'Judul Berita Baru SDN 3 Purwosari',
      date: new Date().toISOString().split('T')[0],
      category: 'Kegiatan',
      excerpt: 'Rangkuman ringkas atau ringkasan berita baru...',
      content: 'Tuliskan isi berita lengkap di sini. Anda bisa mengedit tulisan ini langsung menggunakan editor visual kami dengan mengeklik teks.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      author: 'Admin'
    };
    updateBeritaSekolah([newArticle, ...beritaSekolah]);
    onSelectNews(newArticle.id); // Open it immediately for WYSIWYG editing!
  };

  const handleDeleteNews = (articleId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus artikel berita ini?')) {
      updateBeritaSekolah(beritaSekolah.filter((n) => n.id !== articleId));
      onSelectNews(null);
    }
  };

  // If a specific article is chosen, show details
  if (selectedArticle && activeCategory !== 'Prestasi') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn" id="news-detail-view">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <button
            onClick={() => onSelectNews(null)}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 group cursor-pointer"
            id="back-to-news-list"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Daftar Berita</span>
          </button>

          {isEditMode && (
            <button
              onClick={() => handleDeleteNews(selectedArticle.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer border border-red-200/50"
            >
              <Trash2 size={13} />
              <span>HAPUS BERITA</span>
            </button>
          )}
        </div>

        <article className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
          {/* Cover Photo */}
          <div className="aspect-video w-full relative bg-slate-100 flex items-center justify-center">
            <EditableImage 
              src={selectedArticle.image} 
              alt={selectedArticle.title}
              onSave={(val) => updateArticle(selectedArticle.id, { image: val })}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 z-20">
              {isEditMode ? (
                <div className="bg-orange-500 text-white rounded-lg p-1.5 shadow-md">
                  <EditableText
                    value={selectedArticle.category}
                    onSave={(val) => updateArticle(selectedArticle.id, { category: val as any })}
                    className="text-xs font-extrabold uppercase tracking-widest px-2"
                  />
                </div>
              ) : (
                <span className="px-3.5 py-1.5 bg-accent-500 text-white font-extrabold rounded-lg text-xs tracking-wider shadow-md">
                  {selectedArticle.category}
                </span>
              )}
            </div>
          </div>

          {/* Article Header */}
          <div className="p-8 sm:p-12 border-b border-slate-100 space-y-4">
            <div className="flex items-center space-x-6 text-xs sm:text-sm text-slate-400 font-semibold">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary-500" />
                <div>
                  <EditableText
                    value={selectedArticle.date}
                    onSave={(val) => updateArticle(selectedArticle.id, { date: val })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={16} className="text-primary-500" />
                <div>Oleh:{' '}
                  <EditableText
                    value={selectedArticle.author}
                    onSave={(val) => updateArticle(selectedArticle.id, { author: val })}
                  />
                </div>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-snug">
              <EditableText
                value={selectedArticle.title}
                onSave={(val) => updateArticle(selectedArticle.id, { 
                  title: val,
                  excerpt: val.length > 100 ? val.substring(0, 97) + '...' : val 
                })}
              />
            </h1>
          </div>

          {/* Article Content */}
          <div className="p-8 sm:p-12 text-slate-600 text-sm sm:text-base leading-relaxed font-normal space-y-4">
            <RichTextEditor
              htmlValue={selectedArticle.content}
              onSave={(val) => updateArticle(selectedArticle.id, { content: val })}
            />
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="berita-list-page">
      {/* Jumbotron */}
      <section className="bg-gradient-to-br from-primary-600 to-sky-700 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="berita-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Kabar Terkini
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Berita & Pengumuman Resmi
          </h2>
          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Menyajikan berita resmi seputar kemajuan sekolah, pengumuman agenda terdekat, rekapitulasi prestasi siswa, serta buah pemikiran para pendidik.
          </p>
        </div>
      </section>

      {/* Filters & Search Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="berita-filters-search">
        
        {/* Modern Pill Tab Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
          <div className="bg-slate-50 p-1.5 rounded-2xl inline-flex shadow-sm border border-slate-100 overflow-x-auto w-full sm:w-auto">
            {(['Semua', 'Berita', 'Pengumuman', 'Prestasi'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap min-w-min ${
                  activeCategory === tab
                    ? 'bg-white text-sky-600 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent'
                }`}
              >
                {tab === 'Semua' && <LayoutGrid size={18} />}
                {tab === 'Berita' && <Newspaper size={18} />}
                {tab === 'Pengumuman' && <Megaphone size={18} />}
                {tab === 'Prestasi' && <Trophy size={18} />}
                <span>{tab}</span>
              </button>
            ))}
          </div>

          {/* Search Input Bar (Hidden on Prestasi) */}
          {activeCategory !== 'Prestasi' && (
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 shadow-sm rounded-2xl text-sm font-medium focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all"
              />
              <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Content Grid */}
      {activeCategory !== 'Prestasi' ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="berita-grid">
          {isEditMode && (
            <div className="mb-8 flex justify-center">
              <button
                onClick={handleAddNews}
                className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider font-mono"
              >
                <PlusCircle size={15} className="stroke-[2.5]" />
                <span>Tambah Berita Baru</span>
              </button>
            </div>
          )}

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((news) => (
                <div key={news.id} className="relative group">
                  <NewsCard 
                    news={news} 
                    onClick={() => onSelectNews(news.id)} 
                  />
                  {isEditMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNews(news.id);
                      }}
                      className="absolute top-4 right-4 z-20 p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg border border-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                      title="Hapus Berita"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 flex flex-col items-center max-w-md mx-auto">
              <RefreshCw size={36} className="mb-2 text-slate-300" />
              <h4 className="font-bold text-slate-700">Berita Tidak Ditemukan</h4>
              <p className="text-xs mt-1">Belum ada artikel berita yang cocok dengan kriteria pencarian Anda.</p>
            </div>
          )}
        </section>
      ) : (
        <Prestasi />
      )}
    </div>
  );
};
