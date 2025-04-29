
import { LocalNotifications } from '@capacitor/local-notifications';
import { useApp } from '@/context/AppContext';

// Initialize notifications
export const initializeNotifications = async () => {
  try {
    // Request permission
    const permissionStatus = await LocalNotifications.requestPermissions();
    return permissionStatus.display === 'granted';
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
};

// Schedule daily reminder
export const scheduleDailyReminder = async (timeString: string) => {
  try {
    // Parse the time string (format: "HH:MM")
    const [hours, minutes] = timeString.split(':').map(Number);
    
    // Create a date for today at the specified time
    const scheduleTime = new Date();
    scheduleTime.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (scheduleTime < new Date()) {
      scheduleTime.setDate(scheduleTime.getDate() + 1);
    }
    
    // Cancel any existing notifications
    await LocalNotifications.cancel({ notifications: await (await LocalNotifications.getPending()).notifications });
    
    // Schedule the new notification
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: "Memory Architect Reminder",
          body: "Check your upcoming events and commitments",
          schedule: { at: scheduleTime, repeats: true, every: 'day' }
        }
      ]
    });

    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
};

// Cancel all scheduled notifications
export const cancelAllNotifications = async () => {
  try {
    const pendingNotifications = await LocalNotifications.getPending();
    if (pendingNotifications.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pendingNotifications.notifications });
    }
    return true;
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    return false;
  }
};
