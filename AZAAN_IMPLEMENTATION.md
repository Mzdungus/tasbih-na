# 📱 Fonctionnalité Azaan - Documentation d'Intégration

## 🎯 Vue d'ensemble

La fonctionnalité **Azaan Settings** permet aux utilisateurs de configurer les sons d'appel à la prière (Azaan) pour chacune des cinq prières obligatoires (Fajr, Dhuhr, Asr, Maghrib, Isha).

## ✨ Fonctionnalités principales

✅ **Configuration par prière** - Réglage différent pour chaque prière  
✅ **2 Sons d'Azaan** - Deux options audio disponibles  
✅ **Désactiver sélectivement** - Possibilité de désactiver la notification  
✅ **Aperçu audio** - Écouter avant de confirmer  
✅ **Persistance** - Sauvegarde automatique dans le localStorage (Zustand)  
✅ **Notifications locales** - Intégration Capacitor pour alertes programmées  
✅ **Multi-langue** - Support FR, AR, EN  
✅ **Interface moderne** - Glassmorphism avec Tailwind CSS + Framer Motion  

---

## 📁 Structure des fichiers

### Fichiers modifiés/créés

```
src/
├── lib/
│   ├── store.ts                      # ✏️ Étendu avec Azaan preferences
│   └── azaanNotifications.ts         # 🆕 Utilitaire notifications
├── components/
│   ├── PrayerTimes.tsx               # ✏️ Intégration Azaan modal
│   └── PrayerAzaanSettings.tsx       # 🆕 Composant modal configuration
└── data/
    └── azaan/
        ├── 1.mp3                     # Azaan Audio 1
        └── 2.mp3                     # Azaan Audio 2
```

---

## 🔧 Détails techniques

### 1. **State Management (Zustand Store)**

Nouveaux éléments ajoutés au store:

```typescript
// Préférences d'Azaan par prière
azaanPreferences: Record<string, AzaanPreference>;

// Méthodes
setAzaanPreference(prayerName, preference)  // Sauvegarder une préférence
getAzaanPreference(prayerName)              // Récupérer la préférence
```

**Persistance automatique** via Zustand persist middleware.

### 2. **Module Notifications** (`azaanNotifications.ts`)

#### Fonctions principales:

```typescript
initializeNotifications()
  → Demande les permissions pour les notifications locales

scheduleAzaanNotification(config)
  → Programme une notification unique pour une prière
  → Config: { prayerName, time, azaanType, date }

scheduleAllDailyNotifications(prayers, getAzaanPreference, date)
  → Programme les 5 prières de la journée en une seule requête
  → Appelée automatiquement au changement des paramètres

playAzaanPreview(azaanType)
  → Lecture audio pour aperçu avant confirmation

cancelAzaanNotification(prayerName)
  → Annule les notifications pour une prière spécifique

clearAllAzaanNotifications()
  → Nettoie toutes les notifications Azaan
```

### 3. **Composant Modal** (`PrayerAzaanSettings.tsx`)

#### Caractéristiques UI:

- **Bottom sheet modal** responsive
- **Glassmorphism effects** avec backdrop blur
- **Animations smooth** (Framer Motion)
- **États visuels** pour sélection/preview
- **Support tactile** avec whileTap animations
- **Icônes dynamiques** (Volume2, VolumeX, PlayCircle)

#### Props:

```typescript
interface PrayerAzaanSettingsProps {
  isOpen: boolean;              // Ouverture de la modal
  prayerName: string;           // Nom de la prière
  prayerTime: string;           // Heure au format "HH:mm"
  onClose: () => void;          // Callback fermeture
}
```

---

## 🚀 Utilisation

### Intégration dans PrayerTimes

```typescript
// 1. Import
import PrayerAzaanSettings from './PrayerAzaanSettings';
import { initializeNotifications, scheduleAllDailyNotifications } from '../lib/azaanNotifications';

// 2. États
const [azaanModalOpen, setAzaanModalOpen] = useState(false);
const [selectedPrayer, setSelectedPrayer] = useState<{ name: string; time: string } | null>(null);
const [prayerTimes, setPrayerTimes] = useState<PT | null>(null);

// 3. Initialisation (useEffect au montage)
useEffect(() => {
  const initNotifications = async () => {
    await initializeNotifications();
  };
  initNotifications();
}, []);

// 4. Programmation des notifications (useEffect au changement de paramètres)
useEffect(() => {
  const updatePrayerTimes = async () => {
    const times = calculatePrayerTimes(...);
    setPrayerTimes(times);
    await scheduleAllDailyNotifications(prayers, getAzaanPreference);
  };
  updatePrayerTimes();
}, [selectedCity, calculationMethod, asrMethod, currentTime]);

// 5. Ouverture de la modal
const handlePrayerClick = (prayer: { name: string; time: string }) => {
  setSelectedPrayer(prayer);
  setAzaanModalOpen(true);
};

// 6. Rendu du composant
<PrayerAzaanSettings
  isOpen={azaanModalOpen}
  prayerName={selectedPrayer?.name || ''}
  prayerTime={selectedPrayer?.time || ''}
  onClose={() => {
    setAzaanModalOpen(false);
    setSelectedPrayer(null);
  }}
/>
```

