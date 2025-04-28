
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ChevronLeft, Plus, Mail, Phone } from 'lucide-react';

const ClientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { clients, events, markEventAsDone } = useApp();
  
  const client = clients.find(c => c.id === id);
  const clientEvents = events.filter(e => e.clientId === id);
  
  // Sort events by date (newest first)
  const sortedEvents = [...clientEvents].sort(
    (a, b) => new Date(b.reminderDate).getTime() - new Date(a.reminderDate).getTime()
  );
  
  if (!client) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Client not found</p>
        <Link to="/clients" className="text-blue-600 mt-2 block">
          Back to clients
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/clients" className="inline-flex items-center text-gray-500 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to clients
        </Link>
        
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <Link to={`/add?clientId=${client.id}`}>
            <Button size="sm" className="rounded-lg">
              <Plus className="h-4 w-4 mr-1" />
              Add Memory
            </Button>
          </Link>
        </div>
        
        <div className="mt-2 space-y-1">
          {client.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2" />
              <a href={`mailto:${client.email}`}>{client.email}</a>
            </div>
          )}
          {client.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2" />
              <a href={`tel:${client.phone}`}>{client.phone}</a>
            </div>
          )}
        </div>
      </div>
      
      {client.personalFacts && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-medium mb-2">Personal Facts</h2>
          <p className="text-gray-700">{client.personalFacts}</p>
        </div>
      )}
      
      <h2 className="text-lg font-medium mb-4">Timeline</h2>
      
      {sortedEvents.length > 0 ? (
        <div className="space-y-4">
          {sortedEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onMarkAsDone={markEventAsDone} 
              showClient={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No memories recorded yet</p>
          <Link to={`/add?clientId=${client.id}`} className="text-blue-600 mt-2 block">
            + Add your first memory
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClientDetailPage;
