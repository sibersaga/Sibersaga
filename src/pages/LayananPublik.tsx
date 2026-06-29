import React from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { DocumentViewer } from '../components/DocumentViewer';
import { FileDownloadCenter } from '../components/FileDownloadCenter';
import { ContactForm } from '../components/ContactForm';
import { Workspace } from './Workspace';
import { EditableText } from '../components/EditableText';
import { useAdmin } from '../context/AdminContext';
import { 
  ShieldAlert, 
  ExternalLink, 
  Globe, 
  HelpCircle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Database, 
  LayoutGrid, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const LayananPublik: React.FC = () => {
  const { dokumenTransparansi, schoolConfig, updateSchoolConfig } = useAdmin();
  const publicDocs = dokumenTransparansi.filter((doc) => doc.category === 'Layanan Publik' || doc.category === 'Kurikulum');

  return (
    <div className="space-y-12 py-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="portal-sibersaga-page">
      {/* Dynamic Jumbotron Header */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl overflow-hidden py-14 px-6 sm:px-12 text-center relative border border-indigo-950/40 shadow-xl" id="portal-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(99,102,241,0.05)_10%,transparent_90%)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs bg-indigo-500/20 text-indigo-300 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-500/30">
            <Sparkles size={12} className="text-indigo-400 animate-pulse" />
            Portal Hubungan Publik Satu Pintu (Sistem SDN 3 Purwosari)
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Pusat Layanan, Kontak & Integrasi Cloud
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Menyediakan standar operasional prosedur, panduan kurikulum belajar, layanan aspirasi terintegrasi, serta dashboard Workspace Cloud SDN 3 Purwosari.
          </p>
        </div>
      </section>

      {/* Grid Highlights Menu (Interactive Bento Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="portal-highlights-grid">
        <a href="#layanan-publik-anchor" className="bg-white hover:bg-slate-50 border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} />
            </div>
            <h4 className="text-md font-black text-slate-800">1. Layanan Publik & SOP</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Buka standar operasional pelayanan, berkas regulasi, dan kurikulum terbuka resmi sekolah.</p>
          </div>
          <span className="text-[11px] text-sky-600 font-bold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Lihat Dokumen & SOP &rarr;</span>
        </a>

        <a href="#hubungi-kami-anchor" className="bg-white hover:bg-slate-50 border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </div>
            <h4 className="text-md font-black text-slate-800">2. Kontak & Aspirasi Digital</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Hubungi sekretariat, cari koordinat Google Maps, atau kirim aduan & saran langsung.</p>
          </div>
          <span className="text-[11px] text-indigo-600 font-bold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Hubungi Kami & Peta &rarr;</span>
        </a>

        <a href="#workspace-anchor" className="bg-white hover:bg-slate-50 border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h4 className="text-md font-black text-slate-800">3. Integrasi Sistem SDN 3 Purwosari Workspace</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Konektivitas cloud dengan Google Drive, Sheets, Gmail, Forms, dan Google Docs.</p>
          </div>
          <span className="text-[11px] text-amber-600 font-bold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Masuk & Atur Cloud &rarr;</span>
        </a>
      </div>

      {/* Full-width Section: LAYANAN PUBLIK & REGULASI */}
      <div className="space-y-10" id="layanan-publik-anchor">
        {/* Section Title */}
        <div>
          <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Bagian 1: Pelayanan Informasi Publik
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            SOP, Regulasi & Kurikulum Merdeka
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium max-w-3xl">
            Transparansi pelayanan sekolah dengan dokumen panduan resmi yang dapat diakses secara digital.
          </p>
        </div>

        {/* SIPPN KemenpanRB Banner */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 font-bold rounded text-[9px] uppercase tracking-wider inline-block">
              SIPPN PAN-RB RI
            </span>
            <h4 className="text-sm font-black text-slate-800">
              Terdaftar di Pelayanan Publik Nasional
            </h4>
            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Unit pelayanan sekolah terintegrasi resmi dengan SIPPN PAN-RB Kemenpan-RB Republik Indonesia.
            </p>
          </div>
          <a
            href="https://sippn.menpan.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-transform hover:-translate-y-0.5 cursor-pointer shrink-0"
            id="sippn-banner-btn"
          >
            <Globe size={13} className="text-sky-400" />
            <span>Cek SIPPN</span>
            <ExternalLink size={11} />
          </a>
        </div>

        {/* SOP preview */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <h4 className="text-sm font-black text-slate-800">Pratinjau Dokumen & Standar Operasional</h4>
          </div>
          <DocumentViewer documents={publicDocs} />
        </div>

        {/* File Download Center */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6">
          <FileDownloadCenter
            initialCategories={['Layanan Publik', 'Kurikulum']}
            title="Pusat Unduhan SOP & Kurikulum Resmi"
            subtitle="Silakan unduh dokumen panduan format PDF untuk dibaca secara offline."
          />
        </div>
      </div>

      {/* Full-width Section: HUBUNGI KAMI & ASPIRASI */}
      <div className="space-y-10 pt-8 border-t border-slate-200/80" id="hubungi-kami-anchor">
        {/* Section Title */}
        <div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Bagian 2: Layanan Aspirasi & Sekretariat
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            Hubungi Sekretariat Kami
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium max-w-3xl">
            Sampaikan pengaduan, kritik, konsultasi, atau kunjungi alamat fisik kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            {/* Sekretariat Contact Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-6 h-full">
              <h4 className="text-sm font-black text-slate-800">Informasi Sekretariat Sekolah</h4>
              <div className="w-10 h-0.5 bg-indigo-500 rounded-full" />

              <ul className="space-y-4 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider">Alamat Fisik</h5>
                    <div className="text-slate-500 font-normal leading-relaxed mt-1 text-xs">
                      <EditableText
                        value={schoolConfig.alamat}
                        onSave={(val) => updateSchoolConfig({ alamat: val })}
                      />
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider">Telepon Kantor</h5>
                    <div className="text-slate-500 font-normal leading-relaxed mt-1 text-xs">
                      <EditableText
                        value={schoolConfig.telepon}
                        onSave={(val) => updateSchoolConfig({ telepon: val })}
                      />
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider">Alamat Surel (Email)</h5>
                    <div className="text-slate-500 font-normal leading-relaxed mt-1 break-all text-xs">
                      <EditableText
                        value={schoolConfig.email}
                        onSave={(val) => updateSchoolConfig({ email: val })}
                      />
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <Clock size={16} />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider">Jam Pelayanan</h5>
                    <p className="text-slate-500 font-normal leading-relaxed mt-1 text-xs">
                      Senin - Sabtu: Pukul 07.00 - 13.00 WIB
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Contact & Complaint Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 h-full">
              <ContactForm sectionTitle="Formulir Aspirasi & Pengaduan Digital" />
            </div>
          </div>
        </div>

        {/* Interactive Google Map Embed */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden p-4">
          <div className="px-2 py-2 border-b border-slate-100 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-indigo-500" />
              <h4 className="text-xs font-bold text-slate-800">Peta Google Maps Resmi</h4>
            </div>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-indigo-600 font-bold hover:underline"
            >
              Tab Baru &rsaquo;
            </a>
          </div>
          <div className="aspect-[21/9] sm:aspect-[3/1] w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
            <iframe
              src={schoolConfig.gmapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="School Google Map Embed"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Sistem SDN 3 Purwosari CLOUD INTEGRATION SYSTEM (Grid Span 12 - Full Width) */}
      <section className="border-t border-slate-200/80 pt-12 space-y-6" id="workspace-anchor">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Bagian 3: Cloud Integrasi Sistem SDN 3 Purwosari
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
            Pusat Integrasi Sistem SDN 3 Purwosari Workspace
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
            Sistem Informasi Bersama Google Apps (Sistem SDN 3 Purwosari). Memfasilitasi guru & staf pengarsipan dinas dengan koneksi langsung ke Google Cloud.
          </p>
        </div>

        {/* Embedded Workspace Component inside a styled glass container */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200/60 p-2 sm:p-4 shadow-inner">
          <Workspace isEmbedded={true} />
        </div>
      </section>
    </div>
  );
};
