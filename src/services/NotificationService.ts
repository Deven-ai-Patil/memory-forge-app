
import { LocalNotifications } from '@capacitor/local-notifications';
import { ClientEvent } from '@/types';

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
    
    // Cancel any existing notifications with ID 1 (daily reminder)
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
    
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

// Schedule reminder for specific event
export const scheduleEventReminder = async (event: ClientEvent) => {
  try {
    const eventId = parseInt(event.id, 10) % 100000; // Convert string ID to number (mod to avoid large IDs)
    const reminderDate = new Date(event.reminderDate);
    
    // Schedule notification 1 hour before the event
    const notificationDate = new Date(reminderDate);
    notificationDate.setHours(notificationDate.getHours() - 1);
    
    // If the reminder time has already passed, don't schedule
    if (notificationDate < new Date()) {
      return false;
    }
    
    // Create notification title based on event type
    let title = "Upcoming Reminder";
    let body = "";
    
    switch (event.eventType) {
      case 'Birthday':
        title = "Birthday Reminder";
        body = `${event.clientName}'s birthday is today`;
        break;
      case 'Celebration':
        title = "Celebration Reminder";
        body = `Celebration with ${event.clientName} today`;
        break;
      case 'Meeting':
        title = "Meeting Reminder";
        body = `Meeting with ${event.clientName} today`;
        break;
      case 'Promise':
        title = "Promise Follow-up";
        body = `Remember your commitment to ${event.clientName}`;
        break;
      default:
        body = `Reminder for ${event.clientName}: ${event.description}`;
    }
    
    // Schedule the notification
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 10000 + eventId, // Use offset to avoid ID conflicts with daily reminders
          title,
          body,
          schedule: { at: notificationDate }
        }
      ]
    });
    
    return true;
  } catch (error) {
    console.error('Error scheduling event notification:', error);
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

// Cancel notification for specific event
export const cancelEventNotification = async (eventId: string) => {
  try {
    const numericId = parseInt(eventId, 10) % 100000;
    await LocalNotifications.cancel({ notifications: [{ id: 10000 + numericId }] });
    return true;
  } catch (error) {
    console.error('Error cancelling event notification:', error);
    return false;
  }
};
