import { motion } from 'framer-motion';
import { Clock, Compass, BookOpen, Settings, BookMarked, CircleDot } from 'lucide-react';
import { useAppStore, translations } from '../lib/store';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const { language } = useAppStore();
  const t = translations[language];

  const tabs = [
    { id: 'prayer', icon: Clock, label: t.prayerTimes },
    { id: 'qibla', icon: Compass, label: t.qibla },
    { id: 'quran', icon: BookOpen, label: t.quran },
    { id: 'adhkar', icon: BookMarked, label: t.adhkar },
    { id: 'tasbih', icon: CircleDot, label: t.tasbih },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-slate-900/95 to-slate-900/90 backdrop-blur-xl border-t border-emerald-500/20 light-theme-nav">
      <div className="max-w-lg mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200 light-theme-nav-inactive'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-emerald-500/15 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
