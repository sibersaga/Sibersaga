import React, { useState } from 'react';
import { FileText, Download, Calendar, HardDrive, Eye, ExternalLink, RefreshCw } from 'lucide-react';
import { PublicDocument } from '../data/schoolData';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from './EditableText';
import { RichTextEditor } from './RichTextEditor';
import { generateAndDownloadPDF } from '../lib/pdfGenerator';

interface DocumentViewerProps {
  documents: PublicDocument[];
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ documents }) => {
  const { dokumenTransparansi, updateDokumenTransparansi } = useAdmin();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(documents[0]?.id || null);
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(false);

  // Resolve document dynamically from state
  const liveDocs = documents.map(doc => {
    const liveDoc = dokumenTransparansi.find(d => d.id === doc.id);
    return liveDoc || doc;
  });

  const selectedDoc = liveDocs.find(d => d.id === selectedDocId) || null;

  const handleSelectDoc = (doc: PublicDocument) => {
    setIsSimulatingLoad(true);
    setSelectedDocId(doc.id);
    setTimeout(() => {
      setIsSimulatingLoad(false);
    }, 600);
  };

  const handleUpdate = (id: string, updatedFields: Partial<PublicDocument>) => {
    const updated = dokumenTransparansi.map((doc) =>
      doc.id === id ? { ...doc, ...updatedFields } : doc
    );
    updateDokumenTransparansi(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="document-viewer-container">
      {/* Left side: Document List (4/12 width on large screens) */}
      <div className="lg:col-span-5 space-y-4" id="document-list-pane">
        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <FileText size={20} className="text-primary-600" />
          <span>Daftar Dokumen Publik Resmi</span>
        </h3>
        
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2" id="documents-inner-list">
          {liveDocs.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <div
                key={doc.id}
                id={`doc-item-${doc.id}`}
                onClick={() => handleSelectDoc(doc)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer text-left flex items-start gap-4 ${
                  isSelected
                    ? 'bg-primary-50 border-primary-300 shadow-sm'
                    : 'bg-white border-slate-100 hover:border-primary-200 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-lg shrink-0 ${
                  isSelected ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <FileText size={20} />
                </div>
                
                <div className="flex-grow min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {doc.category}
                  </span>
                  
                  <h4 className="text-sm font-bold text-slate-800 mt-1.5 line-clamp-2 leading-snug">
                    {doc.title}
                  </h4>
                  
                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{doc.dateUploaded}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive size={12} />
                      <span>{doc.fileSize}</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Elegant Interactive Simulated PDF Viewer (7/12 width) */}
      <div className="lg:col-span-7 flex flex-col h-full" id="document-viewer-pane">
        {selectedDoc ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden flex flex-col h-full">
             {/* Viewer Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                  Pratinjau Dokumen ({selectedDoc.category})
                </span>
                <h3 className="text-base font-bold text-slate-800 max-w-sm sm:max-w-md">
                  <EditableText
                    value={selectedDoc.title}
                    onSave={(val) => handleUpdate(selectedDoc.id, { title: val })}
                  />
                </h3>
              </div>
              <button
                onClick={() => {
                  generateAndDownloadPDF(selectedDoc);
                }}
                id={`download-btn-${selectedDoc.id}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white text-xs font-bold rounded-lg transition-colors shadow-md cursor-pointer shrink-0"
              >
                <Download size={14} />
                <span>Unduh PDF</span>
              </button>
            </div>

            {/* Simulated Interactive Document Body */}
            <div className="flex-grow aspect-[4/5] bg-slate-800 p-6 flex flex-col items-center justify-center relative min-h-[450px]">
              {isSimulatingLoad ? (
                <div className="flex flex-col items-center justify-center text-slate-400 animate-pulse">
                  <RefreshCw size={40} className="animate-spin text-primary-400 mb-3" />
                  <p className="text-sm font-medium">Membuka dokumen aman...</p>
                </div>
              ) : (
                <div className="w-full h-full max-w-2xl bg-white rounded-lg shadow-2xl p-8 sm:p-12 overflow-y-auto flex flex-col justify-between">
                  {/* Real-looking PDF Header */}
                  <div className="border-b-2 border-slate-900 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
                          SD
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 tracking-wide">
                            PEMERINTAH KABUPATEN PASURUAN
                          </h4>
                          <h5 className="text-[10px] font-semibold text-slate-500">
                            DINAS PENDIDIKAN DAN KEBUDAYAAN
                          </h5>
                          <h3 className="text-sm font-extrabold text-slate-950">
                            SD NEGERI 3 PURWOSARI
                          </h3>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          DOKUMEN PUBLIK
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PDF Content Details */}
                  <div className="my-8 flex-grow">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-950 text-center uppercase tracking-wide mb-6">
                      <EditableText
                        value={selectedDoc.title}
                        onSave={(val) => handleUpdate(selectedDoc.id, { title: val })}
                      />
                    </h2>
                    <div className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-4">
                      <RichTextEditor
                        htmlValue={selectedDoc.description}
                        onSave={(val) => handleUpdate(selectedDoc.id, { description: val })}
                      />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
                      Disclaimer: Salinan berkas ini disediakan secara resmi oleh Unit Layanan Transparansi Publik SD Negeri 3 Purwosari. Segala bentuk penyalahgunaan dokumen tanpa izin dapat ditindaklanjuti sesuai peraturan perundang-undangan keterbukaan informasi publik yang berlaku.
                    </p>
                  </div>

                  {/* PDF Footer / Sign-off */}
                  <div className="border-t border-slate-100 pt-6 flex justify-between items-end text-[10px] text-slate-400 font-medium">
                    <div>
                      <p>Diunggah: {selectedDoc.dateUploaded}</p>
                      <p>Ukuran: {selectedDoc.fileSize}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-700">Kepala Sekolah</p>
                      <p className="mt-6 text-slate-800 font-semibold underline">Suhartono, S.Pd., M.Pd.</p>
                      <p className="text-[9px]">NIP. 19740512 199903 1 005</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400 flex flex-col items-center justify-center h-full">
            <FileText size={48} className="mb-4 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-700">Pilih Dokumen</h3>
            <p className="text-sm mt-1 max-w-xs font-normal">
              Silakan pilih salah satu dokumen di daftar sebelah kiri untuk melihat isi pratinjau secara interaktif.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
