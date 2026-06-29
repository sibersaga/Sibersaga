import React, { useState } from 'react';
import { Search, Download, FileText, CheckCircle2, ShieldCheck, Plus, AlertCircle, Trash2, Calendar, HardDrive } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { PublicDocument } from '../data/schoolData';
import { generateAndDownloadPDF } from '../lib/pdfGenerator';

interface FileDownloadCenterProps {
  initialCategories: string[];
  title?: string;
  subtitle?: string;
}

export const FileDownloadCenter: React.FC<FileDownloadCenterProps> = ({
  initialCategories,
  title = "Pusat Unduhan Dokumen Resmi",
  subtitle = "Unduh salinan berkas pertanggungjawaban, dokumen mutu, serta panduan operasional sekolah dalam format PDF resmi."
}) => {
  const { dokumenTransparansi, updateDokumenTransparansi, isAdmin, isEditMode } = useAdmin();
  
  // State for search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Admin Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState(initialCategories[0] || 'Transparansi');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [newDocSize, setNewDocSize] = useState('1.5 MB');
  const [formError, setFormError] = useState('');

  // Filter documents based on page criteria and user filters
  const pageDocs = dokumenTransparansi.filter(doc => 
    initialCategories.includes(doc.category)
  );

  const filteredDocs = pageDocs.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Download with simulated delay for professional feedback
  const handleDownload = (doc: PublicDocument) => {
    setDownloadingId(doc.id);
    setTimeout(() => {
      generateAndDownloadPDF(doc);
      setDownloadingId(null);
    }, 900);
  };

  // Add dynamic document as Admin
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocDescription.trim()) {
      setFormError('Judul dokumen dan deskripsi ringkas wajib diisi!');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const generatedId = `doc-${Date.now()}`;
    const sanitizedFilename = newDocTitle
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '_')
      .substring(0, 20) + '_Official.pdf';

    const newDocument: PublicDocument = {
      id: generatedId,
      title: newDocTitle.trim(),
      category: newDocCategory as any,
      description: newDocDescription.trim(),
      fileSize: newDocSize,
      dateUploaded: todayStr,
      pdfUrl: sanitizedFilename
    };

    updateDokumenTransparansi([...dokumenTransparansi, newDocument]);
    
    // Reset Form
    setNewDocTitle('');
    setNewDocDescription('');
    setNewDocSize('1.5 MB');
    setFormError('');
    setShowAddForm(false);
  };

  // Delete document as Admin
  const handleDeleteDocument = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dokumen "${title}" dari portal publik?`)) {
      const updated = dokumenTransparansi.filter(doc => doc.id !== id);
      updateDokumenTransparansi(updated);
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-10 space-y-8" id="file-download-center">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Sistem Dokumen Digital
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        {isAdmin && isEditMode && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
            id="admin-add-doc-btn"
          >
            <Plus size={16} />
            <span>Tambah Dokumen</span>
          </button>
        )}
      </div>

      {/* Admin Add Form */}
      {isAdmin && isEditMode && showAddForm && (
        <form onSubmit={handleAddDocument} className="bg-white p-6 rounded-2xl border border-primary-100 shadow-md space-y-4 animate-fadeIn" id="admin-doc-form">
          <h4 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-2">
            Unggah/Tambah Dokumen Publik Baru
          </h4>
          
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle size={14} />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-600">Judul Dokumen</label>
              <input
                type="text"
                placeholder="Contoh: Rencana Kerja Jangka Menengah Sekolah (RKJM)"
                value={newDocTitle}
                onChange={e => setNewDocTitle(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Kategori Dokumen</label>
              <select
                value={newDocCategory}
                onChange={e => setNewDocCategory(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500"
              >
                {initialCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1 md:col-span-3">
              <label className="text-xs font-bold text-slate-600">Ringkasan / Keterangan Dokumen</label>
              <textarea
                placeholder="Jelaskan isi ringkas atau tujuan dari penerbitan berkas ini..."
                rows={2}
                value={newDocDescription}
                onChange={e => setNewDocDescription(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Estimasi Ukuran File</label>
              <select
                value={newDocSize}
                onChange={e => setNewDocSize(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500"
              >
                <option value="980 KB">980 KB</option>
                <option value="1.2 MB">1.2 MB</option>
                <option value="1.8 MB">1.8 MB</option>
                <option value="2.4 MB">2.4 MB</option>
                <option value="3.5 MB">3.5 MB</option>
                <option value="4.1 MB">4.1 MB</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Simpan Dokumen
            </button>
          </div>
        </form>
      )}

      {/* Controls: Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5" id="download-tabs-container">
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              selectedCategory === 'Semua'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Dokumen
          </button>
          {initialCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Cari nama berkas..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:border-primary-500 transition-colors"
          />
          <Search className="absolute left-3 top-3 text-slate-400" size={14} />
        </div>
      </div>

      {/* Document Grid / Table */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="downloadable-docs-grid">
          {filteredDocs.map(doc => {
            const isDownloading = downloadingId === doc.id;
            
            // Custom category styles
            let catStyle = "bg-slate-100 text-slate-700";
            if (doc.category === 'Transparansi') catStyle = "bg-emerald-50 text-emerald-700 border border-emerald-200/50";
            if (doc.category === 'Kurikulum') catStyle = "bg-amber-50 text-amber-700 border border-amber-200/50";
            if (doc.category === 'Layanan Publik') catStyle = "bg-indigo-50 text-indigo-700 border border-indigo-200/50";

            return (
              <div
                key={doc.id}
                id={`download-card-${doc.id}`}
                className="bg-white border border-slate-150 rounded-2xl p-5 hover:border-primary-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
              >
                {/* Admin delete button */}
                {isAdmin && isEditMode && (
                  <button
                    onClick={() => handleDeleteDocument(doc.id, doc.title)}
                    className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Hapus Dokumen"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md ${catStyle}`}>
                      {doc.category}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-slate-400 font-bold font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      <ShieldCheck size={10} className="text-emerald-500" />
                      <span>SHA-256</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-slate-850 leading-snug tracking-tight">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-normal leading-relaxed line-clamp-2">
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      <span>{doc.dateUploaded}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive size={11} />
                      <span>{doc.fileSize}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownload(doc)}
                    disabled={isDownloading}
                    className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer shadow-sm ${
                      isDownloading
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white hover:-translate-y-0.5'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                        <span>Mengunduh...</span>
                      </>
                    ) : (
                      <>
                        <Download size={12} />
                        <span>Unduh PDF</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400 flex flex-col items-center justify-center">
          <FileText size={40} className="mb-3 text-slate-300" />
          <h4 className="text-sm font-bold text-slate-700">Tidak Ada Dokumen</h4>
          <p className="text-xs mt-1 max-w-xs font-normal">
            Tidak ditemukan berkas publik yang cocok dengan kriteria pencarian atau penyaringan kategori Anda.
          </p>
        </div>
      )}
    </div>
  );
};
