
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

const SAMPLE_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '555-123-4567',
    personalFacts: 'Loves hiking, has two kids, prefers morning meetings, coffee enthusiast.'
  },
  {
    id: '2',
    name: 'Alex Chen',
    email: 'alex@example.com',
    phone: '555-987-6543',
    personalFacts: 'Golf player, celebrating 10 years in business this July, wine collector.'
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'michael@example.com',
    phone: '555-333-2222',
    personalFacts: 'Dog lover, interested in sustainability, planning to expand business next quarter.'
  }
];

const SAMPLE_EVENTS: ClientEvent[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Sarah Johnson',
    eventType: 'Promise',
    description: 'Send proposal draft',
    reminderDate: new Date(),
    notes: 'Include pricing options and timeline estimates',
    status: 'Pending'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Alex Chen',
    eventType: 'Meeting',
    description: 'Quarterly review',
    reminderDate: new Date(Date.now() + 86400000), // tomorrow
    notes: 'Prepare slides with Q2 results',
    status: 'Pending'
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Michael Rodriguez',
    eventType: 'Birthday',
    description: 'Birthday celebration',
    reminderDate: new Date(Date.now() - 86400000), // yesterday
    notes: 'Consider sending a small gift',
    status: 'Pending'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(SAMPLE_CLIENTS);
  const [events, setEvents] = useState<ClientEvent[]>(SAMPLE_EVENTS);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [reminderTime, setReminderTime] = useState<string>("09:00");

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
