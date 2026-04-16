import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronDown, Moon, Sun, Sunrise, Sunset, Clock, Bell, Calendar, SunDim } from 'lucide-react';
import { useAppStore, translations } from '../lib/store';
import { calculatePrayerTimes, getNextPrayer, getHijriDate, chadCities } from '../lib/prayerTimes';
import { initializeNotifications, scheduleAllDailyNotifications } from '../lib/azaanNotifications';
import PrayerAzaanSettings from './PrayerAzaanSettings';
import type { PrayerTimes as PT } from '../lib/prayerTimes';

export default function PrayerTimes() {
  const { selectedCity, setSelectedCity, calculationMethod, asrMethod, language, getAzaanPreference } = useAppStore();
  const t = translations[language];
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState<PT | null>(null);
  
  // États pour la modal d'Azaan
  const [azaanModalOpen, setAzaanModalOpen] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<{ name: string; time: string } | null>(null);

  // Initialiser les notifications au montage du composant
  useEffect(() => {
    const initNotifications = async () => {
      try {
        await initializeNotifications();
        console.log('Notifications initialisées avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des notifications:', error);
      }
    };
    initNotifications();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updatePrayerTimes = async () => {
      const times = calculatePrayerTimes(
        currentTime,
        selectedCity.lat,
        selectedCity.lng,
        1, // Chad is UTC+1
        calculationMethod,
        asrMethod
      );
      setPrayerTimes(times);
      
      // Programmer les notifications pour toutes les prières
      const prayers = getNextPrayer(times, currentTime);
      await scheduleAllDailyNotifications(
        prayers.filter(p => p.name !== 'Sunrise'),
        getAzaanPreference,
        currentTime
      );
    };
    updatePrayerTimes();
  }, [selectedCity, calculationMethod, asrMethod, currentTime, getAzaanPreference]);

  const hijriDate = getHijriDate(currentTime);
  const prayers = prayerTimes ? getNextPrayer(prayerTimes, currentTime) : [];
  const nextPrayer = prayers.find(p => p.isNext);

  const getPrayerIcon = (name: string) => {
    switch (name) {
      case 'Fajr': return <Sunrise className="w-5 h-5" />;
      case 'Sunrise': return <Sun className="w-5 h-5" />;
      case 'Dhuhr': return <Sun className="w-5 h-5" />;
      case 'Asr': return <SunDim className="w-5 h-5" />;
      case 'Maghrib': return <Sunset className="w-5 h-5" />;
      case 'Isha': return <Moon className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  /**
   * Ouvre la modal d'Azaan pour une prière spécifique
   */
  const handlePrayerClick = (prayer: { name: string; time: string }) => {
    setSelectedPrayer(prayer);
    setAzaanModalOpen(true);
  };

  const getTimeUntilNextPrayer = () => {
    if (!nextPrayer || !prayerTimes) return '';
    const [h, m] = nextPrayer.time.split(':').map(Number);
    const prayerDate = new Date(currentTime);
    prayerDate.setHours(h, m, 0, 0);
    
    if (prayerDate < currentTime) {
      prayerDate.setDate(prayerDate.getDate() + 1);
    }
    
    const diff = prayerDate.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header with Background */}
      <div className="relative h-72 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/mosque-bg.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/70 to-slate-900" />
        
        <div className="relative z-10 p-6 pt-10">
          {/* City Selector */}
          <motion.button
            onClick={() => setShowCityPicker(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            whileTap={{ scale: 0.95 }}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-medium">{selectedCity.name}</span>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </motion.button>

          {/* Date Display */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <p className="text-emerald-400 text-lg mt-1 font-arabic">
              {hijriDate.day} {language === 'ar' ? hijriDate.monthAr : hijriDate.month} {hijriDate.year} هـ
            </p>
          </div>

          {/* Next Prayer Card */}
          {nextPrayer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl border border-emerald-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-400/80 text-sm">{t.nextPrayer}</p>
                  <h2 className="text-3xl font-bold text-white mt-1">
                    {language === 'ar' ? nextPrayer.nameAr : nextPrayer.name}
                  </h2>
                  <p className="text-white/60 text-sm mt-1">{language === 'fr' ? 'dans' : language === 'ar' ? 'بعد' : 'in'} {getTimeUntilNextPrayer()}</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-white font-mono">{nextPrayer.time}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="px-4 mt-1">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden">
          {prayers.filter(p => p.name !== 'Sunrise').map((prayer, index) => {
            const azaanPref = getAzaanPreference(prayer.name);
            const isAzaanDisabled = azaanPref.azaanType === 'disabled';
            
            return (
              <motion.div
                key={prayer.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePrayerClick(prayer)}
                className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                  prayer.isNext 
                    ? 'bg-gradient-to-r from-emerald-500/20 to-transparent' 
                    : 'hover:bg-white/5'
                } ${index !== prayers.filter(p => p.name !== 'Sunrise').length - 1 ? 'border-b border-slate-700/30' : ''}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-2.5 rounded-xl ${
                    prayer.isNext 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {getPrayerIcon(prayer.name)}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      prayer.isNext ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {language === 'ar' ? prayer.nameAr : prayer.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-mono ${
                    prayer.isNext ? 'text-emerald-400 font-bold' : 'text-white/80'
                  }`}>
                    {prayer.time}
                  </span>
                  
                  {/* Indicateur Azaan */}
                  <div className={`p-2 rounded-lg transition-colors ${
                    isAzaanDisabled
                      ? 'bg-slate-700/30 text-slate-500'
                      : 'bg-slate-700/50 text-slate-300 hover:text-amber-400'
                  }`}>
                    {isAzaanDisabled ? (
                      <Bell className="w-4 h-4 opacity-50" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  
                  {prayer.isNext && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Bell className="w-4 h-4 text-emerald-400" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* City Picker Modal */}
      <AnimatePresence>
        {showCityPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowCityPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-h-[70vh] bg-slate-900 rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-700/50">
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white text-center">{t.selectCity}</h3>
                <p className="text-slate-400 text-sm text-center mt-1">{t.chad} - {t.allCities}</p>
              </div>
              <div className="overflow-y-auto max-h-[55vh] p-4">
                <div className="grid grid-cols-2 gap-3">
                  {chadCities.map((city) => (
                    <motion.button
                      key={city.name}
                      onClick={() => {
                        setSelectedCity(city);
                        setShowCityPicker(false);
                      }}
                      className={`p-4 rounded-xl text-left transition-all ${
                        selectedCity.name === city.name
                          ? 'bg-emerald-500/20 border-2 border-emerald-500'
                          : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <p className={`font-semibold ${
                        selectedCity.name === city.name ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {city.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">{city.region}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prayer Azaan Settings Modal */}
      {selectedPrayer && (
        <PrayerAzaanSettings
          isOpen={azaanModalOpen}
          prayerName={selectedPrayer.name}
          prayerTime={selectedPrayer.time}
          onClose={() => {
            setAzaanModalOpen(false);
            setSelectedPrayer(null);
          }}
        />
      )}
    </div>
  );
}
