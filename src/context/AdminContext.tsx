import React, { createContext, useContext, useState, useEffect } from 'react';
import * as defaultData from '../data/schoolData';
import { Testimonial } from '../data/schoolData';
import { supabase } from '../lib/supabase';

export interface SchoolStatistic {
  siswaAktif: number;
  pendidikStaff: number;
  penghargaanJuara: number;
  pojokBaca: number;
}

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  status: 'Sedang Berlangsung' | 'Mendatang' | 'Selesai';
}

const defaultStatistik: SchoolStatistic = {
  siswaAktif: 320,
  pendidikStaff: 14,
  penghargaanJuara: 25,
  pojokBaca: 6
};

const defaultAgenda: AgendaItem[] = [
  { id: "agenda-1", title: "Pendaftaran Online & Pengambilan Formulir PPDB", date: "15 Juni - 30 Juni 2026", status: "Sedang Berlangsung" },
  { id: "agenda-2", title: "Verifikasi Berkas Persyaratan & Usia", date: "01 Juli - 03 Juli 2026", status: "Mendatang" },
  { id: "agenda-3", title: "Pengumuman Hasil Seleksi PPDB", date: "05 Juli 2026", status: "Mendatang" },
  { id: "agenda-4", title: "Daftar Ulang Siswa Baru", date: "06 Juli - 08 Juli 2026", status: "Mendatang" },
  { id: "agenda-5", title: "Hari Pertama Masuk Sekolah & MPLS", date: "13 Juli - 15 Juli 2026", status: "Mendatang" }
];

interface AdminContextType {
  isAdmin: boolean;
  isEditMode: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  setEditMode: (mode: boolean) => void;

  // Editable datasets
  schoolConfig: defaultData.SchoolConfig;
  profilSekolah: typeof defaultData.profilSekolah;
  kegiatanSekolah: defaultData.Activity[];
  prestasiSekolah: defaultData.Achievement[];
  beritaSekolah: defaultData.News[];
  galeriSekolah: defaultData.GalleryItem[];
  inovasiSekolah: defaultData.Innovation[];
  dokumenTransparansi: defaultData.PublicDocument[];
  testimonialSekolah: Testimonial[];
  spmbConfig: typeof defaultData.spmbConfig;
  statistikSekolah: SchoolStatistic;
  agendaSekolah: AgendaItem[];
  studentDemographics: defaultData.StudentDemographic[];

