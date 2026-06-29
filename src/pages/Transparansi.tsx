import React from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { DocumentViewer } from '../components/DocumentViewer';
import { FileDownloadCenter } from '../components/FileDownloadCenter';
import { useAdmin } from '../context/AdminContext';
import { ShieldCheck, HelpCircle } from 'lucide-react';

export const Transparansi: React.FC = () => {
  const { dokumenTransparansi } = useAdmin();
  const transparencyDocs = dokumenTransparansi.filter((doc) => doc.category === 'Transparansi');

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="transparansi-page">
      {/* Jumbotron */}
      <section className="bg-gradient-to-br from-primary-600 to-sky-700 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="transparansi-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Keterbukaan Informasi Publik
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Transparansi & Akuntabilitas Dana
          </h2>
          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl mx-auto leading-relaxed">
            Wujud integritas dan tanggung jawab SDN 3 Purwosari dalam mempublikasikan Rencana Kegiatan Sekolah (RKAS) serta laporan realisasi dana Bantuan Operasional Sekolah (BOS).
          </p>
        </div>
      </section>

      {/* Main Document Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="transparansi-document-hub">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-10 space-y-8">
          <div>
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Pusat Unduhan Dokumen Anggaran Resmi</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1">
              Rencana Kegiatan & Laporan Realisasi BOS
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Silakan klik nama berkas pada daftar sebelah kiri untuk membuka isi pratinjau lembaran dokumen resmi secara online dan interaktif.
            </p>
          </div>

          <DocumentViewer documents={transparencyDocs} />
        </div>
      </section>

      {/* Dedicated File Download Center */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="transparansi-download-section">
        <FileDownloadCenter
          initialCategories={['Transparansi']}
          title="Pusat Unduhan Laporan BOS & RKAS"
          subtitle="Unduh dokumen pertanggungjawaban dana Bantuan Operasional Sekolah (BOS) reguler & kinerja serta rincian rencana kegiatan sekolah secara utuh."
        />
      </section>

      {/* Trust & Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="transparansi-guarantee">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.1),transparent)] pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <h3 className="text-lg sm:text-2xl font-black">
              Komitmen Pengelolaan Bersih & Jujur
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              SD Negeri 3 Purwosari menjamin pengelolaan seluruh dana bantuan pemerintah (BOS Reguler maupun BOS Kinerja) dilaksanakan dengan prinsip **transparan, efektif, efisien, akuntabel, dan bebas dari praktik KKN**. Seluruh laporan diverifikasi berjenjang oleh Komite Sekolah, Pengawas Bina Dinas Pendidikan, serta Inspektorat Kabupaten Wonogiri.
            </p>
          </div>
          <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-center space-y-3 relative z-10">
            <h4 className="text-sm font-bold text-accent-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={16} />
              <span>Butuh Klarifikasi Anggaran?</span>
            </h4>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Jika Anda sebagai warga masyarakat atau wali murid membutuhkan informasi tambahan yang belum tercantum di halaman transparansi, Anda dapat mengirimkan formulir permohonan ke ruang sekretariat humas sekolah.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
