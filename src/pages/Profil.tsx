import React, { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { TeacherCard } from '../components/Cards';
import { TeacherStackedCarousel } from '../components/TeacherStackedCarousel';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';
import { RichTextEditor } from '../components/RichTextEditor';
import { StudentDemographics } from '../components/StudentDemographics';
import { Target, Compass, Milestone, Users, School, BookOpen, Search, UserCheck } from 'lucide-react';

export const Profil: React.FC = () => {
  const { profilSekolah, updateProfilSekolah, isEditMode } = useAdmin();
  const [activeTab, setActiveTab] = useState<'visi' | 'misi' | 'tujuan'>('visi');
  const [teacherSearch, setTeacherSearch] = useState('');

  const filteredTeachers = profilSekolah.guruTendik.filter((teacher) =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    teacher.role.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="profil-page">
      {/* 1. Jumbotron Header */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="profile-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Tentang Kami
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Profil Resmi Sekolah
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat visi, misi, jajaran pendidik, sejarah panjang, serta fasilitas penunjang masa depan siswa di SD Negeri 3 Purwosari.
          </p>
        </div>
      </section>

      {/* 2. Sambutan Kepala Sekolah */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="profile-sambutan">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Foto Kepala Sekolah */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="w-48 h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-slate-50 relative bg-slate-100 mb-4 flex items-center justify-center">
                <EditableImage 
                  src={profilSekolah.sambutanKepala.image} 
                  alt={profilSekolah.sambutanKepala.name}
                  onSave={(val) => updateProfilSekolah({
                    sambutanKepala: { ...profilSekolah.sambutanKepala, image: val }
                  })}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                <EditableText
                  value={profilSekolah.sambutanKepala.name}
                  onSave={(val) => updateProfilSekolah({
                    sambutanKepala: { ...profilSekolah.sambutanKepala, name: val }
                  })}
                />
              </h3>
              <div className="text-xs text-primary-600 font-semibold mt-1">
                <EditableText
                  value={profilSekolah.sambutanKepala.role}
                  onSave={(val) => updateProfilSekolah({
                    sambutanKepala: { ...profilSekolah.sambutanKepala, role: val }
                  })}
                />
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                NIP.{' '}
                <EditableText
                  value={profilSekolah.sambutanKepala.nip}
                  onSave={(val) => updateProfilSekolah({
                    sambutanKepala: { ...profilSekolah.sambutanKepala, nip: val }
                  })}
                />
              </div>
            </div>

            {/* Teks Sambutan */}
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs font-extrabold text-primary-600 uppercase tracking-widest">
                Kata Pengantar
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                Sambutan Kepala Sekolah
              </h3>
              <div className="w-16 h-1.5 bg-accent-500 rounded-full" />
              <div className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal space-y-4">
                <RichTextEditor
                  htmlValue={profilSekolah.sambutanKepala.text}
                  onSave={(val) => updateProfilSekolah({
                    sambutanKepala: { ...profilSekolah.sambutanKepala, text: val }
                  })}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sejarah */}
      <section className="bg-slate-50 py-16 border-y border-slate-100" id="profile-sejarah">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-primary-600">
                <Milestone size={24} />
                <span className="text-xs font-extrabold uppercase tracking-widest">Nostalgia & Rekam Jejak</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                Sejarah Singkat Sekolah
              </h2>
              <div className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal space-y-4">
                <RichTextEditor
                  htmlValue={profilSekolah.sejarah}
                  onSave={(val) => updateProfilSekolah({ sejarah: val })}
                />
              </div>
            </div>
            
            <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden shadow-md border-4 border-white bg-slate-200">
              <img 
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600" 
                alt="Sejarah SDN 3 Purwosari"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visi, Misi & Tujuan (Interactive Tabs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="profile-visi-misi">
        <SectionTitle 
          title="Visi, Misi & Tujuan" 
          subtitle="Arah haluan filosofi kami dalam membimbing tumbuh kembang bakat anak bangsa."
        />

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Tab Sidebar */}
          <div className="lg:col-span-4 bg-slate-50 p-6 border-r border-slate-100 flex flex-row lg:flex-col gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('visi')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-3 cursor-pointer ${
                activeTab === 'visi'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Target size={18} />
              <span>Visi Sekolah</span>
            </button>
            <button
              onClick={() => setActiveTab('misi')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-3 cursor-pointer ${
                activeTab === 'misi'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Compass size={18} />
              <span>Misi Sekolah</span>
            </button>
            <button
              onClick={() => setActiveTab('tujuan')}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-3 cursor-pointer ${
                activeTab === 'tujuan'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen size={18} />
              <span>Tujuan Sekolah</span>
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="lg:col-span-8 p-8 sm:p-12 min-h-[300px]">
            {activeTab === 'visi' && (
              <div className="space-y-6 animate-fadeIn">
                <span className="px-2.5 py-1 bg-accent-100 text-accent-700 font-bold rounded-md text-[10px] uppercase tracking-wider">
                  Visi Mulia
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                  Cita-cita Mulia Pendidikan Kami
                </h3>
                <blockquote className="border-l-4 border-accent-500 pl-6 text-md sm:text-xl text-slate-700 italic font-medium leading-relaxed">
                  &ldquo;
                  <EditableText
                    value={profilSekolah.visiMisi.visi}
                    onSave={(val) => updateProfilSekolah({
                      visiMisi: { ...profilSekolah.visiMisi, visi: val }
                    })}
                  />
                  &rdquo;
                </blockquote>
              </div>
            )}

            {activeTab === 'misi' && (
              <div className="space-y-6 animate-fadeIn">
                <span className="px-2.5 py-1 bg-primary-100 text-primary-700 font-bold rounded-md text-[10px] uppercase tracking-wider">
                  Misi Strategis
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                  Langkah Nyata Mencapai Visi
                </h3>
                <ul className="space-y-4">
                  {profilSekolah.visiMisi.misi.map((misiText, index) => (
                    <li key={index} className="flex items-start gap-3.5">
                      <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                        {index + 1}
                      </span>
                      <div className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal flex-grow">
                        <EditableText
                          value={misiText}
                          onSave={(val) => {
                            const newMisi = [...profilSekolah.visiMisi.misi];
                            newMisi[index] = val;
                            updateProfilSekolah({
                              visiMisi: { ...profilSekolah.visiMisi, misi: newMisi }
                            });
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'tujuan' && (
              <div className="space-y-6 animate-fadeIn">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-md text-[10px] uppercase tracking-wider">
                  Target Capaian
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                  Tujuan Operasional Jangka Menengah
                </h3>
                <ul className="space-y-4">
                  {profilSekolah.visiMisi.tujuan.map((tujuanText, index) => (
                    <li key={index} className="flex items-start gap-3.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 font-mono">
                        {index + 1}
                      </span>
                      <div className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal flex-grow">
                        <EditableText
                          value={tujuanText}
                          onSave={(val) => {
                            const newTujuan = [...profilSekolah.visiMisi.tujuan];
                            newTujuan[index] = val;
                            updateProfilSekolah({
                              visiMisi: { ...profilSekolah.visiMisi, tujuan: newTujuan }
                            });
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Guru & Tenaga Kependidikan */}
      <section className="bg-slate-50 py-16 border-y border-slate-100" id="profile-teachers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Keluarga Besar Pendidik</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">Guru & Tenaga Kependidikan</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">Para mentor profesional berintegritas tinggi siap mendampingi masa depan buah hati Anda.</p>
            </div>
            
            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Cari guru atau jabatan..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary-500 shadow-sm transition-colors"
              />
              <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <TeacherStackedCarousel teachers={filteredTeachers} />
        </div>
      </section>

      {/* 5.5. Demografi Siswa */}
      <section className="bg-white py-16" id="profile-demographics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StudentDemographics />
        </div>
      </section>

      {/* 6. Fasilitas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="profile-facilities">
        <SectionTitle 
          title="Fasilitas Penunjang Belajar" 
          subtitle="Sarana pembelajaran modern dan asri demi mendukung kelancaran menyerap materi ilmu pengetahuan."
        />

        {isEditMode && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={() => {
                const newFas = {
                  name: 'Fasilitas Baru SDN 3 Purwosari',
                  description: 'Penjelasan detail fasilitas baru sekolah dasar rujukan...',
                  image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800',
                  gridSpan: 1
                };
                updateProfilSekolah({ fasilitas: [...profilSekolah.fasilitas, newFas] });
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white font-extrabold text-xs rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider font-mono"
            >
              <School size={15} />
              <span>Tambah Kotak Fasilitas Baru</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profilSekolah.fasilitas.map((f, idx) => {
            const colSpan = (f as any).gridSpan || 1;
            const colClass = colSpan === 3
              ? 'md:col-span-2 lg:col-span-3'
              : colSpan === 2
                ? 'md:col-span-2 lg:col-span-2'
                : 'col-span-1';

            return (
              <div 
                key={idx}
                className={`bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 ${colClass}`}
                id={`facility-card-${idx}`}
              >
                <div className="aspect-video relative w-full overflow-hidden bg-slate-100 flex items-center justify-center">
                  <EditableImage 
                    src={f.image} 
                    alt={f.name}
                    onSave={(val) => {
                      const newFasilitas = [...profilSekolah.fasilitas];
                      newFasilitas[idx] = { ...newFasilitas[idx], image: val };
                      updateProfilSekolah({ fasilitas: newFasilitas });
                    }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3 flex flex-col flex-grow">
                  <h4 className="text-md sm:text-lg font-extrabold text-slate-800 leading-tight">
                    <EditableText
                      value={f.name}
                      onSave={(val) => {
                        const newFasilitas = [...profilSekolah.fasilitas];
                        newFasilitas[idx] = { ...newFasilitas[idx], name: val };
                        updateProfilSekolah({ fasilitas: newFasilitas });
                      }}
                    />
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal flex-grow">
                    <EditableText
                      value={f.description}
                      multiline
                      onSave={(val) => {
                        const newFasilitas = [...profilSekolah.fasilitas];
                        newFasilitas[idx] = { ...newFasilitas[idx], description: val };
                        updateProfilSekolah({ fasilitas: newFasilitas });
                      }}
                    />
                  </div>
                </div>

                {/* Sizing & Deletion controls for facilities */}
                {isEditMode && (
                  <div className="bg-slate-50 border-t border-slate-100 p-3 px-4 flex items-center justify-between text-xs gap-3 font-mono">
                    <div className="flex items-center gap-2 flex-grow">
                      <span className="font-bold text-slate-500 text-[10px] uppercase">Lebar Kotak:</span>
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        value={colSpan} 
                        onChange={(e) => {
                          const newFasilitas = [...profilSekolah.fasilitas];
                          newFasilitas[idx] = { ...newFasilitas[idx], gridSpan: parseInt(e.target.value) } as any;
                          updateProfilSekolah({ fasilitas: newFasilitas });
                        }}
                        className="w-20 accent-primary-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="font-extrabold text-primary-600">{colSpan}x</span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
                          const newFasilitas = profilSekolah.fasilitas.filter((_, fIdx) => fIdx !== idx);
                          updateProfilSekolah({ fasilitas: newFasilitas });
                        }
                      }}
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
      </section>
    </div>
  );
};
