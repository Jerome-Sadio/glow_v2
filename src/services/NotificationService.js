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

  // 1. SEND SINGLE IMMEDIATE CONFIRMATION
  try {
    const confirmId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "SYSTÈME ACTIVÉ 🛡️",
        body: `Quête synchronisée : ${task.text}`,
        sound: true,
      },
      trigger: null,
    });
    notificationIds.push(confirmId);
  } catch (e) {
    console.warn("Failed to schedule confirmation", e);
  }

  const priorityLabels = {
    'urgent-important': 'Urgent & Important 🚨',
    'important': 'Important, Non-Urgent 📅',
    'urgent': 'Urgent, Non-Important ⚡',
    'normal': 'Non-Urgent, Non-Important 🧘'
  };
  const priorityText = priorityLabels[task.priority] || 'Quête Standard';

  for (const day of task.days) {
    // Expo days: 1 (Sunday) to 7 (Saturday)
    // JS days: 0 (Sunday) to 6 (Saturday)
    // Correct mapping: day + 1
    const weekday = day + 1;

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "ALERTE SYSTÈME ⚔️",
          body: `[${priorityText}] - Préparation : ${task.text}`,
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
    } catch (e) {
      console.warn(`Failed to schedule notification for day ${day}`, e);
    }
  }

  return notificationIds;
};

export const cancelTaskNotifications = async (ids) => {
  if (!ids || ids.length === 0) return;
  for (const id of ids) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
};
