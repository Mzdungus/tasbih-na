import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Heart, ChevronRight, X, Repeat } from 'lucide-react';
import { useAppStore, translations } from '../lib/store';
import { adhkar, dailyDuas } from '../lib/quran';

export default function Adhkar() {
  const { language } = useAppStore();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'adhkar' | 'duas'>('adhkar');
  const [selectedDhikr, setSelectedDhikr] = useState<typeof adhkar[0] | null>(null);
  const [dhikrCounts, setDhikrCounts] = useState<Record<number, number>>({});

  const incrementDhikr = (index: number) => {
    setDhikrCounts(prev => ({
      ...prev,
      [index]: (prev[index] || 0) + 1
    }));
  };

  const resetDhikr = (index: number) => {
    setDhikrCounts(prev => ({
      ...prev,
      [index]: 0
    }));
  };

  return (
    <div className="min-h-screen pb-24 pt-10">
      {/* Header */}
      <div className="px-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <BookMarked className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t.adhkar} & {t.duas}</h1>
            <p className="text-slate-400 text-sm">
              {language === 'fr' ? 'Invocations quotidiennes' : language === 'ar' ? 'الأذكار اليومية' : 'Daily Remembrances'}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
          <button
            onClick={() => setActiveTab('adhkar')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'adhkar'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.adhkar}
          </button>
          <button
            onClick={() => setActiveTab('duas')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === 'duas'
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.duas}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'adhkar' ? (
            <motion.div
              key="adhkar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {adhkar.map((dhikr, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 overflow-hidden"
                >
                  <button
                    onClick={() => setSelectedDhikr(dhikr)}
                    className="w-full p-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <p className="text-2xl font-arabic text-emerald-400 text-right leading-loose mb-3">
                      {dhikr.arabic}
                    </p>
                    <p className="text-white font-medium">{dhikr.transliteration}</p>
                    <p className="text-slate-400 text-sm mt-1">{dhikr.translation}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                        {dhikr.count}x
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </button>
                  
                  {/* Counter */}
                  <div className="border-t border-slate-700/30 p-3 flex items-center justify-between bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">
                        {language === 'fr' ? 'Compteur' : language === 'ar' ? 'العداد' : 'Counter'}:
                      </span>
                      <span className={`font-bold ${
                        (dhikrCounts[index] || 0) >= dhikr.count ? 'text-emerald-400' : 'text-white'
                      }`}>
                        {dhikrCounts[index] || 0}/{dhikr.count}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => incrementDhikr(index)}
                        className="px-4 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium"
                        whileTap={{ scale: 0.9 }}
                      >
                        +1
                      </motion.button>
                      <motion.button
                        onClick={() => resetDhikr(index)}
                        className="p-1.5 bg-slate-700 text-slate-300 rounded-lg"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Repeat className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="duas"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {dailyDuas.map((dua, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold">{dua.title}</h3>
                      <p className="text-emerald-400 text-sm font-arabic">{dua.titleAr}</p>
                    </div>
                    <Heart className="w-5 h-5 text-slate-500" />
                  </div>
                  <p className="text-2xl font-arabic text-emerald-400 text-right leading-loose mb-3">
                    {dua.arabic}
                  </p>
                  <p className="text-slate-300 text-sm italic mb-2">{dua.transliteration}</p>
                  <p className="text-slate-400 text-sm">{dua.translation}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

        {/* Dhikr Detail Modal */}
      <AnimatePresence>
        {selectedDhikr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedDhikr(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-8 bg-gradient-to-br from-emerald-600 to-teal-700">
                <button
                  onClick={() => setSelectedDhikr(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 rounded-full"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <p className="text-4xl font-arabic text-white text-center leading-loose">
                  {selectedDhikr.arabic}
                </p>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{selectedDhikr.transliteration}</h3>
                <p className="text-slate-400 mb-4">{selectedDhikr.translation}</p>
                <div className="bg-slate-800/50 rounded-xl p-4">
                  <p className="text-emerald-400 text-sm font-medium mb-1">
                    {language === 'fr' ? 'Bienfait' : language === 'ar' ? 'الفائدة' : 'Benefit'}
                  </p>
                  <p className="text-slate-300">{selectedDhikr.benefit}</p>
                </div>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-slate-400">
                    {language === 'fr' ? 'Répéter' : language === 'ar' ? 'كرر' : 'Repeat'}
                  </span>
                  <span className="text-2xl font-bold text-emerald-400">{selectedDhikr.count}</span>
                  <span className="text-slate-400">
                    {language === 'fr' ? 'fois' : language === 'ar' ? 'مرة' : 'times'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  );
}
