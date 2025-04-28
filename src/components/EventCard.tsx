
import React from 'react';
import { format } from 'date-fns';
import { Check } from 'lucide-react';
import { ClientEvent } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  event: ClientEvent;
  onMarkAsDone: (id: string) => void;
  showClient?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onMarkAsDone,
  showClient = true
}) => {
  const { id, clientName, eventType, description, reminderDate, status } = event;

  const isOverdue = new Date(reminderDate) < new Date() && status === 'Pending';
  
  const getEventTypeColor = (type: string) => {
    switch(type) {
      case 'Promise': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Meeting': return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Birthday': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Celebration': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className={`p-4 mb-3 rounded-xl border ${
      isOverdue 
        ? 'border-red-200 bg-red-50' 
        : status === 'Done'
          ? 'border-green-200 bg-green-50'
          : 'border-gray-200 bg-white'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {showClient && (
            <h3 className="font-medium text-gray-900 mb-1">{clientName}</h3>
          )}
          <div className="mb-2 flex items-center gap-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-md ${getEventTypeColor(eventType)}`}>
              {eventType}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(reminderDate), 'MMM d, yyyy')}
            </span>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">Overdue</Badge>
            )}
            {status === 'Done' && (
              <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">Done</Badge>
            )}
          </div>
          <p className="text-gray-700">{description}</p>
        </div>
        
        {status === 'Pending' && (
          <Button 
            variant="outline" 
            size="icon"
            className="h-8 w-8 rounded-full bg-white hover:bg-green-100 hover:text-green-800 border-green-200"
            onClick={() => onMarkAsDone(id)}
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Mark as done</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
