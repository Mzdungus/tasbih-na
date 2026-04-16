import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { chadCities, calculationMethods } from './prayerTimes';
import type { City, CalculationMethod } from './prayerTimes';

interface AzaanPreference {
  azaanType: 'azaan1' | 'azaan2' | 'disabled';
}

interface AppState {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  calculationMethod: CalculationMethod;
  setCalculationMethod: (method: CalculationMethod) => void;
  asrMethod: 1 | 2; // 1 = Shafi'i, 2 = Hanafi
  setAsrMethod: (method: 1 | 2) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  language: 'fr' | 'ar' | 'en';
  setLanguage: (lang: 'fr' | 'ar' | 'en') => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  tasbihCount: number;
  setTasbihCount: (count: number) => void;
  resetTasbih: () => void;
  incrementTasbih: () => void;
  tasbihTarget: number;
  setTasbihTarget: (target: number) => void;
  bookmarkedSurahs: number[];
  toggleBookmark: (surahNumber: number) => void;
  lastReadSurah: number | null;
  setLastReadSurah: (surahNumber: number) => void;
  // Azaan preferences (per prayer)
  azaanPreferences: Record<string, AzaanPreference>;
  setAzaanPreference: (prayerName: string, preference: AzaanPreference) => void;
  getAzaanPreference: (prayerName: string) => AzaanPreference;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedCity: chadCities[0],
      setSelectedCity: (city) => set({ selectedCity: city }),
      calculationMethod: calculationMethods.MWL,
      setCalculationMethod: (method) => set({ calculationMethod: method }),
      asrMethod: 1,
      setAsrMethod: (method) => set({ asrMethod: method }),
      notifications: true,
      setNotifications: (enabled) => set({ notifications: enabled }),
      language: 'fr',
      setLanguage: (lang) => set({ language: lang }),
      theme: 'dark',
      setTheme: (theme) => set({ theme: theme }),
      tasbihCount: 0,
      setTasbihCount: (count) => set({ tasbihCount: count }),
      resetTasbih: () => set({ tasbihCount: 0 }),
      incrementTasbih: () => set((state) => ({ tasbihCount: state.tasbihCount + 1 })),
      tasbihTarget: 33,
      setTasbihTarget: (target) => set({ tasbihTarget: target }),
      bookmarkedSurahs: [],
      toggleBookmark: (surahNumber) => set((state) => ({
        bookmarkedSurahs: state.bookmarkedSurahs.includes(surahNumber)
          ? state.bookmarkedSurahs.filter(n => n !== surahNumber)
          : [...state.bookmarkedSurahs, surahNumber]
      })),
      lastReadSurah: null,
      setLastReadSurah: (surahNumber) => set({ lastReadSurah: surahNumber }),
      
      // Azaan preferences - default: azaan1 for all prayers
      azaanPreferences: {
        'Fajr': { azaanType: 'azaan1' },
        'Dhuhr': { azaanType: 'azaan1' },
        'Asr': { azaanType: 'azaan1' },
        'Maghrib': { azaanType: 'azaan1' },
        'Isha': { azaanType: 'azaan1' },
      },
      setAzaanPreference: (prayerName: string, preference: AzaanPreference) => {
        set((state) => ({
          azaanPreferences: {
            ...state.azaanPreferences,
            [prayerName]: preference,
          }
        }));
      },
      getAzaanPreference: (prayerName: string) => {
        const state = get();
        return state.azaanPreferences[prayerName] || { azaanType: 'azaan1' };
      },
    }),
    {
      name: 'salat-tchad-storage',
    }
  )
);

