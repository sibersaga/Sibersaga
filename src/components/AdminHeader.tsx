import React from 'react';
import { Shield, Eye, Edit3, RotateCcw, LogOut } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const AdminHeader: React.FC = () => {
  const { isAdmin, isEditMode, setEditMode, logout, resetToDefault } = useAdmin();

  if (!isAdmin) return null;

  return (
    <div 
      className="w-full bg-slate-900 border-b border-orange-500/30 text-white py-2.5 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono relative z-[60] shadow-md animate-fade-in"
      id="admin-bar-wrapper"
    >
      <div className="flex items-center gap-2">
        <div className="p-1 bg-orange-500 rounded-lg text-white animate-pulse">
          <Shield size={14} className="stroke-[2.5]" />
        </div>
        <div className="space-y-0.5">
          <p className="font-black text-orange-400 tracking-wide uppercase">
            Mode Admin Aktif
          </p>
          <p className="text-[10px] text-slate-400 font-semibold leading-none">
            Gunakan mode WYSIWYG untuk mengedit semua teks & gambar langsung di halaman.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Toggle Edit Mode */}
        <button
          onClick={() => setEditMode(!isEditMode)}
          className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
            isEditMode
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 ring-2 ring-orange-400'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          id="admin-toggle-wysiwyg"
        >
          {isEditMode ? (
            <>
              <Edit3 size={13} className="stroke-[2.5]" />
              <span>EDIT VISUAL: AKTIF</span>
            </>
          ) : (
            <>
              <Eye size={13} />
              <span>PREVIEW MODE</span>
            </>
          )}
        </button>

        {/* Reset to Default */}
        <button
          onClick={resetToDefault}
          className="px-3 py-1.5 bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-400 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-all border border-slate-700/50"
          id="admin-reset-data"
          title="Reset semua isi website kembali ke setelan default resmi"
        >
          <RotateCcw size={12} />
          <span>RESET DATA</span>
        </button>

        {/* Separator */}
        <span className="h-4 w-px bg-slate-700 block mx-1" />

        {/* Logout */}
        <button
          onClick={logout}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
          id="admin-logout-button"
        >
          <LogOut size={12} />
          <span>KELUAR</span>
        </button>
      </div>
    </div>
  );
};
