/**
 * Composant modal pour configurer les réglages d'Azaan pour une prière
 * Permet de choisir entre 2 sons d'Azaan ou désactiver la notification
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useAppStore, translations } from '../lib/store';
import { playAzaanPreview, type AzaanType, scheduleAzaanNotification } from '../lib/azaanNotifications';

interface PrayerAzaanSettingsProps {
  isOpen: boolean;
  prayerName: string;
  prayerTime: string;
  onClose: () => void;
}

export default function PrayerAzaanSettings({
  isOpen,
  prayerName,
  prayerTime,
  onClose,
}: PrayerAzaanSettingsProps) {
  const { language, setAzaanPreference, getAzaanPreference } = useAppStore();
  const t = translations[language];
  
  const currentPreference = getAzaanPreference(prayerName);
  const [selectedAzaan, setSelectedAzaan] = useState<AzaanType>(currentPreference.azaanType);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  /**
   * Gère le clic sur le bouton de preview
   */
  const handlePlayPreview = async (azaanType: AzaanType) => {
    if (azaanType === 'disabled') return;
    
    setIsPreviewPlaying(true);
    try {
      await playAzaanPreview(azaanType);
      // Le son joue en background, désactiver l'indicateur après 3 secondes
      setTimeout(() => setIsPreviewPlaying(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la lecture du preview:', error);
      setIsPreviewPlaying(false);
    }
  };

  /**
   * Gère la sauvegarde de la préférence
   */
  const handleSave = async () => {
    // Sauvegarder la préférence
    setAzaanPreference(prayerName, { azaanType: selectedAzaan });

    // Programmer la notification pour demain
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await scheduleAzaanNotification({
      prayerName,
      time: prayerTime,
      azaanType: selectedAzaan,
      date: tomorrow,
    });

    onClose();
  };

  const azaanOptions: Array<{
    type: AzaanType;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      type: 'azaan1',
      label: t.azaanAudio1,
      description: 'Son traditionnel classique',
      icon: <Volume2 className="w-6 h-6" />,
    },
    {
      type: 'azaan2',
      label: t.azaanAudio2,
      description: 'Son alternatif moderne',
      icon: <Volume2 className="w-6 h-6" />,
    },
    {
      type: 'disabled',
      label: t.disableAzaan,
      description: 'Pas de notification',
      icon: <VolumeX className="w-6 h-6" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pb-12 fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className=" w-full max-h-[80vh] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 rounded-t-3xl overflow-hidden"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 p-6 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
              <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {language === 'ar' ? 'إعدادات الأذان' : 'Réglages de l\'Azaan'}
                </h2>
                <p className="text-slate-400 text-sm mt-2">
                  {language === 'ar' ? `صلاة ${prayerName} - ${prayerTime}` : `Prière de ${prayerName} - ${prayerTime}`}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-4 overflow-y-auto max-h-[calc(80vh-200px)]">
              {/* Explications */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <p className="text-sm text-slate-300">
                  {language === 'ar'
                    ? 'اختر صوت الأذان المفضل لديك أو عطل الإشعار'
                    : 'Choisissez votre son d\'Azaan préféré ou désactivez la notification'}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {azaanOptions.map((option) => (
                  <motion.button
                    key={option.type}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAzaan(option.type)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAzaan === option.type
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/60 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-800/30 border-slate-700/30 hover:border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      {/* Contenu à gauche */}
                      <div className="flex items-start gap-4 flex-1 text-left">
                        <div
                          className={`p-3 rounded-xl mt-0.5 ${
                            selectedAzaan === option.type
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-700/50 text-slate-400'
                          }`}
                        >
                          {option.icon}
                        </div>
                        <div>
                          <h3
                            className={`font-semibold text-lg ${
                              selectedAzaan === option.type ? 'text-emerald-400' : 'text-white'
                            }`}
                          >
                            {option.label}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">{option.description}</p>
                        </div>
                      </div>

                      {/* Actions à droite */}
                      <div className="flex items-center gap-2">
                        {/* Bouton Preview */}
                        {option.type !== 'disabled' && (
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              handlePlayPreview(option.type);
                            }}
                            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                            disabled={isPreviewPlaying}
                          >
                            <PlayCircle className="w-5 h-5" />
                          </motion.button>
                        )}

                        {/* Checkmark */}
                        {selectedAzaan === option.type && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          >
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-6 p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 space-y-2">
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">💡 Conseil : </span>
                  {language === 'ar'
                    ? 'جرب الأصوات المختلفة واختر ما يناسبك أفضل'
                    : 'Testez les différents sons et choisissez celui qui vous plaît le plus'}
                </p>
              </div>
            </div>

            {/* Footer avec boutons */}
            <div className="sticky bottom-0 p-6 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-xl flex gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-600 text-white hover:bg-slate-800 transition-colors font-semibold"
              >
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30 transition-all font-semibold"
              >
                {language === 'ar' ? 'حفظ' : 'Enregistrer'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