export const translations = {
  fr: {
    prayerTimes: 'Heures de Prière',
    qibla: 'Qibla',
    quran: 'Coran',
    tasbih: 'Tasbih',
    settings: 'Paramètres',
    adhkar: 'Adhkar',
    duas: 'Duas',
    fajr: 'Fajr',
    sunrise: 'Lever du soleil',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    nextPrayer: 'prière',
    selectCity: 'Sélectionner une ville',
    calculationMethod: 'Méthode de calcul',
    asrMethod: 'Méthode Asr',
    shafii: "Shafi'i (Standard)",
    hanafi: 'Hanafi',
    notifications: 'Notifications',
    language: 'Langue',
    theme: 'Thème',
    dark: 'Sombre',
    light: 'Clair',
    reset: 'Réinitialiser',
    target: 'Objectif',
    surahs: 'Sourates',
    verses: 'Versets',
    meccan: 'Mecquoise',
    medinan: 'Médinoise',
    bookmarks: 'Favoris',
    search: 'Rechercher',
    direction: 'Direction',
    degrees: 'degrés',
    today: "Aujourd'hui",
    tomorrow: 'Demain',
    chad: 'Tchad',
    allCities: 'Toutes les villes',
    hadith: 'Hadith',
    hadithList: 'Liste des hadiths',
    hadithCollections: 'Collections de hadiths',
    chooseCollection: 'Choisissez un recueil',
    noHadithBooks: 'Aucun recueil de hadith disponible',
    hadiths: 'hadiths',
    loadMore: 'Charger plus',
    all: 'Tout',
    azaan: 'Azaan',
    azaanSettings: 'Réglages de l\'Azaan',
    azaanAudio1: 'Azaan Audio 1',
    azaanAudio2: 'Azaan Audio 2',
    disableAzaan: 'Désactiver',
    previewAudio: 'Aperçu',
    selectAzaan: 'Sélectionner un Azaan',
    azaanDisabled: 'Azaan désactivé',
  },
  ar: {
    prayerTimes: 'مواقيت الصلاة',
    qibla: 'القبلة',
    quran: 'القرآن',
    tasbih: 'التسبيح',
    settings: 'الإعدادات',
    adhkar: 'الأذكار',
    duas: 'الأدعية',
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    nextPrayer: 'الصلاة القادمة',
    selectCity: 'اختر مدينة',
    calculationMethod: 'طريقة الحساب',
    asrMethod: 'طريقة العصر',
    shafii: 'الشافعي (قياسي)',
    hanafi: 'الحنفي',
    notifications: 'الإشعارات',
    language: 'اللغة',
    theme: 'المظهر',
    dark: 'داكن',
    light: 'فاتح',
    reset: 'إعادة تعيين',
    target: 'الهدف',
    surahs: 'السور',
    verses: 'الآيات',
    meccan: 'مكية',
    medinan: 'مدنية',
    bookmarks: 'المفضلة',
    search: 'بحث',
    direction: 'الاتجاه',
    degrees: 'درجة',
    today: 'اليوم',
    tomorrow: 'غداً',
    chad: 'تشاد',
    allCities: 'جميع المدن',
      all: 'الكل',
    azaan: 'الأذان',
    azaanSettings: 'إعدادات الأذان',
    azaanAudio1: 'صوت الأذان 1',
    azaanAudio2: 'صوت الأذان 2',
    disableAzaan: 'تعطيل',
    previewAudio: 'معاينة',
    selectAzaan: 'اختر أذان',
    azaanDisabled: 'الأذان معطل',
  },
  en: {
    prayerTimes: 'Prayer Times',
    qibla: 'Qibla',
    quran: 'Quran',
    tasbih: 'Tasbih',
    settings: 'Settings',
    adhkar: 'Adhkar',
    duas: 'Duas',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
    nextPrayer: 'Next Prayer',
    selectCity: 'Select City',
    calculationMethod: 'Calculation Method',
    asrMethod: 'Asr Method',
    shafii: "Shafi'i (Standard)",
    hanafi: 'Hanafi',
    notifications: 'Notifications',
    language: 'Language',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    reset: 'Reset',
    target: 'Target',
    surahs: 'Surahs',
    verses: 'Verses',
    meccan: 'Meccan',
    medinan: 'Medinan',
    bookmarks: 'Bookmarks',
    search: 'Search',
    direction: 'Direction',
    degrees: 'degrees',
    today: 'Today',
    tomorrow: 'Tomorrow',
    chad: 'Chad',
    allCities: 'All Cities',
    all: 'All',
    azaan: 'Azaan',
    azaanSettings: 'Azaan Settings',
    azaanAudio1: 'Azaan Audio 1',
    azaanAudio2: 'Azaan Audio 2',
    disableAzaan: 'Disable',
    previewAudio: 'Preview',
    selectAzaan: 'Select Azaan',
    azaanDisabled: 'Azaan disabled',
  },
};
