import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleDot, RotateCcw, Target, Volume2, VolumeX, Vibrate,  ThumbsUp } from 'lucide-react';
import { useAppStore, translations } from '../lib/store';

export default function Tasbih({ compact }: { compact?: boolean } = {}) {
  const { language, tasbihCount, tasbihTarget, setTasbihTarget, incrementTasbih, resetTasbih } = useAppStore();
  const t = translations[language];
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const targets = [33, 34, 99, 100, 500, 1000];
  const progress = Math.min((tasbihCount / tasbihTarget) * 100, 100);

  const handleTap = () => {
    incrementTasbih();
    
    // Vibration feedback
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Sound feedback
    if (soundEnabled) {
      // Access AudioContext with proper type handling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    }
  };

  useEffect(() => {
    if (tasbihCount > 0 && tasbihCount % tasbihTarget === 0) {
      // Schedule state update via setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }, 0);
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
      }
    }
  }, [tasbihCount, tasbihTarget, vibrationEnabled]);

  const rootClass = compact ? 'w-full' : 'min-h-screen pb-24 pt-10 px-4';

  return (
    <div className={rootClass}>
      {/* Header */}
      <div className={compact ? 'text-left mb-6 px-4' : 'text-center mb-10'}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={compact ? 'inline-flex items-center justify-center w-10 h-10 bg-emerald-500/20 rounded-full mb-2' : 'inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4'}
        >
          <CircleDot className="w-8 h-8 text-emerald-400" />
        </motion.div>
        <h1 className={compact ? 'text-lg font-bold text-white' : 'text-2xl font-bold text-white'}>{t.tasbih}</h1>
        {!compact && (
          <p className="text-slate-400 text-sm mt-1">
            {language === 'fr' ? 'Compteur de Dhikr' : language === 'ar' ? 'عداد الذكر' : 'Dhikr Counter'}
          </p>
        )}
      </div>

      {/* Progress Ring */}
      <div className="relative flex items-center justify-center my-10">
        <svg className="w-72 h-72 transform -rotate-90">
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="#1e293b"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="144"
            cy="144"
            r="130"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
            initial={{ strokeDashoffset: 2 * Math.PI * 130 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 130 * (1 - progress / 100) }}
            transition={{ duration: 0.3 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tap Button */}
        <motion.button
          onClick={handleTap}
          className={compact ? 'absolute w-36 h-36 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-center' : 'absolute w-56 h-56 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border-4 border-slate-700 shadow-2xl flex flex-col items-center justify-center'}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <motion.span
            key={tasbihCount}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={compact ? 'text-4xl font-bold text-white' : 'text-6xl font-bold text-white'}
          >
            {tasbihCount}
          </motion.span>
          <span className="text-slate-400 text-sm mt-2">
            {language === 'fr' ? 'Appuyez' : language === 'ar' ? 'اضغط' : 'Tap'}
          </span>
        </motion.button>
      </div>

      {/* Target Display */}
      <motion.button
        onClick={() => setShowTargetPicker(true)}
        className="mx-auto flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50"
        whileTap={{ scale: 0.95 }}
      >
        <Target className="w-4 h-4 text-emerald-400" />
        <span className="text-white">{t.target}: {tasbihTarget}</span>
      </motion.button>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <motion.button
          onClick={resetTasbih}
          className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50 text-white"
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          {t.reset}
        </motion.button>
        <motion.button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-3 rounded-xl border ${
            soundEnabled 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>
        <motion.button
          onClick={() => setVibrationEnabled(!vibrationEnabled)}
          className={`p-3 rounded-xl border ${
            vibrationEnabled 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <Vibrate className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Quick Dhikr Suggestions */}
      <div className="mt-8">
        <h3 className="text-slate-400 text-sm mb-3 text-center">
          {language === 'fr' ? 'Suggestions de Dhikr' : language === 'ar' ? 'اقتراحات الذكر' : 'Dhikr Suggestions'}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { ar: 'سبحان الله', count: 33 },
            { ar: 'الحمد لله', count: 33 },
            { ar: 'الله أكبر', count: 33 },
          ].map((dhikr, i) => (
            <motion.button
              key={i}
              onClick={() => {
                setTasbihTarget(dhikr.count);
                resetTasbih();
              }}
              className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 text-center hover:bg-slate-800/50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <p className="text-lg font-arabic text-emerald-400">{dhikr.ar}</p>
              <p className="text-xs text-slate-400 mt-1">{dhikr.count}x</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Target Picker Modal */}
      <AnimatePresence>
        {showTargetPicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-14 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
            onClick={() => setShowTargetPicker(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-slate-900 rounded-t-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white text-center mb-4">
                {language === 'fr' ? 'Choisir un objectif' : language === 'ar' ? 'اختر الهدف' : 'Choose Target'}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {targets.map((target) => (
                  <motion.button
                    key={target}
                    onClick={() => {
                      setTasbihTarget(target);
                      setShowTargetPicker(false);
                    }}
                    className={`p-4 rounded-xl text-center font-bold ${
                      tasbihTarget === target
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    {target}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-8xl mb-4"
              >
                <ThumbsUp className="w-16 h-16 text-emerald-400 mx-auto" />
              </motion.div>
              <p className="text-2xl font-bold text-emerald-400">
                {language === 'fr' ? 'Objectif atteint!' : language === 'ar' ? 'تم الوصول للهدف!' : 'Target Reached!'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
