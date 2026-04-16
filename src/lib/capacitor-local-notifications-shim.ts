/**
 * Shim pour @capacitor/local-notifications
 * Utilisé en dev quand l'installation natale pose problème
 */

export const LocalNotifications = {
  requestPermissions: async () => ({ display: 'granted' }),
  getPending: async () => ({ notifications: [] }),
  schedule: async (config: any) => {
    console.log('✓ Notification programmée:', config);
  },
  cancel: async (config: any) => {
    console.log('✓ Notification annulée:', config);
  },
};

export default LocalNotifications;
