import React, { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/EditableText';
import { RichTextEditor } from '../components/RichTextEditor';
import { ClipboardList, Calendar, MapPin, BadgeHelp, ChevronDown, ChevronUp, CheckCircle, Info, Sparkles } from 'lucide-react';

export const Spmb: React.FC = () => {
  const { spmbConfig, updateSpmbConfig } = useAdmin();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleUpdateSchedule = (index: number, updatedFields: Partial<typeof spmbConfig.schedule[0]>) => {
    const updatedSchedule = [...spmbConfig.schedule];
    updatedSchedule[index] = { ...updatedSchedule[index], ...updatedFields };
    updateSpmbConfig({ ...spmbConfig, schedule: updatedSchedule });
  };

  const handleUpdateRequirement = (index: number, val: string) => {
    const updatedReqs = [...spmbConfig.requirements];
    updatedReqs[index] = val;
    updateSpmbConfig({ ...spmbConfig, requirements: updatedReqs });
  };

  const handleUpdateStep = (index: number, updatedFields: Partial<typeof spmbConfig.steps[0]>) => {
    const updatedSteps = [...spmbConfig.steps];
    updatedSteps[index] = { ...updatedSteps[index], ...updatedFields };
    updateSpmbConfig({ ...spmbConfig, steps: updatedSteps });
  };

  const handleUpdateFaq = (index: number, updatedFields: Partial<typeof spmbConfig.faqs[0]>) => {
    const updatedFaqs = [...spmbConfig.faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], ...updatedFields };
    updateSpmbConfig({ ...spmbConfig, faqs: updatedFaqs });
  };

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="spmb-page">
      {/* Jumbotron */}
      <section className="bg-gradient-to-br from-primary-600 to-sky-700 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="spmb-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            PPDB ONLINE 2026/2027
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Penerimaan Peserta Didik Baru
          </h2>
          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Selamat datang calon penerus bangsa! Daftarkan putra-putri tercinta di SDN 3 Purwosari, lembaga pendidikan dasar terakreditasi A dengan fasilitas digital modern.
          </p>
        </div>
      </section>

      {/* Info Utama & Kuota */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="spmb-info-kuota">
        {/* Left: General info card */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-primary-600">
            <Info size={22} className="text-accent-500 shrink-0" />
            <h3 className="text-base font-bold text-slate-800">Sekilas Info PPDB</h3>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full" />
          
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="p-4 bg-primary-50 rounded-xl border border-primary-100">
              <p className="font-extrabold text-primary-700">KUOTA PENERIMAAN:</p>
              <p className="text-xl font-black text-slate-800 mt-1">56 Calon Siswa</p>
              <p className="text-[10px] text-slate-400 mt-1">Terbagi dalam 2 Rombongan Belajar (Rombel) Kelas 1.</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="font-extrabold text-emerald-700">BIAYA SEKOLAH:</p>
              <p className="text-xl font-black text-slate-800 mt-1">GRATIS 100%</p>
              <p className="text-[10px] text-slate-400 mt-1">Bebas SPP, uang gedung, dan biaya pendaftaran PPDB.</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <p className="font-extrabold text-orange-700">JALUR PENDAFTARAN:</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">&bull; Zonasi (Bina Lingkungan)</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">&bull; Afirmasi (Keluarga Pra-Sejahtera)</p>
              <p className="text-xs font-semibold text-slate-700 mt-0.5">&bull; Perpindahan Tugas Orang Tua</p>
            </div>
          </div>
        </div>

        {/* Right: Detailed schedule table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xl p-6 sm:p-8">
          <h3 className="text-md sm:text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar size={22} className="text-primary-600" />
            <span>Jadwal Penting Pelaksanaan PPDB 2026</span>
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-medium text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-4 font-bold">Tahap Kegiatan</th>
                  <th className="pb-4 font-bold">Waktu Pelaksanaan</th>
                  <th className="pb-4 text-right font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {spmbConfig.schedule.map((sch, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-bold text-slate-800">
                      <EditableText
                        value={sch.phase}
                        onSave={(val) => handleUpdateSchedule(index, { phase: val })}
                      />
                    </td>
                    <td className="py-4 text-slate-500">
                      <EditableText
                        value={sch.date}
                        onSave={(val) => handleUpdateSchedule(index, { date: val })}
                      />
                    </td>
                    <td className="py-4 text-right">
                      <span className={`px-2.5 py-0.5 font-bold rounded text-[9px] uppercase tracking-wider ${
                        sch.status === 'Sedang Berlangsung'
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        <EditableText
                          value={sch.status}
                          onSave={(val) => handleUpdateSchedule(index, { status: val })}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Persyaratan Dokumen & Alur Pendaftaran */}
      <section className="bg-slate-50 py-16 border-y border-slate-100" id="spmb-steps-requirements">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Requirements list (5/12 width) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <ClipboardList size={22} className="text-primary-600" />
              <span>Persyaratan Dokumen</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium leading-relaxed">
              Persiapkan seluruh dokumen kelengkapan fotokopi berikut sebelum menuju loket pendaftaran fisik/verifikasi di ruang sekretariat panitia:
            </p>
            
            <ul className="space-y-3 font-medium">
              {spmbConfig.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal flex-grow">
                    <EditableText
                      value={req}
                      onSave={(val) => handleUpdateRequirement(index, val)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Step-by-step road map (7/12 width) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Sparkles size={22} className="text-primary-600" />
              <span>Alur Langkah Pendaftaran</span>
            </h3>
            
            <div className="relative border-l-2 border-primary-200 ml-4 pl-6 space-y-8" id="spmb-roadmap">
              {spmbConfig.steps.map((st, index) => (
                <div key={st.step} className="relative group" id={`roadmap-step-${st.step}`}>
                  {/* Step bubble */}
                  <span className="absolute -left-[35px] top-0 w-6.5 h-6.5 rounded-full bg-primary-500 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow shadow-primary-500 group-hover:scale-110 transition-transform">
                    {st.step}
                  </span>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                      <EditableText
                        value={st.title}
                        onSave={(val) => handleUpdateStep(index, { title: val })}
                      />
                    </h4>
                    <div className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-normal">
                      <RichTextEditor
                        htmlValue={st.desc}
                        onSave={(val) => handleUpdateStep(index, { desc: val })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="spmb-faq">
        <SectionTitle 
          title="Tanya Jawab Seputar PPDB" 
          subtitle="Rangkuman jawaban pertanyaan yang sering diajukan oleh calon wali murid baru SDN 3 Purwosari."
        />

        <div className="max-w-3xl mx-auto space-y-3.5" id="faq-accordion-group">
          {spmbConfig.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                id={`faq-item-${index}`}
              >
                {/* FAQ Header */}
                <div
                  className="w-full px-6 py-4.5 text-left flex justify-between items-center font-bold text-slate-800 text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="pr-4 flex-grow">
                    <EditableText
                      value={faq.q}
                      onSave={(val) => handleUpdateFaq(index, { q: val })}
                    />
                  </div>
                  <button 
                    onClick={() => toggleFaq(index)} 
                    className="p-1 hover:bg-slate-100 rounded"
                    aria-label="Toggle FAQ"
                  >
                    {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                  </button>
                </div>
                
                {/* FAQ Content */}
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-50 font-normal animate-fadeIn">
                    <RichTextEditor
                      htmlValue={faq.a}
                      onSave={(val) => handleUpdateFaq(index, { a: val })}
                    />
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