  // Save/Update functions
  updateSchoolConfig: (config: Partial<defaultData.SchoolConfig>) => Promise<void>;
  updateProfilSekolah: (profil: any) => Promise<void>;
  updateKegiatanSekolah: (kegiatan: defaultData.Activity[]) => Promise<void>;
  updatePrestasiSekolah: (prestasi: defaultData.Achievement[]) => Promise<void>;
  updateBeritaSekolah: (berita: defaultData.News[]) => Promise<void>;
  updateGaleriSekolah: (galeri: defaultData.GalleryItem[]) => Promise<void>;
  updateInovasiSekolah: (inovasi: defaultData.Innovation[]) => Promise<void>;
  updateDokumenTransparansi: (dokumen: defaultData.PublicDocument[]) => Promise<void>;
  updateTestimonialSekolah: (testimonial: Testimonial[]) => Promise<void>;
  updateSpmbConfig: (spmb: any) => Promise<void>;
  updateStatistikSekolah: (statistik: SchoolStatistic) => Promise<void>;
  updateAgendaSekolah: (agenda: AgendaItem[]) => Promise<void>;
  updateStudentDemographics: (demographics: defaultData.StudentDemographic[]) => Promise<void>;
  resetToDefault: () => Promise<void>;
  isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const contentTypes: Record<string, string> = {
  schoolConfig: 'schoolConfig',
  profilSekolah: 'profilSekolah',
  kegiatanSekolah: 'kegiatanSekolah',
  prestasiSekolah: 'prestasiSekolah',
  beritaSekolah: 'beritaSekolah',
  galeriSekolah: 'galeriSekolah',
  inovasiSekolah: 'inovasiSekolah',
  dokumenTransparansi: 'dokumenTransparansi',
  testimonialSekolah: 'testimonialSekolah',
  spmbConfig: 'spmbConfig',
  statistikSekolah: 'statistikSekolah',
  agendaSekolah: 'agendaSekolah',
  studentDemographics: 'studentDemographics',
};

async function fetchFromSupabase<T>(contentType: string, fallback: T): Promise<T> {
  if (!supabase || !process.env.VITE_SUPABASE_URL) {
    return fallback;
  }

  const { data, error } = await supabase
    .from('cms_content')
    .select('data')
    .eq('content_type', contentType)
    .maybeSingle();

  if (error || !data) {
    return fallback;
  }

  return data.data as T;
}

async function saveToSupabase<T>(contentType: string, data: T): Promise<boolean> {
  if (!supabase || !process.env.VITE_SUPABASE_URL) {
    return false;
  }

  const { error } = await supabase
    .from('cms_content')
    .upsert({
      content_type: contentType,
      data,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'content_type' });

  if (error) {
    console.error(`Supabase save error [${contentType}]:`, error);
    return false;
  }

  return true;
}

async function deleteFromSupabase(contentType: string): Promise<boolean> {
  if (!supabase || !process.env.VITE_SUPABASE_URL) {
    return false;
  }

  const { error } = await supabase
    .from('cms_content')
    .delete()
    .eq('content_type', contentType);

  if (error) {
    console.error(`Supabase delete error [${contentType}]:`, error);
    return false;
  }

  return true;
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('sdn3_admin_logged') === 'true';
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(() => {
    return localStorage.getItem('sdn3_edit_mode') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  const [schoolConfig, setSchoolConfigState] = useState<defaultData.SchoolConfig>(defaultData.schoolConfig);
  const [profilSekolah, setProfilSekolahState] = useState<typeof defaultData.profilSekolah>(defaultData.profilSekolah);
  const [kegiatanSekolah, setKegiatanSekolahState] = useState<defaultData.Activity[]>(defaultData.kegiatanSekolah);
  const [prestasiSekolah, setPrestasiSekolahState] = useState<defaultData.Achievement[]>(defaultData.prestasiSekolah);
  const [beritaSekolah, setBeritaSekolahState] = useState<defaultData.News[]>(defaultData.beritaSekolah);
  const [galeriSekolah, setGaleriSekolahState] = useState<defaultData.GalleryItem[]>(defaultData.galeriSekolah);
  const [inovasiSekolah, setInovasiSekolahState] = useState<defaultData.Innovation[]>(defaultData.inovasiSekolah);
  const [dokumenTransparansi, setDokumenTransparansiState] = useState<defaultData.PublicDocument[]>(defaultData.dokumenTransparansi);
  const [testimonialSekolah, setTestimonialSekolahState] = useState<Testimonial[]>(defaultData.testimonialSekolah);
  const [spmbConfig, setSpmbConfigState] = useState<typeof defaultData.spmbConfig>(defaultData.spmbConfig);
  const [statistikSekolah, setStatistikSekolahState] = useState<SchoolStatistic>(defaultStatistik);
  const [agendaSekolah, setAgendaSekolahState] = useState<AgendaItem[]>(defaultAgenda);
  const [studentDemographics, setStudentDemographicsState] = useState<defaultData.StudentDemographic[]>(defaultData.studentDemographics);

  // Load all content from Supabase on mount
  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      try {
        const [
          schoolConfigData,
          profilSekolahData,
          kegiatanSekolahData,
          prestasiSekolahData,
          beritaSekolahData,
          galeriSekolahData,
          inovasiSekolahData,
          dokumenTransparansiData,
          testimonialSekolahData,
          spmbConfigData,
          statistikSekolahData,
          agendaSekolahData,
          studentDemographicsData,
        ] = await Promise.all([
          fetchFromSupabase(contentTypes.schoolConfig, defaultData.schoolConfig),
          fetchFromSupabase(contentTypes.profilSekolah, defaultData.profilSekolah),
          fetchFromSupabase(contentTypes.kegiatanSekolah, defaultData.kegiatanSekolah),
          fetchFromSupabase(contentTypes.prestasiSekolah, defaultData.prestasiSekolah),
          fetchFromSupabase(contentTypes.beritaSekolah, defaultData.beritaSekolah),
          fetchFromSupabase(contentTypes.galeriSekolah, defaultData.galeriSekolah),
          fetchFromSupabase(contentTypes.inovasiSekolah, defaultData.inovasiSekolah),
          fetchFromSupabase(contentTypes.dokumenTransparansi, defaultData.dokumenTransparansi),
          fetchFromSupabase(contentTypes.testimonialSekolah, defaultData.testimonialSekolah),
          fetchFromSupabase(contentTypes.spmbConfig, defaultData.spmbConfig),
          fetchFromSupabase(contentTypes.statistikSekolah, defaultStatistik),
          fetchFromSupabase(contentTypes.agendaSekolah, defaultAgenda),
          fetchFromSupabase(contentTypes.studentDemographics, defaultData.studentDemographics),
        ]);

        setSchoolConfigState(schoolConfigData);
        setProfilSekolahState(profilSekolahData);
        setKegiatanSekolahState(kegiatanSekolahData);
        setPrestasiSekolahState(prestasiSekolahData);
        setBeritaSekolahState(beritaSekolahData);
        setGaleriSekolahState(galeriSekolahData);
        setInovasiSekolahState(inovasiSekolahData);
        setDokumenTransparansiState(dokumenTransparansiData);
        setTestimonialSekolahState(testimonialSekolahData);
        setSpmbConfigState(spmbConfigData);
        setStatistikSekolahState(statistikSekolahData);
        setAgendaSekolahState(agendaSekolahData);
        setStudentDemographicsState(studentDemographicsData);
      } catch (e) {
        console.error('Failed to load CMS data from Supabase:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAll();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username.toLowerCase() === 'admin' && password === 'admin3purwosari') {
      setIsAdmin(true);
      localStorage.setItem('sdn3_admin_logged', 'true');
      setIsEditMode(true);
      localStorage.setItem('sdn3_edit_mode', 'true');

      // Migrasi data localStorage -> Supabase
      await migrateLocalStorageToSupabase();

      return true;
    }
    return false;
  };

  const migrateLocalStorageToSupabase = async () => {
    if (!supabase || !process.env.VITE_SUPABASE_URL) return;

    const keysToMigrate = Object.values(contentTypes);
    let hasMigrated = false;

    for (const key of keysToMigrate) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          await saveToSupabase(key, parsed);
          localStorage.removeItem(key);
          hasMigrated = true;
          console.log(`[AdminContext] Migrated ${key} from localStorage to Supabase`);
        } catch (e) {
          console.error(`[AdminContext] Migration failed for ${key}:`, e);
        }
      }
    }

    if (hasMigrated) {
      // Reload semua data dari Supabase setelah migrasi berhasil
      const [
        schoolConfigData,
        profilSekolahData,
        kegiatanSekolahData,
        prestasiSekolahData,
        beritaSekolahData,
        galeriSekolahData,
        inovasiSekolahData,
        dokumenTransparansiData,
        testimonialSekolahData,
        spmbConfigData,
        statistikSekolahData,
        agendaSekolahData,
        studentDemographicsData,
      ] = await Promise.all([
        fetchFromSupabase(contentTypes.schoolConfig, defaultData.schoolConfig),
        fetchFromSupabase(contentTypes.profilSekolah, defaultData.profilSekolah),
        fetchFromSupabase(contentTypes.kegiatanSekolah, defaultData.kegiatanSekolah),
        fetchFromSupabase(contentTypes.prestasiSekolah, defaultData.prestasiSekolah),
        fetchFromSupabase(contentTypes.beritaSekolah, defaultData.beritaSekolah),
        fetchFromSupabase(contentTypes.galeriSekolah, defaultData.galeriSekolah),
        fetchFromSupabase(contentTypes.inovasiSekolah, defaultData.inovasiSekolah),
        fetchFromSupabase(contentTypes.dokumenTransparansi, defaultData.dokumenTransparansi),
        fetchFromSupabase(contentTypes.testimonialSekolah, defaultData.testimonialSekolah),
        fetchFromSupabase(contentTypes.spmbConfig, defaultData.spmbConfig),
        fetchFromSupabase(contentTypes.statistikSekolah, defaultStatistik),
        fetchFromSupabase(contentTypes.agendaSekolah, defaultAgenda),
        fetchFromSupabase(contentTypes.studentDemographics, defaultData.studentDemographics),
      ]);

      setSchoolConfigState(schoolConfigData);
      setProfilSekolahState(profilSekolahData);
      setKegiatanSekolahState(kegiatanSekolahData);
      setPrestasiSekolahState(prestasiSekolahData);
      setBeritaSekolahState(beritaSekolahData);
      setGaleriSekolahState(galeriSekolahData);
      setInovasiSekolahState(inovasiSekolahData);
      setDokumenTransparansiState(dokumenTransparansiData);
      setTestimonialSekolahState(testimonialSekolahData);
      setSpmbConfigState(spmbConfigData);
      setStatistikSekolahState(statistikSekolahData);
      setAgendaSekolahState(agendaSekolahData);
      setStudentDemographicsState(studentDemographicsData);
    }
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
    localStorage.removeItem('sdn3_admin_logged');
    localStorage.removeItem('sdn3_edit_mode');
  };

