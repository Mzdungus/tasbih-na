import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Navigation2, MapPin, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore, translations } from '../lib/store';
import { calculateQiblaDirection } from '../lib/prayerTimes';

export default function Qibla() {
  const { selectedCity, language } = useAppStore();
  const t = translations[language];
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(true);
  const calibrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const qiblaDirection = calculateQiblaDirection(selectedCity.lat, selectedCity.lng);

  useEffect(() => {
    let lastHeading = 0;
    let calibrationCounter = 0;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const alpha = event.alpha ?? 0;
      
      // Smooth the heading value for better UX
      const smoothedHeading = lastHeading * 0.8 + alpha * 0.2;
      lastHeading = smoothedHeading;
      
      setDeviceHeading(smoothedHeading);
      
      // Increase calibration counter
      calibrationCounter++;
      
      // Stop calibration after enough samples
      if (calibrationCounter > 20) {
        setIsCalibrating(false);
        calibrationCounter = 0;
      }
    };

    const requestPermission = async () => {
      try {
        // Check if requestPermission method exists (iOS 13+)
        const DeviceOrientationEventTyped = DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<'granted' | 'denied'>;
        };
        
        if (typeof DeviceOrientationEventTyped.requestPermission === 'function') {
          const permission = await DeviceOrientationEventTyped.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          } else {
            setPermissionDenied(true);
            setIsCalibrating(false);
          }
        } else {
          // Non-iOS devices
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch (error) {
        console.error('Orientation error:', error);
        setIsCalibrating(false);
        
        // Fallback: use random simulation for desktop testing
        simulateDesktopCompass();
      }
    };

    const simulateDesktopCompass = () => {
      let angle = 0;
      const interval = setInterval(() => {
        angle = (angle + 0.5) % 360;
        setDeviceHeading(angle);
        setIsCalibrating(false);
      }, 50);
      
      return () => clearInterval(interval);
    };

    // Set a timeout for calibration indicator
    calibrationTimeoutRef.current = setTimeout(() => {
      setIsCalibrating(false);
    }, 3000);

    requestPermission();

    return () => {
      if (calibrationTimeoutRef.current) {
        clearTimeout(calibrationTimeoutRef.current);
      }
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const rotation = qiblaDirection - deviceHeading;
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  const handleRecalibrate = () => {
    setIsCalibrating(true);
    if (calibrationTimeoutRef.current) {
      clearTimeout(calibrationTimeoutRef.current);
    }
    calibrationTimeoutRef.current = setTimeout(() => {
      setIsCalibrating(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 rounded-2xl mb-4 backdrop-blur-sm border border-emerald-500/30">
          <Compass className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">{t.qibla}</h1>
        <div className="flex items-center justify-center gap-2 mt-3 text-slate-300">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">{selectedCity.name}</span>
        </div>
      </motion.div>

      {/* Compass Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative flex items-center justify-center px-4"
      >
        <div className="relative w-80 h-80">
          {/* Outer Ring with gradient */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md shadow-2xl shadow-emerald-500/20" />
          <div className="absolute inset-1 rounded-full border border-emerald-500/20" />
          
          {/* Compass Markings */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
            {/* Minute marks */}
            {[...Array(60)].map((_, i) => {
              const angle = (i * 6 * Math.PI) / 180;
              const isMain = i % 15 === 0;
              const isMedium = i % 5 === 0;
              const innerRadius = isMain ? 130 : isMedium ? 140 : 145;
              const outerRadius = 155;
              const x1 = 160 + innerRadius * Math.sin(angle);
              const y1 = 160 - innerRadius * Math.cos(angle);
              const x2 = 160 + outerRadius * Math.sin(angle);
              const y2 = 160 - outerRadius * Math.cos(angle);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMain ? '#10b981' : isMedium ? '#64748b' : '#475569'}
                  strokeWidth={isMain ? 2.5 : isMedium ? 1.5 : 1}
                  strokeLinecap="round"
                  opacity={isMain ? 1 : 0.8}
                />
              );
            })}
            {/* Cardinal Directions */}
            <text 
              x="160" y="32" 
              textAnchor="middle" 
              className="fill-emerald-400" 
              fontSize="18" 
              fontWeight="bold"
              letterSpacing="2"
            >
              N
            </text>
            <text 
              x="288" y="168" 
              textAnchor="middle" 
              className="fill-slate-400" 
              fontSize="16" 
              fontWeight="bold"
            >
              E
            </text>
            <text 
              x="160" y="298" 
              textAnchor="middle" 
              className="fill-slate-400" 
              fontSize="16" 
              fontWeight="bold"
            >
              S
            </text>
            <text 
              x="32" y="168" 
              textAnchor="middle" 
              className="fill-slate-400" 
              fontSize="16" 
              fontWeight="bold"
            >
              W
            </text>
          </svg>

          {/* North Indicator Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-emerald-400 to-transparent rounded-full" />

          {/* Qibla Arrow - Animated rotation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: normalizedRotation }}
            transition={{ type: 'spring', stiffness: 40, damping: 12, mass: 1 }}
          >
            <div className="relative w-40 h-40 flex items-center justify-center">
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="relative"
              >
                <Navigation2 className="w-16 h-16 text-emerald-400 drop-shadow-2xl" 
                  style={{ filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.5))' }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Kaaba Icon */}
          <motion.div
            className="absolute inset-0 flex items-start justify-center pointer-events-none pt-6"
            animate={{ rotate: normalizedRotation }}
            transition={{ type: 'spring', stiffness: 40, damping: 12, mass: 1 }}
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-2 shadow-lg shadow-emerald-500/50"
            >
              <span className="text-2xl">🕋</span>
            </motion.div>
          </motion.div>

          {/* Center Point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-slate-900 rounded-full border-4 border-emerald-400 z-20 shadow-lg shadow-emerald-400/50" />
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="space-y-3 max-w-sm mx-auto">
        {/* Direction Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className=" bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30 shadow-xl"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-300 font-medium text-sm uppercase tracking-wide">{t.direction}</span>
            <span className="text-3xl font-bold text-emerald-400">
              {qiblaDirection.toFixed(1)}°
            </span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: `${(qiblaDirection / 360) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/30 shadow-xl"
        >
          <p className=" text-slate-300 text-sm text-center">
            {language === 'fr' 
              ? `La Qibla est à ${qiblaDirection.toFixed(1)}° du Nord magnétique`
              : language === 'ar'
              ? `القبلة على بُعد ${qiblaDirection.toFixed(1)}° من الشمال المغناطيسي`
              : `Qibla is ${qiblaDirection.toFixed(1)}° from magnetic North`
            }
          </p>
        </motion.div>
      </div>

      {/* Alerts */}
      <div className="space-y-3 mt-6 max-w-sm mx-auto">
        {/* Calibration Notice */}
        <AnimatePresence>
          {isCalibrating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl flex items-center gap-3 border border-amber-500/30"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <RefreshCw className="w-5 h-5 text-amber-400" />
              </motion.div>
              <div className="flex-1">
                <p className="text-amber-200 text-sm font-medium">
                  {language === 'fr'
                    ? 'Calibration en cours...'
                    : language === 'ar'
                    ? 'جاري المعايرة...'
                    : 'Calibrating...'
                  }
                </p>
                <p className="text-amber-300/70 text-xs">
                  {language === 'fr'
                    ? 'Bougez votre appareil'
                    : language === 'ar'
                    ? 'حرك جهازك'
                    : 'Move your device'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Permission Denied */}
        {permissionDenied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm rounded-2xl flex items-center gap-3 border border-red-500/30"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-200 text-sm font-medium">
                {language === 'fr'
                  ? 'Permission refusée'
                  : language === 'ar'
                  ? 'تم رفض الإذن'
                  : 'Permission denied'
                }
              </p>
              <p className="text-red-300/70 text-xs">
                {language === 'fr'
                  ? 'Veuillez autoriser l\'accès au capteur'
                  : language === 'ar'
                  ? 'يرجى السماح بالوصول إلى المستشعر'
                  : 'Please allow sensor access'
                }
              </p>
            </div>
            <motion.button
              onClick={handleRecalibrate}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 bg-red-500/50 hover:bg-red-500/70 rounded-lg text-xs font-medium text-red-100 transition-colors flex-shrink-0"
            >
              {language === 'fr' ? 'Réessayer' : language === 'ar' ? 'إعادة محاولة' : 'Retry'}
            </motion.button>
          </motion.div>
        )}

        {/* Recalibrate Button */}
        {!permissionDenied && !isCalibrating && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleRecalibrate}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 hover:from-emerald-500/50 hover:to-teal-500/50 rounded-xl text-emerald-300 font-medium flex items-center justify-center gap-2 transition-all border border-emerald-500/30"
          >
            <RefreshCw className="w-4 h-4" />
            {language === 'fr' ? 'Recalibrer' : language === 'ar' ? 'إعادة معايرة' : 'Recalibrate'}
          </motion.button>
        )}
      </div>
    </div>
  );
}
