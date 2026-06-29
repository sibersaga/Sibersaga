import React, { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { GalleryCard } from '../components/Cards';
import { galeriSekolah, GalleryItem } from '../data/schoolData';
import { Eye, X, Layers, Image as ImageIcon, Video, Compass } from 'lucide-react';

export const Galeri: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Kegiatan' | 'Fasilitas' | 'Prestasi' | 'Umum'>('Semua');
  const [activeType, setActiveType] = useState<'Semua' | 'foto' | 'video'>('Semua');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filteredItems = galeriSekolah.filter((item) => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchType = activeType === 'Semua' || item.type === activeType;
    return matchCategory && matchType;
  });

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="galeri-page">
      {/* Jumbotron */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="galeri-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Dokumentasi Visual
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Galeri Kegiatan & Fasilitas
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Menyajikan kumpulan dokumentasi resmi berupa foto-foto kegiatan belajar, upacara, perlombaan, serta potret sarana prasarana sekolah.
          </p>
        </div>
      </section>

      {/* Categories Filter Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="galeri-filter-bar">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex flex-col md:flex-row md:justify-between items-center gap-4">
          
          {/* Category Dropdowns / Toggles */}
          <div className="flex flex-wrap gap-2">
            {(['Semua', 'Kegiatan', 'Fasilitas', 'Prestasi', 'Umum'] as const).map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-500 text-white shadow'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Media Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['Semua', 'foto', 'video'] as const).map((type) => {
              const isSelected = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer capitalize ${
                    isSelected
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {type === 'foto' ? 'Foto Only' : type === 'video' ? 'Video Only' : 'Semua Media'}
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Grid of Gallery Photos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="galeri-photos-grid">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <GalleryCard 
                key={item.id} 
                item={item} 
                onPreview={() => setSelectedItem(item)} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 flex flex-col items-center max-w-md mx-auto">
            <ImageIcon size={36} className="mb-2 text-slate-300" />
            <h4 className="font-bold text-slate-700">Galeri Kosong</h4>
            <p className="text-xs mt-1">Belum ada dokumentasi foto yang sesuai dengan penyaringan Anda.</p>
          </div>
        )}
      </section>

      {/* Lightbox Modal Overlay */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 animate-fadeIn" 
          id="gallery-lightbox"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative bg-slate-900 text-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer z-10"
              aria-label="Tutup"
            >
              <X size={20} />
            </button>

            {/* Display Box */}
            <div className="aspect-video w-full relative bg-slate-950 flex items-center justify-center">
              <img 
                src={selectedItem.url} 
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] max-w-full object-contain"
              />
              {selectedItem.type === 'video' && (
                <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                  <div className="p-4 bg-accent-500 text-white rounded-full font-black animate-pulse shadow-xl">
                    PLAY VIDEO
                  </div>
                </div>
              )}
            </div>

            {/* Caption Info */}
            <div className="p-6 bg-slate-950/90 border-t border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-[10px] sm:text-xs">
                <span className="px-3 py-1 bg-primary-600 font-extrabold text-white rounded uppercase tracking-wider">
                  {selectedItem.category}
                </span>
                <span className="text-slate-400 capitalize">
                  Media: {selectedItem.type}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                {selectedItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                {selectedItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
