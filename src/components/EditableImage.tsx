import React, { useState, useRef } from 'react';
import { ImageIcon, Check, X, Camera, Upload } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface EditableImageProps {
  src: string;
  alt: string;
  onSave: (newSrc: string) => void;
  className?: string;
  aspectRatioClassName?: string;
}

const IMAGE_PRESETS = [
  { name: 'Belajar Kelas 1', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Siswa Cerdas', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800' },
  { name: 'Perpustakaan Mewah', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sains Eksperimen', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800' },
  { name: 'Guru Bahagia', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sekolah Modern', url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Upacara Pramuka', url: 'https://images.unsplash.com/photo-1564149504817-d1378368526f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Seni Kreativitas', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800' },
];

export const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  onSave,
  className = '',
  aspectRatioClassName = ''
}) => {
  const { isEditMode } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState(src);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isEditMode) {
    return <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" />;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onSave(urlInput.trim());
      setIsOpen(false);
    }
  };

  const selectPreset = (url: string) => {
    setUrlInput(url);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreviewUrl(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            mimeType: file.type,
            base64Data,
            category: 'foto',
            subcategory: 'general',
            title: alt,
            size: `${Math.round(file.size / 1024)} KB`,
          }),
        });

        const data = await res.json();
        if (res.ok && data.driveUrl) {
          setUrlInput(data.driveUrl);
          setPreviewUrl(data.driveUrl);
        } else {
          alert('Gagal mengunggah gambar: ' + (data.error || 'Unknown error'));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Gagal mengunggah gambar.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmUpload = () => {
    if (previewUrl) {
      onSave(previewUrl);
      setIsOpen(false);
      setPreviewUrl(null);
    }
  };

  return (
    <div className={`relative group ${aspectRatioClassName}`}>
      <img src={src} alt={alt} className={`${className} border-2 border-dashed border-sky-400 group-hover:border-orange-500 transition-colors`} referrerPolicy="no-referrer" />

      <div
        onClick={() => {
          setUrlInput(src);
          setPreviewUrl(null);
          setIsOpen(true);
        }}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 cursor-pointer rounded-lg text-white"
      >
        <div className="p-2.5 bg-orange-500 rounded-full shadow-lg text-white transform scale-90 group-hover:scale-100 transition-transform">
          <Camera size={18} className="stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-black tracking-widest font-mono uppercase bg-orange-600 px-2 py-0.5 rounded">
          GANTI GAMBAR
        </span>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-sky-100 p-5 space-y-4 text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-500 text-white rounded-lg">
                  <ImageIcon size={14} />
                </div>
                <h3 className="text-sm font-black tracking-tight font-display">
                  Pustaka & Pengubah Gambar Visual
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-100 pb-2">
              <button
                onClick={() => setActiveTab('url')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'url' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Link URL
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'upload' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                <span className="flex items-center gap-1"><Upload size={12} /> Unggah File</span>
              </button>
            </div>

            {activeTab === 'url' && (
              <form onSubmit={handleSave} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">
                    Input URL Gambar Kustom
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Masukkan URL gambar Unsplash atau web lain..."
                      className="flex-grow p-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Check size={12} className="stroke-[2.5]" />
                      <span>OKE</span>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">
                    Unggah dari Komputer
                  </label>
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-grow p-2 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  {uploading && (
                    <div className="flex items-center gap-2 text-xs text-orange-600 font-bold mt-2">
                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                      Mengunggah ke Google Drive...
                    </div>
                  )}
                  {previewUrl && (
                    <div className="mt-3 space-y-2">
                      <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-slate-200" />
                      <button
                        onClick={handleConfirmUpload}
                        className="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Check size={12} /> Gunakan Gambar Ini
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'url' && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                  Pilih Dari Template Unsplash Berkualitas Tinggi
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => selectPreset(preset.url)}
                      className={`relative rounded-lg overflow-hidden h-14 border-2 transition-all cursor-pointer ${
                        urlInput === preset.url ? 'border-orange-500 scale-95 shadow-md' : 'border-slate-100 hover:border-slate-300'
                      }`}
                      title={preset.name}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-slate-950/20 hover:bg-transparent transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100 text-[10px] font-black font-mono">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setPreviewUrl(null);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md cursor-pointer"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
