import React, { useState, useEffect } from 'react';
import { Menu, X, GraduationCap, Search, Settings, Home, Bell, User, LayoutGrid, ArrowUpRight, Compass, FileText, Info } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface NavbarProps {
  currentPage: string;
  onPageChange: (pageId: string) => void;
  onSelectNews?: (newsId: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange, onSelectNews }) => {
  const { 
    schoolConfig, 
    beritaSekolah, 
    kegiatanSekolah, 
    prestasiSekolah, 
    inovasiSekolah, 
    dokumenTransparansi,
    isAdmin
  } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close search on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { id: 'beranda', label: 'Beranda' },
    { id: 'profil', label: 'Profil' },
    { id: 'kegiatan', label: 'Kegiatan' },
    { id: 'berita', label: 'Berita' },
    { id: 'galeri', label: 'Galeri' },
    { id: 'inovasi', label: 'Inovasi' },
    { id: 'transparansi', label: 'Transparansi' },
    { id: 'layanan', label: 'Layanan' },
    { id: 'spmb', label: 'SPMB' }
  ];

  // Dynamic Live Search Logic
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    const results: Array<{
      id: string;
      title: string;
      category: string;
      type: 'berita' | 'kegiatan' | 'prestasi' | 'inovasi' | 'transparansi';
      description?: string;
      meta?: string;
    }> = [];

    // 1. News & Announcements
    beritaSekolah.forEach((item) => {
      if (
        item.title.toLowerCase().includes(query) ||
        item.excerpt.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      ) {
        results.push({
          id: item.id,
          title: item.title,
          category: `Berita - ${item.category}`,
          type: 'berita',
          description: item.excerpt,
          meta: item.date
        });
      }
    });

    // 2. Activities
    kegiatanSekolah.forEach((item) => {
      if (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      ) {
        results.push({
          id: item.id,
          title: item.title,
          category: `Kegiatan - ${item.category}`,
          type: 'kegiatan',
          description: item.description,
          meta: item.schedule
        });
      }
    });

    // 3. Achievements
    prestasiSekolah.forEach((item) => {
      if (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.winner.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      ) {
        results.push({
          id: item.id,
          title: item.title,
          category: `Prestasi ${item.year}`,
          type: 'prestasi',
          description: item.description,
          meta: `Juara: ${item.winner} (${item.level})`
        });
      }
    });

    // 4. Innovations
    inovasiSekolah.forEach((item) => {
      if (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.slogan.toLowerCase().includes(query)
      ) {
        results.push({
          id: item.id,
          title: item.title,
          category: 'Inovasi Sekolah',
          type: 'inovasi',
          description: item.description,
          meta: item.slogan
        });
      }
    });

    // 5. Transparansi Dokumen
    dokumenTransparansi.forEach((item) => {
      if (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      ) {
        results.push({
          id: item.id,
          title: item.title,
          category: `Dokumen - ${item.category}`,
          type: 'transparansi',
          description: item.description,
          meta: `${item.fileSize} • Diunggah: ${item.dateUploaded}`
        });
      }
    });

    return results;
  };

  const searchResults = getSearchResults();

  const handleResultClick = (res: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    
    if (res.type === 'berita') {
      if (onSelectNews) {
        onSelectNews(res.id);
      } else {
        onPageChange('berita');
      }
    } else {
      onPageChange(res.type);
    }
  };

  const mobileNavItems = [
    { id: 'beranda', label: 'HOME', icon: Home },
    { id: 'search', label: 'SEARCH', icon: Search },
    { id: 'berita', label: 'INFO', icon: Bell },
    { id: 'profil', label: 'PROFILE', icon: User },
    { id: 'menu', label: 'MENU', icon: LayoutGrid }
  ];

  const getMobileActiveState = (id: string) => {
    if (id === 'search') return isSearchOpen;
    if (id === 'menu') return isOpen || !['beranda', 'berita', 'profil', 'admin-panel'].includes(currentPage);
    return currentPage === id;
  };

  return (
    <>
      <header className="sticky top-0 xl:top-4 z-50 w-full xl:max-w-7xl mx-auto xl:px-8 xl:mb-4 transition-all duration-300" id="main-header">
        {/* Main Navbar Desktop & Mobile Top */}
        <div className="bg-white/90 backdrop-blur-lg shadow-sm xl:shadow-lg xl:rounded-full border-b xl:border border-sky-100 pt-[env(safe-area-inset-top)] xl:pt-0">
          <div className="px-4 sm:px-6 xl:px-8">
            <div className="flex justify-between h-16 xl:h-20 items-center">
              {/* Logo & School Name */}
              <div 
                className="flex items-center space-x-3 cursor-pointer select-none group" 
                onClick={() => onPageChange('beranda')}
                id="navbar-logo"
              >
                <div className="w-11 h-11 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center p-1 group-hover:scale-105 group-hover:shadow-md transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-sky-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Logo_Tut_Wuri_Handayani.png" alt="Logo SD" className="w-full h-full object-contain relative z-10 drop-shadow-sm group-hover:drop-shadow transition-all duration-300" />
                </div>
                <div className="flex flex-col justify-center relative">
                  <h1 className="text-lg xl:text-xl font-black tracking-tight leading-none">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-700 group-hover:from-sky-600 group-hover:to-blue-600 transition-all duration-300">
                      {schoolConfig.shortName}
                    </span>
                  </h1>
                  <div className="h-0.5 w-0 bg-gradient-to-r from-sky-400 to-blue-500 group-hover:w-full transition-all duration-500 ease-out mt-1 rounded-full opacity-0 group-hover:opacity-100" />
                </div>
              </div>

              {/* Desktop Links & Search Icon */}
              <div className="hidden xl:flex items-center space-x-2" id="desktop-nav-and-search">
                <nav className="flex items-center space-x-1 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100/50" id="desktop-nav">
                  {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`nav-link-${item.id}`}
                        onClick={() => onPageChange(item.id)}
                        className={`px-4 py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                          isActive
                            ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                            : 'text-slate-600 hover:bg-white hover:text-sky-600 hover:scale-105 hover:shadow-sm'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>

                {/* Separator */}
                <span className="h-8 w-px bg-slate-200 block mx-3" />

                {/* Desktop Search Button */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-3 text-slate-500 hover:text-sky-600 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all hover:scale-105 bg-white border border-slate-100 shadow-sm"
                  aria-label="Cari Informasi"
                  id="search-button-desktop"
                >
                  <Search size={18} className="stroke-[2.5]" />
                </button>

                {isAdmin && (
                  <button
                    onClick={() => onPageChange('admin-panel')}
                    className={`p-3 rounded-2xl cursor-pointer transition-all shadow-sm hover:scale-105 border ml-1 ${currentPage === 'admin-panel' ? 'bg-sky-500 text-white border-sky-500 shadow-sky-500/20' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50 border-slate-100 bg-white'}`}
                    aria-label="Panel Admin"
                    title="Panel Admin"
                  >
                    <Settings size={18} className="stroke-[2.5]" />
                  </button>
                )}
              </div>

              {/* Mobile Admin Icon (Right side top header) */}
              <div className="xl:hidden flex items-center space-x-1.5">
                {isAdmin && (
                  <button
                    onClick={() => { setIsOpen(false); onPageChange('admin-panel'); }}
                    className={`p-2 rounded-xl cursor-pointer transition-all border shadow-sm ${currentPage === 'admin-panel' ? 'bg-sky-500 text-white border-sky-500 shadow-sky-500/20' : 'text-slate-500 hover:text-sky-600 hover:bg-slate-50 border-slate-100 bg-white'}`}
                    aria-label="Panel Admin"
                  >
                    <Settings size={18} className="stroke-[2.5]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel (Slide down from top header) */}
        {isOpen && (
          <div className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-sky-100 shadow-xl max-h-[80vh] overflow-y-auto animate-fadeIn fixed w-full left-0 z-40" id="mobile-nav">
            <div className="px-4 pt-6 pb-12 space-y-1.5">
              <div className="flex justify-between items-center px-2 mb-4">
                <h3 className="text-xs font-black text-slate-400 tracking-widest uppercase">Semua Menu</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg">
                  <X size={16} className="stroke-[2.5]" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`mobile-nav-link-${item.id}`}
                      onClick={() => {
                        onPageChange(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        isActive
                          ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-sky-600 border border-transparent hover:border-slate-100 bg-slate-50/50'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Bottom Nav for Mobile */}
      <div className="xl:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 px-3 py-2 flex justify-between items-center z-[60] pb-[env(safe-area-inset-bottom)]">
        {mobileNavItems.map((item) => {
          const isActive = getMobileActiveState(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'search') {
                  setIsSearchOpen(true);
                  setIsOpen(false);
                } else if (item.id === 'menu') {
                  setIsOpen(!isOpen);
                  setIsSearchOpen(false);
                } else {
                  onPageChange(item.id);
                  setIsOpen(false);
                  setIsSearchOpen(false);
                }
              }}
              className="relative flex flex-col items-center justify-end w-[20%] h-14 pb-1 group"
            >
              {isActive ? (
                <>
                  <div className="absolute -top-6 w-[3.2rem] h-[3.2rem] bg-sky-500 rounded-full shadow-lg shadow-sky-500/30 flex items-center justify-center z-10 transition-all duration-300 transform scale-100 animate-bounce-short border-4 border-[#f8fafc]">
                    <div className="absolute -top-1.5 w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                    <item.icon size={22} className="text-white stroke-[2.5]" />
                  </div>
                  <span className="text-[9px] font-black tracking-wider text-sky-600 transition-all duration-300 mt-8 leading-none">
                    {item.label}
                  </span>
                </>
              ) : (
                <>
                  <item.icon size={22} className="text-slate-400 mb-1.5 transition-all duration-300 group-hover:text-slate-600 group-hover:-translate-y-1" />
                  <span className="text-[9px] font-bold tracking-wider text-slate-400 transition-all duration-300 leading-none">
                    {item.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Premium Search Modal Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center p-4 pt-[10vh]"
          id="search-overlay"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-sky-100 overflow-hidden flex flex-col h-fit max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
            id="search-modal-container"
          >
            {/* Header / Input row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <Search size={20} className="text-slate-400 stroke-[2.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita, pengumuman, prestasi, kegiatan, inovasi..."
                className="flex-grow bg-transparent text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 w-full"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors uppercase tracking-widest font-mono"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Results or Suggestions */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {!searchQuery ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">
                      Topik Terpopuler
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { q: 'PPDB', label: 'PPDB Online' },
                        { q: 'DITALI RAPIA', label: 'DITALI RAPIA' },
                        { q: 'GEMARI', label: 'GEMARI Literasi' },
                        { q: 'RKAS', label: 'RKAS & BOS' },
                        { q: 'Sains', label: 'Cerdas Cermat' },
                        { q: 'Adiwiyata', label: 'Taman Adiwiyata' }
                      ].map((tag) => (
                        <button
                          key={tag.q}
                          onClick={() => setSearchQuery(tag.q)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-600 font-bold text-xs rounded-xl border border-slate-100 transition-all cursor-pointer"
                        >
                          #{tag.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 font-mono">
                      Butuh Bantuan?
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Ketikkan kata kunci pencarian Anda di atas. Anda bisa mencari dokumen RKAS, berita kegiatan terbaru, profil guru, inovasi pendidikan, atau detail prosedur pendaftaran siswa baru.
                    </p>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1 pb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">
                      Hasil Pencarian ({searchResults.length})
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    {searchResults.map((res) => (
                      <div
                        key={`${res.type}-${res.id}`}
                        onClick={() => handleResultClick(res)}
                        className="p-4 hover:bg-orange-50/50 cursor-pointer transition-all flex justify-between items-start gap-4 group"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-sky-50 text-sky-700 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono border border-sky-100 group-hover:bg-orange-100 group-hover:text-orange-700 group-hover:border-orange-200 transition-colors">
                              {res.category}
                            </span>
                            {res.meta && (
                              <span className="text-[10px] text-slate-400 font-medium font-mono truncate">
                                {res.meta}
                              </span>
                            )}
                          </div>
                          <h5 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-orange-600 transition-colors line-clamp-1">
                            {res.title}
                          </h5>
                          {res.description && (
                            <p className="text-xs text-slate-500 font-semibold line-clamp-1 leading-normal">
                              {res.description}
                            </p>
                          )}
                        </div>
                        <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-orange-500 text-slate-400 group-hover:text-white transition-all shrink-0">
                          <Search size={14} className="stroke-[2.5]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <div className="text-slate-300 flex justify-center">
                    <Search size={40} className="stroke-[1.5]" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    Tidak menemukan hasil untuk "{searchQuery}"
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Coba periksa ejaan Anda atau gunakan kata kunci lain seperti "PPDB", "RKAS", "Kegiatan", atau "BOS".
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 font-bold font-mono flex justify-between items-center">
              <span>Tekan ESC atau Klik di luar untuk menutup</span>
              <span className="text-slate-500 font-black">Sistem SDN 3 Purwosari</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

