import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, ChevronLeft, ChevronRight, User, Award, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Teacher } from '../data/schoolData';

interface TeacherStackedCarouselProps {
  teachers: Teacher[];
}

export const TeacherStackedCarousel: React.FC<TeacherStackedCarouselProps> = ({ teachers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Restart sliding if list changes or isPlaying changes
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (isPlaying && teachers.length > 1) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 4000); // Auto slide every 4 seconds
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentIndex, teachers.length]);

  if (teachers.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400 flex flex-col items-center max-w-md mx-auto">
        <User size={36} className="mb-2 text-slate-300" />
        <h4 className="font-bold text-slate-700">Guru Tidak Ditemukan</h4>
        <p className="text-xs mt-1">Coba ketikkan kata kunci pencarian yang lain.</p>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % teachers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + teachers.length) % teachers.length);
  };

  // Get up to 3 teachers to render in the stacked layout
  const getStackedTeachers = () => {
    const stacked: { teacher: Teacher; indexInList: number; stackPosition: number }[] = [];
    const maxVisible = Math.min(3, teachers.length);
    
    for (let i = 0; i < maxVisible; i++) {
      const idx = (currentIndex + i) % teachers.length;
      stacked.push({
        teacher: teachers[idx],
        indexInList: idx,
        stackPosition: i, // 0 is front/active, 1 is middle, 2 is back
      });
    }
    return stacked;
  };

  const stackedItems = getStackedTeachers();
  const currentActiveTeacher = teachers[currentIndex];

  return (
    <div 
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white rounded-3xl border border-slate-150 shadow-xl p-6 sm:p-10 relative overflow-hidden"
      id="teacher-stacked-carousel-container"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-50/30 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      {/* LEFT: Active Teacher Profile Details with interactive indicators */}
      <div className="lg:col-span-5 space-y-6 relative z-10 flex flex-col justify-center text-left">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-primary-50 text-primary-700 border border-primary-200/50 font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Profil Pendidik
            </span>
            <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2.5 py-0.5 rounded-full font-bold">
              <BadgeCheck size={12} className="text-emerald-600" />
              <span>ASN Terverifikasi</span>
            </span>
          </div>
          
          {/* Animated Name & Role text on index change to keep it extremely dynamic */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-2.5"
            >
              <h3 className="text-2xl sm:text-3xl font-black text-slate-850 tracking-tight leading-tight">
                {currentActiveTeacher.name}
              </h3>
              <p className="text-sm sm:text-md text-primary-600 font-extrabold tracking-wide uppercase">
                {currentActiveTeacher.role}
              </p>
              <div className="w-12 h-1 bg-accent-500 rounded-full mt-2" />
              <p className="text-xs text-slate-400 font-semibold font-mono">
                NIP. {currentActiveTeacher.nip || '—'}
              </p>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm pt-2">
                Berdedikasi tinggi dalam mendidik putra-putri bangsa di SDN 3 Purwosari, mewujudkan generasi berkarakter unggul, kreatif, dan mandiri sesuai profil Pelajar Pancasila.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel controls with Auto Slide state toggle */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Sebelumnya"
              id="carousel-prev-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Selanjutnya"
              id="carousel-next-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Play/Pause state */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isPlaying 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={isPlaying ? "Jeda Putar Otomatis" : "Mulai Putar Otomatis"}
            id="carousel-play-pause-btn"
          >
            {isPlaying ? (
              <>
                <Pause size={13} className="animate-pulse" />
                <span className="font-mono">AUTO: AKTIF</span>
              </>
            ) : (
              <>
                <Play size={13} />
                <span className="font-mono">AUTO: JEDA</span>
              </>
            )}
          </button>
          
          <div className="text-[11px] text-slate-400 font-bold font-mono ml-auto">
            {currentIndex + 1} / {teachers.length}
          </div>
        </div>

        {/* Progress Dots Indicators */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {teachers.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                dotIdx === currentIndex 
                  ? 'w-6 bg-primary-600' 
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
              title={`Buka guru ke-${dotIdx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Stacked Deck (Overlapping Cards Layout) */}
      <div className="lg:col-span-7 flex items-center justify-center py-10 relative h-[420px] max-w-sm sm:max-w-md mx-auto w-full z-10" id="stacked-deck-wrapper">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* We map in reverse so that position 0 (active) is rendered last and stays on top */}
          {stackedItems.slice().reverse().map((item) => {
            const { teacher, indexInList, stackPosition } = item;

            // Define stack variables based on depth position (0 is front, 1 is middle, 2 is back)
            const scale = 1 - stackPosition * 0.06;
            const translateY = stackPosition * 14; // overlapping downwards offset
            const translateX = stackPosition * 14; // overlapping rightwards offset
            const rotate = stackPosition === 0 ? 0 : stackPosition === 1 ? 3 : -3; // stylized rotation offsets
            const opacity = 1 - stackPosition * 0.25;
            const zIndex = 30 - stackPosition * 10;

            return (
              <motion.div
                key={teacher.name}
                style={{
                  zIndex,
                  transformOrigin: 'bottom center',
                }}
                animate={{
                  scale,
                  y: translateY,
                  x: translateX,
                  rotate,
                  opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 25,
                }}
                className={`absolute w-full max-w-[280px] sm:max-w-[310px] aspect-[4/5] bg-white rounded-3xl border border-slate-150 shadow-xl overflow-hidden cursor-pointer select-none group flex flex-col p-4 sm:p-5 ${
                  stackPosition === 0 ? 'ring-2 ring-primary-500/20' : ''
                }`}
                onClick={() => {
                  if (stackPosition > 0) {
                    setCurrentIndex(indexInList);
                  }
                }}
                whileHover={stackPosition === 0 ? { y: translateY - 8, transition: { duration: 0.2 } } : {}}
              >
                {/* Photo container */}
                <div className="relative flex-grow rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-inner group-hover:shadow-md transition-shadow">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Category overlay */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1">
                    <User size={10} className="text-accent-400" />
                    <span>{teacher.role.includes('Kepala') ? 'MANAJERIAL' : 'PENDIDIK'}</span>
                  </div>
                </div>

                {/* Info Card Bottom Panel */}
                <div className="pt-4 flex flex-col items-center text-center space-y-1">
                  <h4 className="text-xs sm:text-sm font-black text-slate-850 leading-snug line-clamp-1">
                    {teacher.name}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-primary-600 font-extrabold truncate w-full">
                    {teacher.role}
                  </p>
                  
                  {/* NIP status bar */}
                  <div className="w-8 h-0.5 bg-slate-100 rounded-full my-1 group-hover:w-12 group-hover:bg-accent-400 transition-all duration-300" />
                  <p className="text-[9px] text-slate-400 font-semibold font-mono tracking-wider">
                    NIP. {teacher.nip || '—'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
