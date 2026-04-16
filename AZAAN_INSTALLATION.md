# 🚀 Guide d'installation - Fonctionnalité Azaan

## ✅ Installation des dépendances

Exécutez cette commande pour installer le package Capacitor Local Notifications:

```bash
npm install @capacitor/local-notifications
```

**Ou avec yarn:**

```bash
yarn add @capacitor/local-notifications
```

---

## 📝 Configuration Android (capacitor.config.ts)

Assurez-vous que votre `capacitor.config.ts` contient les bonnes permissions:

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.salat.tchad',
  appName: 'Salat Tchad',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      sound: true,
      vibrate: true,
    }
  }
};

export default config;
```

---

## 🔧 Configuration AndroidManifest.xml

Vérifiez que votre `android/app/src/main/AndroidManifest.xml` contient:

```xml
<!-- Permission pour les notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Permission pour les alarmes exactes (optionnel) -->
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

---

## 📱 Vérification des fichiers audio

Les fichiers audio doivent exister:

```
src/data/azaan/
├── 1.mp3  ✓ (Azaan traditionnel)
└── 2.mp3  ✓ (Azaan alternatif)
```

**Chemins dans le code:**
- `file:///android_asset/data/azaan/1.mp3`
- `file:///android_asset/data/azaan/2.mp3`

---

## 🔨 Build et déploiement

### 1. Dev mode
```bash
npm run dev
```

### 2. Build production
```bash
npm run build
```

### 3. Sync avec Capacitor
```bash
npx cap sync android
```

### 4. Builder APK
```bash
npx cap build android
```

Ou ouvrir le projet Android:

```bash
npx cap open android
```

---

## ✅ Checklist post-installation

- [ ] Dépendances installées (`npm install`)
- [ ] `capacitor.config.ts` configuré
- [ ] `AndroidManifest.xml` mis à jour
- [ ] Fichiers audio présents (`src/data/azaan/`)
- [ ] Build réussi (`npm run build`)
- [ ] Sync Capacitor (`npx cap sync android`)
- [ ] Permissions demandées à l'utilisateur
- [ ] Test sur appareil/émulateur

---

## 🧪 Test de la fonctionnalité

### Tester en dev (web)

1. Ouvrir l'app: `npm run dev`
2. Aller sur la page "Heures de Prière"
3. Cliquer sur une heure de prière pour ouvrir la modal
4. Cliquer sur "Aperçu" pour tester les sons
5. Sélectionner une option et cliquer "Enregistrer"

### Tester sur Android

1. Builder: `npx cap build android`
2. Ouvrir dans Android Studio: `npx cap open android`
3. Exécuter sur appareil/émulateur (Shift + F10)
4. Suivre les mêmes étapes que le test web

---

## 🐛 Troubleshooting

### "Cannot find module '@capacitor/local-notifications'"

→ Exécutez: `npm install @capacitor/local-notifications`

### Les notifications ne s'affichent pas

1. ✅ Vérifier les permissions (demandées à la première ouverture)
2. ✅ Vérifier que du volume est disponible (pas en mode silencieux)
3. ✅ Vérifier les logs: `adb logcat | grep azaan`
4. ✅ Vérifier les préférences d'Azaan: `localStorage.salat-tchad-storage`

### Les fichiers audio ne jouent pas

1. ✅ Vérifier que les fichiers existent: `src/data/azaan/1.mp3` et `2.mp3`
2. ✅ Vérifier le chemin dans le code: `/data/azaan/1.mp3`
3. ✅ Vérifier les permissions de fichier Android

### Les préférences ne se sauvegardent pas

1. ✅ Vérifier que localStorage fonctionne
2. ✅ Vérifier dans DevTools: `localStorage.getItem('salat-tchad-storage')`
3. ✅ Nettoyer le cache: `localStorage.clear()`

---

## 📞 Support terminal

Vérifier le statut Capacitor:

```bash
npx cap diagnose
```

Voir les logs Android:

```bash
adb logcat -s capacitor,azaan
```

---

**Version**: 1.0.0  
**Status**: ✅ Ready to use
