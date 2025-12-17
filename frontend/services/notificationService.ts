import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Types
interface NotificationContent {
  title: string;
  body: string;
  sound: boolean;
}

type NotificationTrigger = Notifications.CalendarTriggerInput;

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  }),
});

// Setup notifications (call this when app starts)
export const setupNotifications = async (): Promise<void> => {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Permission not granted for notifications');
      return;
    }

    // Setup Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    console.log('Notifications setup complete');
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};

// Register for notifications (LOCAL ONLY - works in Expo Go)
export const registerForNotifications = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Permission not granted for notifications');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error registering for notifications:', error);
    return false;
  }
};

// Schedule daily practice reminder
export const scheduleDailyReminder = async (hour: number = 20, minute: number = 0): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.title?.includes('Time to practice')) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    
    const content: NotificationContent = {
      title: "🖐️ Time to practice!",
      body: "Keep your streak alive with today's lesson",
      sound: true,
    };

    const trigger: NotificationTrigger = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: hour,
      minute: minute,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    
    console.log(`Daily reminder scheduled for ${hour}:${minute.toString().padStart(2, '0')}`);
  } catch (error) {
    console.error('Error scheduling daily reminder:', error);
  }
};

// Schedule streak reminder
export const scheduleStreakReminder = async (hour: number = 22, minute: number = 0): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.title?.includes('streak')) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    
    const content: NotificationContent = {
      title: "🔥 Don't break your streak!",
      body: "You haven't practiced today. Come back now!",
      sound: true,
    };

    const trigger: NotificationTrigger = {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: hour,
      minute: minute,
      repeats: true,
    };

    await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    
    console.log(`Streak reminder scheduled for ${hour}:${minute.toString().padStart(2, '0')}`);
  } catch (error) {
    console.error('Error scheduling streak reminder:', error);
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Send immediate local notification (for testing)
export const sendLocalNotification = async (title: string, body: string): Promise<void> => {
  try {
    const content: NotificationContent = {
      title,
      body,
      sound: true,
    };

    await Notifications.scheduleNotificationAsync({
      content,
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending local notification:', error);
  }
};