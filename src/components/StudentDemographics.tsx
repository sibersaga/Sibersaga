import React from 'react';
import { SectionTitle } from './SectionTitle';
import { ScrollReveal } from './ScrollReveal';
import { Users, User, UserCircle2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const StudentDemographics: React.FC = () => {
  const { studentDemographics } = useAdmin();

  const totalSiswa = studentDemographics.reduce((acc, curr) => acc + curr.total, 0);
  const totalLaki = studentDemographics.reduce((acc, curr) => acc + curr.laki, 0);
  const totalPerempuan = studentDemographics.reduce((acc, curr) => acc + curr.perempuan, 0);

  return (
    <section className="space-y-6" id="student-demographics-section">
      <ScrollReveal duration={600} threshold={0.05}>
        <SectionTitle 
          title="Demografi Siswa" 
          subtitle="Data persebaran siswa per kelas beserta rincian jumlah siswa laki-laki dan perempuan tahun ajaran ini."
        />
      </ScrollReveal>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 md:gap-6 mb-8">
        <ScrollReveal duration={800} delay={100} threshold={0.05}>
          <div className="bg-white border-2 border-sky-100 rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center text-center shadow-md shadow-sky-100/50 hover:border-sky-300 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <Users size={24} className="stroke-[2.5]" />
            </div>
            <p className="text-[10px] md:text-xs font-bold text-sky-600 uppercase tracking-widest">Total Siswa</p>
            <p className="text-2xl md:text-4xl font-black text-slate-800 font-mono mt-1">{totalSiswa}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal duration={800} delay={200} threshold={0.05}>
          <div className="bg-white border-2 border-sky-100 rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center text-center shadow-md shadow-sky-100/50 hover:border-blue-300 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <User size={24} className="stroke-[2.5]" />
            </div>
            <p className="text-[10px] md:text-xs font-bold text-blue-600 uppercase tracking-widest">Laki-laki</p>
            <p className="text-2xl md:text-4xl font-black text-slate-800 font-mono mt-1">{totalLaki}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal duration={800} delay={300} threshold={0.05}>
          <div className="bg-white border-2 border-sky-100 rounded-3xl p-5 md:p-6 flex flex-col items-center justify-center text-center shadow-md shadow-sky-100/50 hover:border-rose-300 hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center mb-3">
              <UserCircle2 size={24} className="stroke-[2.5]" />
            </div>
            <p className="text-[10px] md:text-xs font-bold text-rose-500 uppercase tracking-widest">Perempuan</p>
            <p className="text-2xl md:text-4xl font-black text-slate-800 font-mono mt-1">{totalPerempuan}</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Class Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentDemographics.map((data, index) => {
          const lakiPercentage = Math.round((data.laki / data.total) * 100);
          const perempuanPercentage = Math.round((data.perempuan / data.total) * 100);

          return (
            <ScrollReveal key={index} duration={600} delay={100 * (index + 1)} threshold={0.05}>
              <div className="bg-white border-2 border-sky-100/70 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 group">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black text-slate-800">{data.kelas}</h3>
                  <div className="px-3 py-1 bg-sky-50 text-sky-700 font-bold text-xs rounded-xl border border-sky-100 font-mono">
                    Total: {data.total}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Laki-laki Bar */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
                          <User size={14} className="stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Laki-laki</span>
                      </div>
                      <span className="text-sm font-black text-blue-600 font-mono">{data.laki}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left"
                        style={{ width: `${lakiPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Perempuan Bar */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-rose-50 text-rose-500 flex items-center justify-center">
                          <UserCircle2 size={14} className="stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Perempuan</span>
                      </div>
                      <span className="text-sm font-black text-rose-500 font-mono">{data.perempuan}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left"
                        style={{ width: `${perempuanPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
};
