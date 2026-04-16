import { motion } from 'framer-motion';
import { Settings as SettingsIcon, MapPin, Calculator, Moon, Sun, Bell, BellOff, Globe, ChevronRight, Heart } from 'lucide-react';
import { useAppStore, translations } from '../lib/store';
import { chadCities, calculationMethods } from '../lib/prayerTimes';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

export default function Settings() {
  const {
    selectedCity,
    setSelectedCity,
    calculationMethod,
    setCalculationMethod,
    asrMethod,
    setAsrMethod,
    notifications,
    setNotifications,
    language,
    setLanguage,
    theme,
    setTheme,
  } = useAppStore();
  const t = translations[language];

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showMethodPicker, setShowMethodPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-10 px-4">
      {/* Header */}
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
          flex items-center gap-3 mb-2"
        >
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <SettingsIcon className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t.settings}</h1>
        </motion.div>
      </div>

      {/* Settings Groups */}
      <div className="space-y-5">
        {/* Location Settings */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden">
          <div className="p-4 border-b border-slate-700/30">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              {language === 'fr' ? 'Localisation' : language === 'ar' ? 'الموقع' : 'Location'}
            </h2>
          </div>
          <button
            onClick={() => setShowCityPicker(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div>
              <p className="text-slate-400 text-sm">{t.selectCity}</p>
              <p className="text-white font-medium">{selectedCity.name}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Calculation Settings */}
        <div className=" bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden">
          <div className="p-4 border-b border-slate-700/30">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              {language === 'fr' ? 'Calcul des prières' : language === 'ar' ? 'حساب الصلاة' : 'Prayer Calculation'}
            </h2>
          </div>
          <button
            onClick={() => setShowMethodPicker(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-slate-700/30"
          >
            <div>
              <p className="text-slate-400 text-sm">{t.calculationMethod}</p>
              <p className="text-white font-medium">{calculationMethod.name}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>
          <div className="p-4">
            <p className="text-slate-400 text-sm mb-3">{t.asrMethod}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setAsrMethod(1)}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                  asrMethod === 1
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {t.shafii}
              </button>
              <button
                onClick={() => setAsrMethod(2)}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                  asrMethod === 2
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {t.hanafi}
              </button>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden">
          <div className="p-4 border-b border-slate-700/30">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Sun className="w-4 h-4 text-emerald-400" />
              {language === 'fr' ? 'Apparence' : language === 'ar' ? 'المظهر' : 'Appearance'}
            </h2>
          </div>
          <div className="p-4 border-b border-slate-700/30">
            <p className="text-slate-400 text-sm mb-3">{t.theme}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Moon className="w-4 h-4" />
                {t.dark}
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  theme === 'light'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Sun className="w-4 h-4" />
                {t.light}
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowLanguagePicker(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-slate-400 text-sm">{t.language}</p>
                <p className="text-white font-medium">
                  {languages.find(l => l.code === language)?.name}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden">
          <button
            onClick={() => setNotifications(!notifications)}
            className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              {notifications ? (
                <Bell className="w-5 h-5 text-emerald-400" />
              ) : (
                <BellOff className="w-5 h-5 text-slate-400" />
              )}
              <div>
                <p className="text-white font-medium">{t.notifications}</p>
                <p className="text-slate-400 text-sm">
                  {language === 'fr' 
                    ? 'Rappels pour les heures de prière'
                    : language === 'ar'
                    ? 'تذكيرات لأوقات الصلاة'
                    : 'Reminders for prayer times'
                  }
                </p>
              </div>
            </div>
            <div className={`w-12 h-7 rounded-full transition-colors ${
              notifications ? 'bg-emerald-500' : 'bg-slate-600'
            } relative`}>
              <motion.div
                className="w-5 h-5 bg-white rounded-full absolute top-1"
                animate={{ left: notifications ? 26 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </button>
        </div>

        {/* About */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 overflow-hidden">
          <div className="p-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
              <span className="text-3xl">🕌</span>
            </div>
            <h3 className="text-white font-bold text-lg">Salat Tchad</h3>
            <p className="text-slate-400 text-sm mt-1">
              {language === 'fr' 
                ? 'Heures de prière pour le Tchad'
                : language === 'ar'
                ? 'مواقيت الصلاة في تشاد'
                : 'Prayer Times for Chad'
              }
            </p>
            <p className="text-emerald-400 text-xs mt-2">Version 1.0.0</p>
            <div className="flex items-center justify-center gap-1 mt-3 text-slate-500 text-xs">
              <span>{language === 'fr' ? 'Mz.doungous' : language === 'ar' ? 'Mz.doungous' : 'Mz.doungous'}</span>
              <Heart className="w-3 h-3 text-red-400 fill-red-400" />
              <span>{language === 'fr' ? ' Tchad' : language === 'ar' ? ' تشاد' : ' Chad'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* City Picker Modal */}
      <AnimatePresence>
        {showCityPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowCityPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pb-19 w-full max-h-[70vh] bg-slate-900 rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 border-b border-slate-700/50">
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white text-center">{t.selectCity}</h3>
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

      {/* Method Picker Modal */}
      <AnimatePresence>
        {showMethodPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowMethodPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pb-12 w-full bg-slate-900 rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-700/50">
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white text-center">{t.calculationMethod}</h3>
              </div>
              <div className="p-4 space-y-2">
                {Object.entries(calculationMethods).map(([key, method]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      setCalculationMethod(method);
                      setShowMethodPicker(false);
                    }}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      calculationMethod.name === method.name
                        ? 'bg-emerald-500/20 border-2 border-emerald-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className={`font-semibold ${
                      calculationMethod.name === method.name ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {method.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Fajr: {method.fajrAngle}° | Isha: {method.ishaAngle}°{method.ishaMinutes ? ` (+${method.ishaMinutes}min)` : ''}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Picker Modal */}
      <AnimatePresence>
        {showLanguagePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" pb-18 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowLanguagePicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className=" w-full bg-slate-900 rounded-t-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-700/50">
                <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white text-center">{t.language}</h3>
              </div>
              <div className="p-4 space-y-2">
                {languages.map((lang) => (
                  <motion.button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as 'fr' | 'ar' | 'en');
                      setShowLanguagePicker(false);
                    }}
                    className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
                      language === lang.code
                        ? 'bg-emerald-500/20 border-2 border-emerald-500'
                        : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600'
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className={`font-semibold ${
                      language === lang.code ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {lang.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
