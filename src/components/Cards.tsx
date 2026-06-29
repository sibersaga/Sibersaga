import React from 'react';
import { Calendar, User, Trophy, Tag, Eye, ArrowRight, ArrowUpRight, Award, ShieldAlert } from 'lucide-react';
import { News, GalleryItem, Teacher, Achievement } from '../data/schoolData';
import { useAdmin } from '../context/AdminContext';
import { EditableText } from './EditableText';
import { RichTextEditor } from './RichTextEditor';

// --- NewsCard ---
interface NewsCardProps {
  news: News;
  onClick: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  return (
    <article 
      className="bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border border-slate-100 flex flex-col h-full group"
      id={`news-card-${news.id}`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img 
          src={news.image} 
          alt={news.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-accent-500 text-white font-extrabold rounded-lg text-xs tracking-wider shadow-md">
            {news.category}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center space-x-4 text-xs text-slate-400 font-semibold mb-3.5">
          <span className="flex items-center gap-1">
            <Calendar size={14} className="text-primary-500" />
            <span>{new Date(news.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </span>
          <span className="flex items-center gap-1 truncate max-w-[150px]">
            <User size={14} className="text-primary-500" />
            <span className="truncate">{news.author}</span>
          </span>
        </div>

        <h3 className="text-md sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-primary-600 transition-colors line-clamp-2 mb-3">
          {news.title}
        </h3>

        <p className="text-sm text-slate-500 font-normal line-clamp-3 mb-5 flex-grow leading-relaxed">
          {news.excerpt}
        </p>

        <button 
          onClick={onClick}
          className="group/btn inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-600 font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary-100 hover:shadow-primary-500/20 cursor-pointer text-[11px] uppercase tracking-wider mt-auto"
          id={`news-btn-${news.id}`}
        >
          <span>Baca Selengkapnya</span>
          <ArrowRight size={13} className="stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </article>
  );
};

// --- GalleryCard ---
interface GalleryCardProps {
  item: GalleryItem;
  onPreview: () => void;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({ item, onPreview }) => {
  return (
    <div 
      className="relative bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border border-slate-100 group cursor-pointer"
      onClick={onPreview}
      id={`gallery-card-${item.id}`}
    >
      <div className="aspect-square relative w-full overflow-hidden bg-slate-100">
        <img 
          src={item.url} 
          alt={item.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <div className="flex justify-between items-center text-white mb-2">
            <span className="text-xs bg-primary-500 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
              {item.category}
            </span>
            <span className="p-1.5 bg-slate-800/80 rounded-lg text-white">
              <Eye size={16} />
            </span>
          </div>
          <h4 className="text-white text-sm font-bold leading-snug line-clamp-2">
            {item.title}
          </h4>
        </div>
      </div>
      
      {/* Fallback visible text below on touch screens / standard layout */}
      <div className="p-4 bg-white border-t border-slate-50 md:hidden block">
        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">
          {item.category}
        </span>
        <h4 className="text-slate-800 text-xs font-bold truncate mt-1">
          {item.title}
        </h4>
      </div>
    </div>
  );
};

// --- TeacherCard ---
interface TeacherCardProps {
  teacher: Teacher;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border border-slate-100 flex flex-col items-center p-6 text-center group"
      id={`teacher-card-${teacher.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-inner bg-slate-50 mb-4 border-2 border-primary-100 group-hover:border-primary-400 transition-colors duration-300">
        <img 
          src={teacher.image} 
          alt={teacher.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      
      <h4 className="text-sm sm:text-base font-extrabold text-slate-800 leading-snug">
        {teacher.name}
      </h4>
      <p className="text-xs text-primary-600 font-semibold mt-1">
        {teacher.role}
      </p>
      
      <div className="w-10 h-1 bg-slate-100 rounded-full my-3.5 group-hover:w-16 group-hover:bg-accent-400 transition-all duration-300" />
      
      <p className="text-[11px] text-slate-400 font-mono">
        NIP. {teacher.nip}
      </p>
    </div>
  );
};

// --- AchievementCard ---
interface AchievementCardProps {
  achievement: Achievement;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { prestasiSekolah, updatePrestasiSekolah, isEditMode } = useAdmin();

  const handleUpdate = (updatedFields: Partial<Achievement>) => {
    const updated = prestasiSekolah.map((ach) =>
      ach.id === achievement.id ? { ...ach, ...updatedFields } : ach
    );
    updatePrestasiSekolah(updated);
  };

  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) {
      updatePrestasiSekolah(prestasiSekolah.filter((ach) => ach.id !== achievement.id));
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border border-slate-100 flex flex-col h-full group"
      id={`achievement-card-${achievement.id}`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img 
          src={achievement.image} 
          alt={achievement.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 bg-accent-500 text-white font-bold rounded text-[10px] uppercase tracking-wider">
            <EditableText
              value={achievement.category}
              onSave={(val) => handleUpdate({ category: val as 'Akademik' | 'Non-Akademik' })}
            />
          </span>
          <span className="px-2.5 py-0.5 bg-slate-900/80 text-white font-bold rounded text-[10px] uppercase tracking-wider">
            Th. <EditableText
              value={achievement.year}
              onSave={(val) => handleUpdate({ year: val })}
            />
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-xs text-primary-600 font-bold uppercase tracking-wider mb-2">
          <Award size={14} className="text-accent-500" />
          <span className="flex items-center gap-1">
            Tingkat
            <EditableText
              value={achievement.level}
              onSave={(val) => handleUpdate({ level: val })}
            />
          </span>
        </div>

        <h3 className="text-md sm:text-lg font-bold text-slate-800 leading-snug group-hover:text-primary-600 transition-colors mb-2">
          <EditableText
            value={achievement.title}
            onSave={(val) => handleUpdate({ title: val })}
          />
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-4 bg-slate-50 p-2 rounded-lg">
          <User size={14} className="text-primary-500 shrink-0" />
          <span className="truncate flex items-center gap-1">
            Oleh:
            <EditableText
              value={achievement.winner}
              onSave={(val) => handleUpdate({ winner: val })}
            />
          </span>
        </div>

        <div className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed flex-grow">
          <RichTextEditor
            htmlValue={achievement.description}
            onSave={(val) => handleUpdate({ description: val })}
          />
        </div>
      </div>

      {/* Sizing & Delete Controls */}
      {isEditMode && (
        <div className="bg-slate-50 border-t border-slate-100 p-3 px-4 flex items-center justify-between text-xs gap-3 font-mono">
          <div className="flex items-center gap-2 flex-grow">
            <span className="font-bold text-slate-500 text-[10px] uppercase">Lebar Kotak:</span>
            <input 
              type="range" 
              min="1" 
              max="3" 
              value={achievement.gridSpan || 1} 
              onChange={(e) => handleUpdate({ gridSpan: parseInt(e.target.value) })}
              className="w-20 accent-primary-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="font-extrabold text-primary-600">{achievement.gridSpan || 1}x</span>
          </div>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-white hover:bg-red-600 px-2 py-1 rounded font-bold transition-colors text-[10px] uppercase tracking-wider border border-red-200"
            title="Hapus Kotak"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};