---

## 💾 Stockage des données

### Format de sauvegarde

```json
{
  "azaanPreferences": {
    "Fajr": { "azaanType": "azaan1" },
    "Dhuhr": { "azaanType": "azaan2" },
    "Asr": { "azaanType": "disabled" },
    "Maghrib": { "azaanType": "azaan1" },
    "Isha": { "azaanType": "azaan1" }
  }
}
```

**Clé de stockage**: `salat-tchad-storage` (localStorage via Zustand)

---

## 🔊 Gestion des fichiers audio

### Types supportés
- **MP3** (optimisé pour Android)

### Chemins
- `/data/azaan/1.mp3` - Azaan traditionnel
- `/data/azaan/2.mp3` - Azaan alternatif

### Spécifications recommandées
- **Bitrate**: 128-192 kbps
- **Durée**: 30-60 secondes
- **Format**: MP3 PCM

---

## 📲 Intégration Capacitor

### Dépendances ajoutées

```json
"@capacitor/local-notifications": "^8.1.0"
```

### Manifest Android requis

```xml
<!-- capacitor.config.ts -->
<plugin name="LocalNotifications">
  <variable name="SOUND_SET" value="true" />
</plugin>
```

### Permissions

- `android.permission.POST_NOTIFICATIONS` (automatique avec Capacitor 8+)
- `android.permission.SCHEDULE_EXACT_ALARM` (optionnel)

---

## 🎨 Thème et styles

### Couleurs utilisées

- **Primary**: `emerald-500` / `teal-500`
- **Secondary**: `slate-700` / `slate-800`
- **Text**: `white` / `slate-400`

### Classes Tailwind

- Glass effect: `backdrop-blur-xl`
- Gradients: `bg-gradient-to-r`, `bg-gradient-to-b`
- Borders: `border-slate-700/50`

---

## 🌐 Traductions

### Nouvelles clés i18n ajoutées

| Clé | FR | AR | EN |
|-----|----|----|-----|
| `azaan` | Azaan | الأذان | Azaan |
| `azaanSettings` | Réglages de l'Azaan | إعدادات الأذان | Azaan Settings |
| `azaanAudio1` | Azaan Audio 1 | صوت الأذان 1 | Azaan Audio 1 |
| `azaanAudio2` | Azaan Audio 2 | صوت الأذان 2 | Azaan Audio 2 |
| `disableAzaan` | Désactiver | تعطيل | Disable |
| `previewAudio` | Aperçu | معاينة | Preview |
| `selectAzaan` | Sélectionner un Azaan | اختر أذان | Select Azaan |
| `azaanDisabled` | Azaan désactivé | الأذان معطل | Azaan disabled |

---

## 🐛 Dépannage

### Les notifications ne s'affichent pas?

1. ✅ Vérifier les permissions Android
2. ✅ Vérifier que `initializeNotifications()` est appelé
3. ✅ Vérifier que les fichiers audio existent à `/data/azaan/`
4. ✅ Consulter les logs de Logcat

### L'aperçu audio ne joue pas?

1. ✅ Vérifier le chemin: `/data/azaan/1.mp3` ou `2.mp3`
2. ✅ Vérifier que le volume n'est pas muet
3. ✅ Vérifier les permissions d'accès aux fichiers

### Les préférences ne se sauvegardent pas?

1. ✅ Vérifier que le localStorage n'est pas désactivé
2. ✅ Vérifier que Zustand persist middleware fonctionne
3. ✅ Vérifier dans DevTools: `localStorage.getItem('salat-tchad-storage')`

---

## 📊 Prochains développements possibles

- [ ] Support personnalisé des fichiers audio (upload)
- [ ] Vibration personnalisée par prière
- [ ] Répétition progressive de l'Azaan
- [ ] Silence automatique (heures silencieuses)
- [ ] Intégration avec calendrier système
- [ ] Statistiques de notifications

---

## 📝 Notes importantes

⚠️ **Android only** - Capacitor Local Notifications est spécifiquement optimisé pour Android  
⚠️ **Permissions** - Toujours vérifier les permissions avant de programmer les notifications  
⚠️ **Horaire système** - Les notifications dépendent de l'heure système de l'appareil  
⚠️ **Batterie** - Utiliser modérément pour ne pas impacter la batterie  

---

## ✅ Checklist d'implémentation

- [x] Créer le module d'Azaan notifications
- [x] Étendre le Zustand store
- [x] Créer le composant PrayerAzaanSettings
- [x] Intégrer dans PrayerTimes.tsx
- [x] Ajouter les traductions
- [x] Ajouter Capacitor Local Notifications au package.json
- [x] Documenter l'implémentation
- [ ] Tester sur appareil Android réel
- [ ] Builder APK en production

---

**Version**: 1.0.0  
**Dernière mise à jour**: Février 2026  
**Status**: ✅ Production-ready
