import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import PrayerTimes from './components/PrayerTimes';
import Qibla from './components/Qibla';
import Quran from './components/Quran';
import Adhkar from './components/Adhkar';
import Tasbih from './components/Tasbih';
import Settings from './components/Settings';
import { useAppStore } from './lib/store';

function App() {
  const [activeTab, setActiveTab] = useState('prayer');
  const { language, theme } = useAppStore();

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  }, [theme]);

  const renderContent = () => {
    switch (activeTab) {
      case 'prayer':
        return <PrayerTimes />;
      case 'qibla':
        return <Qibla />;
      case 'quran':
        return <Quran />;
      case 'adhkar':
        return <Adhkar />;
      case 'tasbih':
        return <Tasbih />;
      case 'settings':
        return <Settings />;
      default:
        return <PrayerTimes />;
    }
  };

  const isDarkTheme = theme === 'dark';
  const bgClass = isDarkTheme 
    ? 'bg-slate-900' 
    : 'bg-white';
  const bgStyle = isDarkTheme
    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)';

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${bgClass} ${language === 'ar' ? 'rtl' : 'ltr'}`}
      style={{
        background: bgStyle,
      }}
    >
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isDarkTheme ? 'bg-emerald-500/5' : 'bg-emerald-500/10'}`} />
        <div className={`absolute bottom-1/4 right-0 w-80 h-80 rounded-full blur-3xl ${isDarkTheme ? 'bg-teal-500/5' : 'bg-teal-500/10'}`} />
        <div className={`absolute top-1/2 left-0 w-64 h-64 rounded-full blur-3xl ${isDarkTheme ? 'bg-emerald-600/5' : 'bg-emerald-600/10'}`} />
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.1 }}
          className="relative z-10 pb-24"
        >
          {renderContent()}
        </motion.main>
      </AnimatePresence>

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
