
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  
    shouldPlaySound: true, 
    shouldSetBadge: false,  
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


export const initNotifications = async () => {
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }


  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('tasks', {
      name: 'Task Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: true,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};


export const scheduleNotification = async (taskId: string, taskTitle: string) => {
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Task Reminder",
        body: `Don't forget to: ${taskTitle}`,
        data: { taskId },
        sound: true, 
        vibrate: [0, 250, 250, 250], 
      },
      trigger: { 
        seconds: 5, 
        channelId: 'tasks' 
      },
    });
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    return null;
  }
};


export const cancelNotification = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('Failed to cancel notification:', error);
  }
};