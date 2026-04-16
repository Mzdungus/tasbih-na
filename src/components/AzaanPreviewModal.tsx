
import React, { useState, useRef, useEffect } from 'react';
import azaan1 from '../data/azaan/1.mp3';
import azaan2 from '../data/azaan/2.mp3';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Pause, BellOff } from 'lucide-react';

interface AzaanPreviewModalProps {
  onClose: () => void;
  onConfirm: (azaan: string) => void;
}

const azaans = [
  { id: '1', name: 'Azaan 1', path: azaan1 },
  { id: '2', name: 'Azaan 2', path: azaan2 },
];

const AzaanPreviewModal: React.FC<AzaanPreviewModalProps> = ({ onClose, onConfirm }) => {
  const [selectedAzaan, setSelectedAzaan] = useState('1');
  const [playingAzaan, setPlayingAzaan] = useState<string | null>(null);
  const [progress, setProgress] = useState<number[]>(Array(azaans.length).fill(0));
  const [loading, setLoading] = useState<boolean[]>(Array(azaans.length).fill(false));
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  useEffect(() => {
    audioRefs.current = audioRefs.current.slice(0, azaans.length);
    setLoading(Array(azaans.length).fill(false));
  }, []);

  const stopAllAudio = () => {
    audioRefs.current.forEach((audio) => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setProgress(Array(azaans.length).fill(0));
    setPlayingAzaan(null);
    setLoading(Array(azaans.length).fill(false));
  };

  const stopAzaan = (id: string) => {
    const index = azaans.findIndex(a => a.id === id);
    if (index === -1) return;
    const audio = audioRefs.current[index];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    if (playingAzaan === id) {
      setPlayingAzaan(null);
    }
    setProgress(prev => {
      const copy = [...prev];
      copy[index] = 0;
      return copy;
    });
    setLoading(prev => {
      const copy = [...prev];
      copy[index] = false;
      return copy;
    });
  };

  const playAzaan = (id: string) => {
    const index = azaans.findIndex(a => a.id === id);
    if (index === -1) return;

    const audio = audioRefs.current[index];
    if (!audio) return;
    // Prevent duplicate rapid plays and prepare audio
    stopAllAudio();

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {}

    setProgress(prev => {
      const copy = [...prev];
      copy[index] = 0;
      return copy;
    });

    setLoading(prev => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });

    setPlayingAzaan(id);

    const attemptPlay = () => {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setLoading(prev => {
            const copy = [...prev];
            copy[index] = false;
            return copy;
          });
        }).catch((error) => {
          console.error('play() failed, retrying after load():', error);
          try {
            audio.load();
          } catch (e) {}
          // second attempt
          audio.play().then(() => {
            setLoading(prev => {
              const copy = [...prev];
              copy[index] = false;
              return copy;
            });
          }).catch((err2) => {
            console.error('Second play() failed:', err2);
            setPlayingAzaan(null);
            setLoading(prev => {
              const copy = [...prev];
              copy[index] = false;
              return copy;
            });
          });
        });
      }
    };

    attemptPlay();
  };

  // Ensure audio stops if the modal/unmount happens unexpectedly
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const handleClose = () => {
    stopAllAudio();
    setPlayingAzaan(null);
    onClose();
  };
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full bg-slate-900 rounded-t-3xl shadow-lg"
        >
          <div className="p-4 border-b border-slate-700/50">
            <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-bold text-center text-white">Prévisualiser Azaan</h2>
          </div>

          <div className="p-6 space-y-4">
            {azaans.map((azaan, index) => (
              <div key={azaan.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    id={`azaan-${azaan.id}`}
                    name="azaan"
                    value={azaan.id}
                    checked={selectedAzaan === azaan.id}
                    onChange={() => setSelectedAzaan(azaan.id)}
                    className="w-5 h-5 text-emerald-500 bg-slate-700 border-slate-600 focus:ring-emerald-500"
                  />
                  <label htmlFor={`azaan-${azaan.id}`} className="text-white text-lg">{azaan.name}</label>
                </div>
                <div className="flex flex-col items-end gap-2 w-48">
                  <div className="flex items-center gap-2">
                    <button
                        onClick={() => playAzaan(azaan.id)}
                        className={`p-2 text-white rounded-full ${playingAzaan === azaan.id ? 'bg-emerald-600' : 'bg-slate-700'}`}
                        aria-pressed={playingAzaan === azaan.id}
                        disabled={loading[index] || playingAzaan === azaan.id}
                    >
                        <Volume2 size={20} />
                    </button>
                    <button
                      onClick={() => stopAzaan(azaan.id)}
                      className={`p-2 text-white rounded-full ${playingAzaan === azaan.id ? 'bg-red-600' : 'bg-slate-700'}`}
                    >
                      <Pause size={20} />
                    </button>
                    {loading[index] && <span className="ml-2 text-sm text-slate-300">…</span>}
                    <span className={`ml-2 text-sm font-medium ${playingAzaan === azaan.id ? 'text-emerald-300' : 'text-slate-400'}`}>
                      {playingAzaan === azaan.id ? 'Lecture' : 'Arrêt'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded overflow-hidden">
                    <div style={{ width: `${progress[index] ?? 0}%` }} className="h-2 bg-emerald-500 rounded" />
                  </div>
                </div>
                <audio
                  ref={(el) => { audioRefs.current[index] = el; }}
                  preload="auto"
                  onCanPlayThrough={() => {
                    setLoading(prev => {
                      const copy = [...prev];
                      copy[index] = false;
                      return copy;
                    });
                  }}
                  src={azaan.path}
                  onEnded={() => {
                    setPlayingAzaan(null);
                    setProgress(prev => {
                      const copy = [...prev];
                      copy[index] = 100;
                      return copy;
                    });
                    // reset progress shortly after end
                    setTimeout(() => {
                      setProgress(prev => {
                        const copy = [...prev];
                        copy[index] = 0;
                        return copy;
                      });
                    }, 800);
                  }}
                  onTimeUpdate={(e) => {
                    const current = e.currentTarget.currentTime || 0;
                    const dur = e.currentTarget.duration || 0;
                    const percent = dur ? (current / dur) * 100 : 0;
                    setProgress(prev => {
                      const copy = [...prev];
                      copy[index] = percent;
                      return copy;
                    });
                  }}
                  onError={() => {
                    console.error(`Erreur lors du chargement de ${azaan.name}`);
                    setPlayingAzaan(null);
                  }}
                />
              </div>
            ))}
             <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-4">
                    <input
                        type="radio"
                        id="azaan-disabled"
                        name="azaan"
                        value="disabled"
                        checked={selectedAzaan === 'disabled'}
                        onChange={() => setSelectedAzaan('disabled')}
                        className="w-5 h-5 text-emerald-500 bg-slate-700 border-slate-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="azaan-disabled" className="text-white text-lg">Désactiver notification</label>
                </div>
                <BellOff size={20} className="text-slate-500"/>
            </div>
          </div>

          <div className="sticky bottom-0 p-4 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50">
            <div className="flex gap-4">
              <button onClick={handleClose} className="w-1/2 px-4 py-3 text-white bg-slate-700 rounded-xl font-semibold">Annuler</button>
              <button onClick={() => onConfirm(selectedAzaan)} className="w-1/2 px-4 py-3 bg-emerald-500 text-white rounded-xl font-semibold">Confirmer</button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AzaanPreviewModal;
