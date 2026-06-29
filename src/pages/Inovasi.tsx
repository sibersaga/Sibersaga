import React, { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/EditableText';
import { EditableImage } from '../components/EditableImage';
import { RichTextEditor } from '../components/RichTextEditor';
import { Lightbulb, CheckCircle2, Star, Sparkles, HelpCircle, BookOpen, GraduationCap } from 'lucide-react';

export const Inovasi: React.FC = () => {
  const { inovasiSekolah, updateInovasiSekolah } = useAdmin();
  const [selectedInovId, setSelectedInovId] = useState<string>(inovasiSekolah[0]?.id || '');

  const activeInov = inovasiSekolah.find((inv) => inv.id === selectedInovId) || inovasiSekolah[0];

  const updateActiveInov = (updatedFields: any) => {
    const updated = inovasiSekolah.map((item) => 
      item.id === activeInov.id ? { ...item, ...updatedFields } : item
    );
    updateInovasiSekolah(updated);
  };

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="inovasi-page">
      {/* Jumbotron */}
      <section className="bg-gradient-to-br from-primary-600 to-sky-700 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="inovasi-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Kreativitas & Terobosan
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Inovasi Unggulan Sekolah
          </h2>
          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Menyajikan program-program terobosan digitalisasi administrasi serta ekosistem literasi siswa unggulan orisinal besutan SDN 3 Purwosari.
          </p>
        </div>
      </section>

      {/* Selector Tabs on Top */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center" id="inovasi-selector">
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-md flex flex-col sm:flex-row gap-2 max-w-2xl w-full">
          {inovasiSekolah.map((inov) => {
            const isSelected = selectedInovId === inov.id;
            return (
              <button
                key={inov.id}
                id={`inov-tab-btn-${inov.id}`}
                onClick={() => setSelectedInovId(inov.id)}
                className={`w-full px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-primary-500 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                }`}
              >
                <Lightbulb size={16} />
                <span>{inov.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Feature Display */}
      {activeInov && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="inovasi-content-display">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Cover & Badging */}
            <div className="lg:col-span-5 relative bg-slate-900 aspect-video lg:aspect-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent z-10 pointer-events-none" />
              <EditableImage 
                src={activeInov.image} 
                alt={activeInov.title}
                onSave={(val) => updateActiveInov({ image: val })}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-6 bottom-6 z-20 space-y-2 text-white">
                <span className="px-3 py-1 bg-accent-500 text-white text-[10px] uppercase font-extrabold tracking-wider rounded">
                  PROGRAM UNGGULAN
                </span>
                <h3 className="text-lg sm:text-2xl font-black leading-tight">
                  <EditableText
                    value={activeInov.title}
                    onSave={(val) => updateActiveInov({ title: val })}
                  />
                </h3>
                <div className="text-xs text-slate-300 font-medium italic">
                  &ldquo;
                  <EditableText
                    value={activeInov.slogan}
                    onSave={(val) => updateActiveInov({ slogan: val })}
                  />
                  &rdquo;
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions & Real Benefits List */}
            <div className="lg:col-span-7 p-8 sm:p-12 space-y-8 flex flex-col justify-center">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent-500" />
                  <span>Gambaran Umum Program</span>
                </h4>
                <div className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal space-y-4">
                  <RichTextEditor
                    htmlValue={activeInov.description}
                    onSave={(val) => updateActiveInov({ description: val })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-primary-600 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  <span>Manfaat Nyata Program</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeInov.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex gap-2.5 items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <Star size={16} className="text-accent-500 shrink-0 mt-0.5 fill-accent-500" />
                      <div className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed flex-grow">
                        <EditableText
                          value={benefit}
                          onSave={(val) => {
                            const newBenefits = [...activeInov.benefits];
                            newBenefits[bIdx] = val;
                            updateActiveInov({ benefits: newBenefits });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Extra FAQ section to enrich the page */}
      <section className="bg-slate-50 py-16 border-y border-slate-100" id="inovasi-impact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle 
            title="Dampak Positif Inovasi" 
            subtitle="Bagaimana terobosan-terobosan kecil ini melahirkan perubahan budaya luar biasa bagi ekosistem SDN 3 Purwosari."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <span className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-black font-mono">1</span>
              <h4 className="text-base font-extrabold text-slate-800">Literasi Meningkat</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">Siswa terbiasa membaca 15 menit setiap pagi sebelum pelajaran, meningkatkan nilai tes literasi ANBK secara nyata.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <span className="w-10 h-10 rounded-xl bg-accent-100 text-accent-700 flex items-center justify-center font-black font-mono">2</span>
              <h4 className="text-base font-extrabold text-slate-800">Sinergi Orang Tua</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">Wali murid aktif memantau rapor mutu pendidikan digital dan memberikan feedback bimbingan harian di rumah.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black font-mono">3</span>
              <h4 className="text-base font-extrabold text-slate-800">Digitalisasi Satuan</h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">SDN 3 Purwosari diakui sebagai salah satu pelopor digitalisasi administrasi sekolah dasar rujukan di Wonogiri.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
