import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }
  return true;
};

export const scheduleTaskNotification = async (task) => {
  if (!task.time || !task.days || task.days.length === 0) return null;

  const [hours, minutes] = task.time.split(':').map(Number);
  
  // Calculate 5 minutes before
  let notifyHours = hours;
  let notifyMinutes = minutes - 5;
  if (notifyMinutes < 0) {
    notifyMinutes += 60;
    notifyHours = (notifyHours - 1 + 24) % 24;
  }

  const notificationIds = [];

  for (const day of task.days) {
    // Expo days: 1 (Mon) to 7 (Sun)
    // Mapping my Sunday (0) to Expo Sunday (7)
    const weekday = day === 0 ? 7 : day;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "ALERTE SYSTÈME ⚔️",
        body: `Préparation pour la quête : ${task.text}`,
        sound: true,
      },
      trigger: {
        weekday,
        hour: notifyHours,
        minute: notifyMinutes,
        repeats: true,
      },
    });
    notificationIds.push(id);
  }

  return notificationIds;
};

export const cancelTaskNotifications = async (ids) => {
  if (!ids || ids.length === 0) return;
  for (const id of ids) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
};
