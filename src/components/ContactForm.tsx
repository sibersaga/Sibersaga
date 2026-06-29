import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface ContactFormProps {
  sectionTitle?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ sectionTitle = "Kirim Pesan ke Admin Sekolah" }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Pertanyaan Umum',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submissions, setSubmissions] = useState<typeof formData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      setStatus('error');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/submit-complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirimkan pengaduan.');
      }

      const resData = await response.json();
      setIsLoading(false);
      setStatus('success');
      setSubmissions([formData, ...submissions]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Pertanyaan Umum',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl p-6 sm:p-8" id="contact-form-component">
      <h3 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
        <Send size={22} className="text-primary-600 shrink-0" />
        <span>{sectionTitle}</span>
      </h3>

      {status === 'success' && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-3 animate-fadeIn" id="success-alert">
          <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-sm">Pesan Berhasil Dikirim!</h4>
            <p className="text-xs text-emerald-600 mt-1">
              Terima kasih. Pesan Anda telah diterima oleh bagian Tata Usaha SDN 3 Purwosari. Kami akan memproses dan menghubungi Anda segera melalui Email atau Telepon.
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-3 animate-fadeIn" id="error-alert">
          <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-sm">Gagal Mengirim Pesan!</h4>
            <p className="text-xs text-rose-600 mt-1">
              Silakan isi semua bidang wajib seperti Nama Lengkap dan Isi Pesan Anda secara benar sebelum mengirim kembali.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" id="school-contact-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Lengkap <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nomor Telepon/WA
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contoh: 081234567xxx"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Alamat Email <span className="text-slate-400">(Opsional)</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Contoh: budi@mail.com"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Subjek Pesan
          </label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-colors font-medium"
          >
            <option value="Pertanyaan Umum">Pertanyaan Umum / Konsultasi</option>
            <option value="PPDB / SPMB">Penerimaan Siswa Baru (PPDB)</option>
            <option value="Pengaduan Layanan">Pengaduan Layanan Sekolah</option>
            <option value="Kritik & Saran">Kritik, Saran, & Apresiasi</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Isi Pesan / Pengaduan <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tuliskan pesan, pertanyaan, atau keluhan Anda secara sopan..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 focus:bg-white transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-sky-600 hover:from-primary-700 hover:to-sky-700 text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/30 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin" size={18} />
              <span>Mengirimkan Pesan...</span>
            </>
          ) : (
            <>
              <span>Kirim Sekarang</span>
              <Send size={18} className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
            </>
          )}
        </button>
      </form>

      {/* Real-time simulated outbox inside preview so they can check their messages instantly */}
      {submissions.length > 0 && (
        <div className="mt-8 border-t border-slate-100 pt-6" id="simulated-outbox">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
            Pesan Terkirim Sesi Ini (Simulasi Lokal):
          </h4>
          <div className="space-y-3">
            {submissions.map((sub, idx) => (
              <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>{sub.name}</span>
                  <span className="text-accent-600 bg-accent-50 px-2 py-0.5 rounded text-[9px]">{sub.subject}</span>
                </div>
                <p className="text-slate-500 mt-1 font-normal line-clamp-2">{sub.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
