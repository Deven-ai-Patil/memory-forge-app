
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  personalFacts?: string;
}

export type EventType = 'Promise' | 'Meeting' | 'Birthday' | 'Celebration' | 'Other';
export type EventStatus = 'Pending' | 'Done';

export interface ClientEvent {
  id: string;
  clientId: string;
  clientName: string;
  eventType: EventType;
  description: string;
  reminderDate: Date;
  notes?: string;
  status: EventStatus;
}