  const setEditMode = (mode: boolean) => {
    setIsEditMode(mode);
    localStorage.setItem('sdn3_edit_mode', String(mode));
  };

  const persist = async <T,>(key: string, value: T): Promise<void> => {
    // Update local state immediately for responsiveness
    // The actual caller will also update state directly, so this is mainly for Supabase sync
    await saveToSupabase(key, value);
  };

  const updateSchoolConfig = async (config: Partial<defaultData.SchoolConfig>) => {
    const updated = { ...schoolConfig, ...config };
    setSchoolConfigState(updated);
    await persist(contentTypes.schoolConfig, updated);
  };

  const updateProfilSekolah = async (profil: any) => {
    const updated = { ...profilSekolah, ...profil };
    setProfilSekolahState(updated);
    await persist(contentTypes.profilSekolah, updated);
  };

  const updateKegiatanSekolah = async (kegiatan: defaultData.Activity[]) => {
    setKegiatanSekolahState(kegiatan);
    await persist(contentTypes.kegiatanSekolah, kegiatan);
  };

  const updatePrestasiSekolah = async (prestasi: defaultData.Achievement[]) => {
    setPrestasiSekolahState(prestasi);
    await persist(contentTypes.prestasiSekolah, prestasi);
  };

  const updateBeritaSekolah = async (berita: defaultData.News[]) => {
    setBeritaSekolahState(berita);
    await persist(contentTypes.beritaSekolah, berita);
  };

