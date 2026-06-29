import React, { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/EditableText';
import { RichTextEditor } from '../components/RichTextEditor';
import { Calendar, Layers, Sparkles, BookOpen, Clock } from 'lucide-react';

export const Kegiatan: React.FC = () => {
  const { kegiatanSekolah, updateKegiatanSekolah, isEditMode } = useAdmin();
  const [activeCategory, setActiveCategory] = useState<'semua' | 'intrakurikuler' | 'kokurikuler' | 'ekstrakurikuler'>('semua');

  const filteredActivities = activeCategory === 'semua'
    ? kegiatanSekolah
    : kegiatanSekolah.filter((act) => act.category === activeCategory);

  const categories = [
    { id: 'semua', label: 'Semua Kegiatan', icon: <Layers size={16} /> },
    { id: 'intrakurikuler', label: 'Intrakurikuler', icon: <BookOpen size={16} /> },
    { id: 'kokurikuler', label: 'Kokurikuler (P5)', icon: <Clock size={16} /> },
    { id: 'ekstrakurikuler', label: 'Ekstrakurikuler', icon: <Sparkles size={16} /> }
  ] as const;

  const handleUpdateActivity = (id: string, updatedFields: Partial<typeof kegiatanSekolah[0]>) => {
    const updated = kegiatanSekolah.map((act) =>
      act.id === id ? { ...act, ...updatedFields } : act
    );
    updateKegiatanSekolah(updated);
  };

  const handleAddActivity = () => {
    const newAct = {
      id: `act-${Date.now()}`,
      title: 'Judul Kegiatan Baru',
      category: activeCategory === 'semua' ? 'intrakurikuler' : activeCategory,
      schedule: 'Setiap Hari Sabtu, 08:00 WIB',
      description: '<p>Tuliskan penjelasan kegiatan baru Anda di sini menggunakan editor teks lengkap ini.</p>',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      gridSpan: 1
    };
    updateKegiatanSekolah([...kegiatanSekolah, newAct]);
  };

  const handleDeleteActivity = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kegiatan ini?')) {
      updateKegiatanSekolah(kegiatanSekolah.filter((act) => act.id !== id));
    }
  };

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="kegiatan-page">
      {/* Jumbotron */}
      <section className="bg-gradient-to-br from-primary-600 to-sky-700 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="kegiatan-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Aktivitas Sekolah
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Program & Kegiatan Siswa
          </h2>
          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Menyajikan aneka ragam kegiatan rutin intrakurikuler harian, penguatan karakter kokurikuler, hingga wahana bakat ekstrakurikuler di SDN 3 Purwosari.
          </p>
        </div>
      </section>

      {/* Categories Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center" id="kegiatan-filters">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-md flex flex-wrap gap-1.5 justify-center">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid of Activities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="kegiatan-grid-section">
        {isEditMode && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={handleAddActivity}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider font-mono"
            >
              <Sparkles size={15} className="stroke-[2.5]" />
              <span>Tambah Kotak Kegiatan Baru</span>
            </button>
          </div>
        )}

        {filteredActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((act) => {
              const colSpan = act.gridSpan || 1;
              const colClass = colSpan === 3
                ? 'md:col-span-2 lg:col-span-3'
                : colSpan === 2
                  ? 'md:col-span-2 lg:col-span-2'
                  : 'col-span-1';

              return (
                <div 
                  key={act.id}
                  id={`activity-${act.id}`}
                  className={`bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 group ${colClass}`}
                >
                  {/* Photo Header */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img 
                      src={act.image} 
                      alt={act.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 bg-slate-900/80 text-white font-extrabold rounded-md text-[10px] uppercase tracking-wider">
                        {act.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-md sm:text-lg font-extrabold text-slate-800 tracking-tight leading-snug group-hover:text-primary-600 transition-colors">
                      <EditableText
                        value={act.title}
                        onSave={(val) => handleUpdateActivity(act.id, { title: val })}
                      />
                    </h3>
                    
                    <div className="flex items-center gap-2 text-xs text-primary-600 font-bold uppercase tracking-wider my-3">
                      <Calendar size={14} className="text-accent-500" />
                      <div className="flex items-center gap-1">
                        Jadwal:
                        <EditableText
                          value={act.schedule}
                          onSave={(val) => handleUpdateActivity(act.id, { schedule: val })}
                        />
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed flex-grow">
                      <RichTextEditor
                        htmlValue={act.description}
                        onSave={(val) => handleUpdateActivity(act.id, { description: val })}
                      />
                    </div>
                  </div>

                  {/* Drag/Sizing Controller */}
                  {isEditMode && (
                    <div className="bg-slate-50 border-t border-slate-100 p-3 px-4 flex items-center justify-between text-xs gap-3 font-mono">
                      <div className="flex items-center gap-2 flex-grow">
                        <span className="font-bold text-slate-500 text-[10px] uppercase">Lebar Kotak:</span>
                        <input 
                          type="range" 
                          min="1" 
                          max="3" 
                          value={act.gridSpan || 1} 
                          onChange={(e) => handleUpdateActivity(act.id, { gridSpan: parseInt(e.target.value) })}
                          className="w-20 accent-primary-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="font-extrabold text-primary-600">{act.gridSpan || 1}x</span>
                      </div>
                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        className="text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded font-bold transition-colors text-[10px] uppercase tracking-wider border border-red-200"
                        title="Hapus Kotak"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 flex flex-col items-center max-w-md mx-auto">
            <Layers size={36} className="mb-2 text-slate-300" />
            <h4 className="font-bold text-slate-700">Kegiatan Kosong</h4>
            <p className="text-xs mt-1">Belum ada kegiatan yang terdaftar dalam kategori ini.</p>
          </div>
        )}
      </section>
    </div>
  );
};
