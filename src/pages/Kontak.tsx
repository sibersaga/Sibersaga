import React from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { ContactForm } from '../components/ContactForm';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from '../components/EditableText';
import { MapPin, Phone, Mail, Clock, HelpCircle } from 'lucide-react';

export const Kontak: React.FC = () => {
  const { schoolConfig, updateSchoolConfig } = useAdmin();

  return (
    <div className="space-y-16 py-8 animate-fadeIn" id="kontak-page">
      {/* Jumbotron */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center relative" id="kontak-jumbotron">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.15),transparent)] pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="text-xs bg-accent-500 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
            Hubungi Kami
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Layanan Komunikasi Hub
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Butuh konsultasi, informasi pendaftaran, atau ingin menjalin kerja sama? Silakan hubungi sekretariat kami melalui kontak tertera atau kunjungi alamat fisik kami.
          </p>
        </div>
      </section>

      {/* Main Layout Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="kontak-main-grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: Contact Info Card (5/12 width) */}
          <div className="lg:col-span-5 space-y-8" id="kontak-info-pane">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-extrabold text-slate-800">Sekretariat Sekolah</h3>
              <div className="w-12 h-1 bg-accent-500 rounded-full" />
              
              <ul className="space-y-5 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-sm shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-700 uppercase tracking-wide">Alamat Fisik</h4>
                    <div className="text-slate-500 font-normal leading-relaxed mt-1">
                      <EditableText
                        value={schoolConfig.alamat}
                        onSave={(val) => updateSchoolConfig({ alamat: val })}
                      />
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-sm shrink-0 mt-0.5">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-700 uppercase tracking-wide">Nomor Telepon</h4>
                    <div className="text-slate-500 font-normal leading-relaxed mt-1">
                      <EditableText
                        value={schoolConfig.telepon}
                        onSave={(val) => updateSchoolConfig({ telepon: val })}
                      />
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-sm shrink-0 mt-0.5">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-700 uppercase tracking-wide">Surat Elektronik</h4>
                    <div className="text-slate-500 font-normal leading-relaxed mt-1 break-all">
                      <EditableText
                        value={schoolConfig.email}
                        onSave={(val) => updateSchoolConfig({ email: val })}
                      />
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-3 bg-primary-50 text-primary-600 rounded-xl shadow-sm shrink-0 mt-0.5">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-700 uppercase tracking-wide">Jam Operasional Kantor</h4>
                    <p className="text-slate-500 font-normal leading-relaxed mt-1">
                      Senin - Sabtu: Pukul 07.00 - 13.00 WIB
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Info Hint */}
            <div className="p-5 bg-gradient-to-r from-primary-500 to-sky-600 text-white rounded-3xl shadow-md space-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.15),transparent)]" />
              <div className="flex gap-3 items-start relative z-10">
                <HelpCircle size={20} className="text-accent-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pelayanan Ramah & Responsif</h4>
                  <p className="text-[11px] text-slate-100 font-normal leading-relaxed mt-1">Saran dan konsultasi di luar jam operasional kantor sekolah akan direspons oleh tim Humas secara berkala via Email/WhatsApp.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Reusable Contact Form (7/12 width) */}
          <div className="lg:col-span-7" id="kontak-form-pane">
            <ContactForm sectionTitle="Kirim Pesan atau Pertanyaan" />
          </div>

        </div>
      </section>

      {/* Interactive Google Maps Iframe */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" id="kontak-map-section">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-4">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-accent-500" />
              <h4 className="text-sm font-bold text-slate-800">Peta Lokasi Google Maps SDN 3 Purwosari</h4>
            </div>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] text-primary-600 font-bold hover:underline"
            >
              Buka di Tab Baru &rsaquo;
            </a>
          </div>
          <div className="aspect-[21/9] w-full min-h-[300px] bg-slate-100">
            <iframe
              src={schoolConfig.gmapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SDN 3 Purwosari Map"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
