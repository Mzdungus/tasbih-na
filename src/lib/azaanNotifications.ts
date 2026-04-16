/**
 * Module de gestion des notifications Azaan avec Capacitor
 * Gère la programmation et la lecture des sons d'appel à la prière
 */

import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from './capacitor-local-notifications-shim';
import azaan1Path from '../data/azaan/1.mp3';
import azaan2Path from '../data/azaan/2.mp3';

// Types pour les préférences d'Azaan
export type AzaanType = 'azaan1' | 'azaan2' | 'disabled';

interface Notification {
  id: number;
  title?: string;
}

interface AzaanNotificationConfig {
  prayerName: string;
  time: string; // Format: "HH:mm"
  azaanType: AzaanType;
  date: Date;
}

/**
 * Détermine le chemin du fichier audio selon la plateforme
 * - Web/Dev: utilise le chemin bundlé par Vite
 * - Android natif: utilise file:///android_asset/...
 */
function getAudioPath(azaanType: AzaanType): string {
  if (azaanType === 'disabled') {
    return '';
  }

  const fileName = azaanType === 'azaan1' ? '1.mp3' : '2.mp3';
  const isNativeAndroid = Capacitor.isPluginAvailable('LocalNotifications') && 
                          Capacitor.getPlatform() === 'android';

  if (isNativeAndroid) {
    return `file:///android_asset/data/azaan/${fileName}`;
  }

  // Web/Dev: utiliser le chemin bundlé
  return azaanType === 'azaan1' ? azaan1Path : azaan2Path;
}

/**
 * Initialise les permissions pour les notifications locales
 */
export async function initializeNotifications() {
  try {
    // Demander les permissions pour les notifications
    const permission = await LocalNotifications.requestPermissions();
    return permission.display === 'granted';
  } catch (error) {
    console.error('Erreur lors de la demande de permission:', error);
    return false;
  }
}

/**
 * Met en place une notification schedulée avec le son d'Azaan
 */
export async function scheduleAzaanNotification(config: AzaanNotificationConfig) {
  try {
    // Si l'Azaan est désactivé pour cette prière, ne rien faire
    if (config.azaanType === 'disabled') {
      // Annuler toute notification existante pour cette prière
      await cancelAzaanNotification(config.prayerName);
      return;
    }

    // Déterminer le chemin du fichier audio selon la plateforme
    const audioPath = getAudioPath(config.azaanType);

    // Créer l'ID unique pour cette notification
    const notificationId = `azaan_${config.prayerName}_${config.date.getTime()}`;

    // Parser le temps pour obtenir les heures et minutes
    const [hours, minutes] = config.time.split(':').map(Number);

    // Créer la date/heure de la notification
    const notificationDate = new Date(config.date);
    notificationDate.setHours(hours, minutes, 0, 0);

    // Si l'heure est dans le passé, programmer pour demain
    const now = new Date();
    if (notificationDate < now) {
      notificationDate.setDate(notificationDate.getDate() + 1);
    }

    // Programmer la notification
    await LocalNotifications.schedule({
      notifications: [
        {
          id: parseInt(notificationId.replace(/\D/g, '').slice(-9)),
          title: `Appel à la ${config.prayerName}`,
          body: 'Il est temps pour la prière',
          schedule: {
            on: {
              year: notificationDate.getFullYear(),
              month: notificationDate.getMonth() + 1,
              day: notificationDate.getDate(),
              hour: notificationDate.getHours(),
              minute: notificationDate.getMinutes(),
            },
          },
          sound: audioPath,
          smallIcon: 'ic_stat_notification',
          largeIcon: 'ic_launcher_foreground',
          ongoing: false,
        },
      ],
    });

    console.log(`Notification Azaan programmée pour ${config.prayerName} à ${config.time}`);
  } catch (error) {
    console.error(`Erreur lors de la programmation de la notification Azaan:`, error);
  }
}

/**
 * Annule une notification Azaan pour une prière spécifique
 */
export async function cancelAzaanNotification(prayerName: string) {
  try {
    // Obtenir les notifications actuelles
    const pending = await LocalNotifications.getPending();
    
    // Trouver et annuler celles qui concernent cette prière
    const idsToCancel = pending.notifications
      .filter((n: Notification) => n.title?.includes(prayerName))
      .map((n: Notification) => ({ id: n.id }));

    if (idsToCancel.length > 0) {
      await LocalNotifications.cancel({ notifications: idsToCancel });
      console.log(`Notification Azaan annulée pour ${prayerName}`);
    }
  } catch (error) {
    console.error(`Erreur lors de l'annulation de la notification:`, error);
  }
}

/**
 * Programme les notifications Azaan pour une journée entière
 * Basé sur les préférences stockées
 */
export async function scheduleAllDailyNotifications(
  prayers: Array<{ name: string; time: string }>,
  getAzaanPreference: (name: string) => { azaanType: AzaanType },
  date: Date = new Date()
) {
  try {
    // Filtrer les cinq prières obligatoires
    const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    for (const prayer of prayers) {
      if (prayerNames.includes(prayer.name)) {
        const preference = getAzaanPreference(prayer.name);
        await scheduleAzaanNotification({
          prayerName: prayer.name,
          time: prayer.time,
          azaanType: preference.azaanType,
          date,
        });
      }
    }

    console.log('Toutes les notifications Azaan ont été programmées');
  } catch (error) {
    console.error('Erreur lors de la programmation des notifications:', error);
  }
}

/**
 * Joue un aperçu audio (preview) de l'Azaan
 * Utile pour que l'utilisateur puisse tester avant de sauvegarder
 */
export async function playAzaanPreview(azaanType: AzaanType) {
  try {
    if (azaanType === 'disabled') {
      return;
    }

    const audioPath = getAudioPath(azaanType);

    // Créer un élément audio pour la preview
    const audio = new Audio(audioPath);
    audio.volume = 1;
    await audio.play();

    console.log(`Preview de ${azaanType} en cours...`);
  } catch (error) {
    console.error('Erreur lors de la lecture du preview:', error);
  }
}

/**
 * Nettoie toutes les notifications Azaan
 */
export async function clearAllAzaanNotifications() {
  try {
    const pending = await LocalNotifications.getPending();
    const azaanIds = pending.notifications
      .filter((n: Notification) => n.title?.includes('Appel à la') || n.title?.includes('prière'))
      .map((n: Notification) => ({ id: n.id }));

    if (azaanIds.length > 0) {
      await LocalNotifications.cancel({ notifications: azaanIds });
      console.log('Toutes les notifications Azaan ont été supprimées');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error);
  }
}
