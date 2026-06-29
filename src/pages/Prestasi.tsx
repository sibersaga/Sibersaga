import React, { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { AchievementCard } from '../components/Cards';
import { useAdmin } from '../context/AdminContext';
import { Award, Trophy, Compass, Calendar, Sparkles } from 'lucide-react';

export const Prestasi: React.FC = () => {
  const { prestasiSekolah, updatePrestasiSekolah, isEditMode } = useAdmin();
  const [activeCategory, setActiveCategory] = useState<'Semua' | 'Akademik' | 'Non-Akademik'>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');

  const years = ['Semua', '2025', '2024'];

  const filteredAchievements = prestasiSekolah.filter((ach) => {
    const matchCategory = activeCategory === 'Semua' || ach.category === activeCategory;
    const matchYear = selectedYear === 'Semua' || ach.year === selectedYear;
    return matchCategory && matchYear;
  });

  const handleAddAchievement = () => {
    const newAch = {
      id: `ach-${Date.now()}`,
      title: 'Juara Lomba Baru SDN 3 Purwosari',
      winner: 'Nama Siswa / Tim',
      category: activeCategory === 'Semua' ? 'Akademik' : activeCategory,
      level: 'Kabupaten',
      year: selectedYear === 'Semua' ? '2025' : selectedYear,
      description: '<p>Tuliskan detail prestasi, proses lomba, dan bimbingan guru di sini menggunakan editor teks visual lengkap kami.</p>',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      gridSpan: 1
    };
    updatePrestasiSekolah([...prestasiSekolah, newAch]);
  };

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="prestasi-page">
      {/* Jumbotron */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="prestasi-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Siswa Berprestasi
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Ruang Galeri Prestasi Juara
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Apresiasi dan dokumentasi prestasi gemilang putra-putri SD Negeri 3 Purwosari di tingkat kecamatan, karesidenan, hingga kabupaten.
          </p>
        </div>
      </section>

      {/* Filters (Category + Year) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="prestasi-filters">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md flex flex-col md:flex-row md:justify-between items-center gap-4">
          
          {/* Category Toggle */}
          <div className="flex flex-wrap gap-2">
            {(['Semua', 'Akademik', 'Non-Akademik'] as const).map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-primary-500 text-white shadow'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                  }`}
                >
                  <Trophy size={14} />
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Year Select Filter */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Calendar size={14} />
              <span>Tahun:</span>
            </span>
            <div className="flex gap-1.5">
              {years.map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* Achievements Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="prestasi-cards-grid">
        {isEditMode && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={handleAddAchievement}
              className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider font-mono"
            >
              <Sparkles size={15} className="stroke-[2.5]" />
              <span>Tambah Kotak Prestasi Baru</span>
            </button>
          </div>
        )}

        {filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAchievements.map((ach) => {
              const colSpan = ach.gridSpan || 1;
              const colClass = colSpan === 3
                ? 'md:col-span-2 lg:col-span-3'
                : colSpan === 2
                  ? 'md:col-span-2 lg:col-span-2'
                  : 'col-span-1';

              return (
                <div key={ach.id} className={colClass}>
                  <AchievementCard achievement={ach} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 flex flex-col items-center max-w-md mx-auto">
            <Award size={36} className="mb-2 text-slate-300" />
            <h4 className="font-bold text-slate-700">Prestasi Kosong</h4>
            <p className="text-xs mt-1">Tidak ada catatan prestasi yang cocok dengan kriteria pencarian Anda.</p>
          </div>
        )}
      </section>
    </div>
  );
};
