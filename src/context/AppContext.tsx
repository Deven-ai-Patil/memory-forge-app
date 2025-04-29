
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, ClientEvent, EventType, EventStatus } from '@/types';
import { toast } from 'sonner';
import { initializeNotifications, scheduleDailyReminder, cancelAllNotifications } from '@/services/NotificationService';

interface AppContextType {
  clients: Client[];
  events: ClientEvent[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addEvent: (event: Omit<ClientEvent, 'id'>) => void;
  updateEvent: (event: ClientEvent) => void;
  deleteEvent: (id: string) => void;
  markEventAsDone: (id: string) => void;
  notificationsEnabled: boolean;
  reminderTime: string; // in 24h format "09:00"
  toggleNotifications: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Key names for localStorage
const CLIENTS_STORAGE_KEY = 'memoryArchitect_clients';
const EVENTS_STORAGE_KEY = 'memoryArchitect_events';
const NOTIFICATIONS_ENABLED_KEY = 'memoryArchitect_notificationsEnabled';
const REMINDER_TIME_KEY = 'memoryArchitect_reminderTime';

// Initialize with empty arrays or load from localStorage
const getInitialClients = (): Client[] => {
  const savedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
  return savedClients ? JSON.parse(savedClients) : [];
};

const getInitialEvents = (): ClientEvent[] => {
  const savedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
  return savedEvents ? JSON.parse(savedEvents) : [];
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(getInitialClients);
  const [events, setEvents] = useState<ClientEvent[]>(getInitialEvents);
  
  // Get stored notification preferences or use defaults
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);
    return saved ? JSON.parse(saved) : true;
  });
  
  const [reminderTime, setReminderTime] = useState<string>(() => {
    const saved = localStorage.getItem(REMINDER_TIME_KEY);
    return saved || "09:00";
  });

  // Initialize notifications on first load
  useEffect(() => {
    initializeNotifications().then(granted => {
      if (!granted) {
        setNotificationsEnabled(false);
        localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(false));
      }
    });
  }, []);

  // Update notifications when settings change
  useEffect(() => {
    if (notificationsEnabled) {
      scheduleDailyReminder(reminderTime);
    } else {
      cancelAllNotifications();
    }
    
    // Save preferences to localStorage
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(notificationsEnabled));
    localStorage.setItem(REMINDER_TIME_KEY, reminderTime);
  }, [notificationsEnabled, reminderTime]);

  // Save clients to localStorage when they change
  useEffect(() => {
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);
  
  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const addClient = (clientData: Omit<Client, 'id'>) => {
    const newClient = {
      ...clientData,
      id: Date.now().toString(),
    };
    setClients([...clients, newClient]);
    toast.success(`Added client: ${clientData.name}`);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    ));
    toast.success(`Updated client: ${updatedClient.name}`);
  };

  const deleteClient = (id: string) => {
    const clientToDelete = clients.find(client => client.id === id);
    setClients(clients.filter(client => client.id !== id));
    
    // Also remove all events associated with this client
    setEvents(events.filter(event => event.clientId !== id));
    
    if (clientToDelete) {
      toast.success(`Deleted client: ${clientToDelete.name}`);
    }
  };

  const addEvent = (eventData: Omit<ClientEvent, 'id'>) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents([...events, newEvent]);
    toast.success(`Added new ${eventData.eventType.toLowerCase()}`);
  };

  const updateEvent = (updatedEvent: ClientEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    toast.success(`Updated ${updatedEvent.eventType.toLowerCase()}`);
  };

  const deleteEvent = (id: string) => {
    const eventToDelete = events.find(event => event.id === id);
    setEvents(events.filter(event => event.id !== id));
    
    if (eventToDelete) {
      toast.success(`Deleted ${eventToDelete.eventType.toLowerCase()}`);
    }
  };

  const markEventAsDone = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, status: 'Done' as EventStatus } : event
    ));
    toast.success('Marked as done!');
  };

  const toggleNotifications = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    toast.success(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <AppContext.Provider value={{
      clients,
      events,
      addClient,
      updateClient,
      deleteClient,
      addEvent,
      updateEvent,
      deleteEvent,
      markEventAsDone,
      notificationsEnabled,
      reminderTime,
      toggleNotifications,
      setReminderTime
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