  const updateGaleriSekolah = async (galeri: defaultData.GalleryItem[]) => {
    setGaleriSekolahState(galeri);
    await persist(contentTypes.galeriSekolah, galeri);
  };

  const updateInovasiSekolah = async (inovasi: defaultData.Innovation[]) => {
    setInovasiSekolahState(inovasi);
    await persist(contentTypes.inovasiSekolah, inovasi);
  };

  const updateDokumenTransparansi = async (dokumen: defaultData.PublicDocument[]) => {
    setDokumenTransparansiState(dokumen);
    await persist(contentTypes.dokumenTransparansi, dokumen);
  };

  const updateTestimonialSekolah = async (testimonial: Testimonial[]) => {
    setTestimonialSekolahState(testimonial);
    await persist(contentTypes.testimonialSekolah, testimonial);
  };

  const updateSpmbConfig = async (spmb: any) => {
    const updated = { ...spmbConfig, ...spmb };
    setSpmbConfigState(updated);
    await persist(contentTypes.spmbConfig, updated);
  };

  const updateStatistikSekolah = async (statistik: SchoolStatistic) => {
    setStatistikSekolahState(statistik);
    await persist(contentTypes.statistikSekolah, statistik);
  };

  const updateAgendaSekolah = async (agenda: AgendaItem[]) => {
    setAgendaSekolahState(agenda);
    await persist(contentTypes.agendaSekolah, agenda);
  };

  const updateStudentDemographics = async (demographics: defaultData.StudentDemographic[]) => {
    setStudentDemographicsState(demographics);
    await persist(contentTypes.studentDemographics, demographics);
  };

  const resetToDefault = async () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua teks, gambar, dan data ke kondisi bawaan resmi?')) {
      localStorage.removeItem('sdn3_admin_logged');
      localStorage.removeItem('sdn3_edit_mode');
      setIsAdmin(false);
      setIsEditMode(false);

      // Reset all local state
      setSchoolConfigState(defaultData.schoolConfig);
      setProfilSekolahState(defaultData.profilSekolah);
      setKegiatanSekolahState(defaultData.kegiatanSekolah);
      setPrestasiSekolahState(defaultData.prestasiSekolah);
      setBeritaSekolahState(defaultData.beritaSekolah);
      setGaleriSekolahState(defaultData.galeriSekolah);
      setInovasiSekolahState(defaultData.inovasiSekolah);
      setDokumenTransparansiState(defaultData.dokumenTransparansi);
      setTestimonialSekolahState(defaultData.testimonialSekolah);
      setSpmbConfigState(defaultData.spmbConfig);
      setStatistikSekolahState(defaultStatistik);
      setAgendaSekolahState(defaultAgenda);
      setStudentDemographicsState(defaultData.studentDemographics);

      // Delete from Supabase
      await Promise.all(
        Object.values(contentTypes).map((key) => deleteFromSupabase(key))
      );
    }
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      isEditMode,
      login,
      logout,
      setEditMode,
      schoolConfig,
      profilSekolah,
      kegiatanSekolah,
      prestasiSekolah,
      beritaSekolah,
      galeriSekolah,
      inovasiSekolah,
      dokumenTransparansi,
      testimonialSekolah,
      spmbConfig,
      statistikSekolah,
      agendaSekolah,
      studentDemographics,
      updateSchoolConfig,
      updateProfilSekolah,
      updateKegiatanSekolah,
      updatePrestasiSekolah,
      updateBeritaSekolah,
      updateGaleriSekolah,
      updateInovasiSekolah,
      updateDokumenTransparansi,
      updateTestimonialSekolah,
      updateSpmbConfig,
      updateStatistikSekolah,
      updateAgendaSekolah,
      updateStudentDemographics,
      resetToDefault,
      isLoading,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
