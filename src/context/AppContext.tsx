
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, ClientEvent, EventType, EventStatus } from '@/types';
import { toast } from 'sonner';

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

// Initialize with empty arrays
const EMPTY_CLIENTS: Client[] = [];
const EMPTY_EVENTS: ClientEvent[] = [];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with empty arrays, completely clearing any demo data
  const [clients, setClients] = useState<Client[]>(EMPTY_CLIENTS);
  const [events, setEvents] = useState<ClientEvent[]>(EMPTY_EVENTS);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("09:00");

  // Clear localStorage on first load to ensure no persistence of demo data
  useEffect(() => {
    localStorage.removeItem('clients');
    localStorage.removeItem('events');
  }, []);

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
