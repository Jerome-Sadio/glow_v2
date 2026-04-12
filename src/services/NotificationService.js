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

  // 1. SEND IMMEDIATE CONFIRMATION
  const confirmId = await Notifications.scheduleNotificationAsync({
    content: {
      title: "QUÊTE ENREGISTRÉE 📜",
      body: `Le système a validé votre nouvelle quête : ${task.text}`,
      sound: true,
    },
    trigger: null, // trigger: null means send immediately
  });
  notificationIds.push(confirmId);

  // 2. SCHEDULE RECURRING REMINDERS
  for (const day of task.days) {
    // Expo days: 1 (Mon) to 7 (Sun)
    // Mapping my Sunday (0) to Expo Sunday (7)
    const weekday = day === 0 ? 7 : day;

    // PRIORITY LABEL MAPPING (Matching QuestView)
    const priorityLabels = {
      'urgent-important': 'Urgent & Important 🚨',
      'important': 'Important, Non-Urgent 📅',
      'urgent': 'Urgent, Non-Important ⚡',
      'normal': 'Non-Urgent, Non-Important 🧘'
    };
    const priorityText = priorityLabels[task.priority] || 'Quête Standard';

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
  }

  return notificationIds;
};

export const cancelTaskNotifications = async (ids) => {
  if (!ids || ids.length === 0) return;
  for (const id of ids) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
};
