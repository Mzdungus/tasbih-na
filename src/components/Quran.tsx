import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Bookmark, BookmarkCheck, ChevronRight, X } from 'lucide-react';
import { useAppStore, translations } from '../lib/store';
import { surahs } from '../lib/quran';
import type { Surah } from '../lib/quran';

export default function Quran() {
  const { language, bookmarkedSurahs, toggleBookmark, setLastReadSurah } = useAppStore();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'meccan' | 'medinan' | 'bookmarks'>('all');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch = 
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.nameAr.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.number.toString() === searchQuery;
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'meccan' && surah.revelationType === 'Meccan') ||
      (filter === 'medinan' && surah.revelationType === 'Medinan') ||
      (filter === 'bookmarks' && bookmarkedSurahs.includes(surah.number));

    return matchesSearch && matchesFilter;
  });

  const filterButtons = [
    { id: 'all', label: language === 'ar' ? 'الكل' : language === 'fr' ? 'Tout' : 'All' },
    { id: 'meccan', label: t.meccan },
    { id: 'medinan', label: t.medinan },
    { id: 'bookmarks', label: t.bookmarks },
  ];

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
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{t.quran}</h1>
            <p className="text-slate-400 text-sm">114 {t.surahs}</p>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={`${t.search}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {filterButtons.map((btn) => (
            <motion.button
              key={btn.id}
              onClick={() => setFilter(btn.id as 'all' | 'meccan' | 'medinan' | 'bookmarks')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === btn.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {btn.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Surah List */}
      <div className="px-4 space-y-3">
        {filteredSurahs.map((surah, index) => (
          <motion.div
            key={surah.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 overflow-hidden"
          >
            <button
              onClick={() => {
                setSelectedSurah(surah);
                setLastReadSurah(surah.number);
              }}
              className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                <span className="text-emerald-400 font-bold">{surah.number}</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-semibold">{surah.name}</h3>
                <p className="text-slate-400 text-sm">{surah.englishName} • {surah.versesCount} {t.verses}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-arabic text-emerald-400">{surah.nameAr}</span>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(surah.number);
                  }}
                  whileTap={{ scale: 0.8 }}
                  className="p-2"
                >
                  {bookmarkedSurahs.includes(surah.number) ? (
                    <BookmarkCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-slate-500" />
                  )}
                </motion.button>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            </button>
          </motion.div>
        ))}

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {language === 'fr' ? 'Aucune sourate trouvée' : language === 'ar' ? 'لم يتم العثور على سورة' : 'No surahs found'}
            </p>
          </div>
        )}
      </div>

      {/* Surah Detail Modal */}
      <AnimatePresence>
        {selectedSurah && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedSurah(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full h-screen bg-slate-900 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-36 bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center flex-shrink-0">
                <button
                  onClick={() => setSelectedSurah(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                <div className="text-center">
                  <h2 className="text-4xl font-arabic text-white mb-1">{selectedSurah.nameAr}</h2>
                  <p className="text-white/80 text-lg">{selectedSurah.name}</p>
                  <p className="text-white/60 text-xs mt-0.5">{selectedSurah.englishName}</p>
                </div>
              </div>

              {/* Info and Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-sm">{t.verses}</p>
                    <p className="text-2xl font-bold text-white">{selectedSurah.versesCount}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-sm">
                      {language === 'fr' ? 'Révélation' : language === 'ar' ? 'النزول' : 'Revelation'}
                    </p>
                    <p className="text-lg font-bold text-emerald-400">
                      {selectedSurah.revelationType === 'Meccan' ? t.meccan : t.medinan}
                    </p>
                  </div>
                </div>
                {/* Bismillah */}
                <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-emerald-500/20 mb-8">
                  <p className="text-2xl font-arabic text-emerald-400 leading-relaxed">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                  <p className="text-slate-400 mt-2 text-sm">
                    {language === 'fr' 
                      ? 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux'
                      : language === 'ar'
                      ? 'بسم الله الرحمن الرحيم'
                      : 'In the name of Allah, the Most Gracious, the Most Merciful'
                    }
                  </p>
                </div>

                {/* Verses */}
                {selectedSurah.verses && selectedSurah.verses.length > 0 ? (
                  <div className="space-y-8">
                    {selectedSurah.verses.map((verse, index) => (
                      <motion.div
                        key={verse.number}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="pb-8 border-b border-slate-700/30 last:border-b-0"
                      >
                        {/* Verse number */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
                            {language === 'fr' ? 'Verset' : language === 'ar' ? 'الآية' : 'Verse'} {verse.number}
                          </span>
                        </div>

                        {/* Arabic text - prioritized */}
                        <p className="text-xl font-arabic text-white leading-loose text-right mb-6">
                          {verse.text}
                        </p>

                        {/* Translation */}
                        {verse.translation && (
                          <p className="text-slate-300 text-base leading-relaxed pl-4 border-l-2 border-emerald-500/40">
                            {verse.translation}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-800/30 rounded-xl">
                    <BookOpen className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">
                      {language === 'fr' ? 'Les versets de cette sourate ne sont pas disponibles' : language === 'ar' ? 'آيات هذه السورة غير متاحة' : 'Verses not available'}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer with bookmark button */}
              <div className="border-t border-slate-700/50 p-4 flex-shrink-0 bg-slate-800/50">
                <motion.button
                  onClick={() => toggleBookmark(selectedSurah.number)}
                  className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    bookmarkedSurahs.includes(selectedSurah.number)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {bookmarkedSurahs.includes(selectedSurah.number) ? (
                    <><BookmarkCheck className="w-5 h-5" /> {language === 'fr' ? 'Retirer des favoris' : language === 'ar' ? 'إزالة من المفضلة' : 'Remove from Bookmarks'}</>
                  ) : (
                    <><Bookmark className="w-5 h-5" /> {language === 'fr' ? 'Ajouter aux favoris' : language === 'ar' ? 'إضافة إلى المفضلة' : 'Add to Bookmarks'}</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
  