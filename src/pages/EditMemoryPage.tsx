
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, CalendarIcon, Clock } from 'lucide-react';
import { EventType } from '@/types';
import { cn } from '@/lib/utils';
import TimeSelect from '@/components/TimeSelect';

const EditMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { clients, events, updateEvent } = useApp();
  
  // Find the event to edit
  const event = events.find(e => e.id === id);
  
  const [values, setValues] = useState({
    clientId: event?.clientId || '',
    eventType: event?.eventType || 'Promise' as EventType,
    description: event?.description || '',
    reminderDate: event?.reminderDate ? new Date(event.reminderDate) : new Date(),
    reminderTime: event?.reminderTime || '09:00',
    notes: event?.notes || '',
    status: event?.status || 'Pending'
  });
  
  // If event not found, redirect back
  useEffect(() => {
    if (!event) {
      navigate('/');
    }
  }, [event, navigate]);
  
  const handleChange = (field: string, value: any) => {
    setValues({ ...values, [field]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event) return;
    
    const selectedClient = clients.find(client => client.id === values.clientId);
    
    if (selectedClient) {
      updateEvent({
        id: event.id,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        eventType: values.eventType,
        description: values.description,
        reminderDate: values.reminderDate,
        reminderTime: values.reminderTime,
        notes: values.notes,
        status: values.status
      });
      
      navigate(`/clients/${selectedClient.id}`);
    }
  };
  
  const isFormValid = values.clientId && values.description && values.reminderDate;
  
  if (!event) {
    return null; // Will redirect via the useEffect
  }
  
  return (
    <div>
      <div onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 mb-4 cursor-pointer">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Edit Memory</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client
          </label>
          <Select 
            value={values.clientId} 
            onValueChange={(value) => handleChange('clientId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <Select 
            value={values.eventType} 
            onValueChange={(value) => handleChange('eventType', value as EventType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Promise">Promise</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Birthday">Birthday</SelectItem>
              <SelectItem value="Celebration">Celebration</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Input
            value={values.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What do you want to remember?"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(values.reminderDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={values.reminderDate}
                onSelect={(date) => handleChange('reminderDate', date || new Date())}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reminder Time
          </label>
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <TimeSelect 
                value={values.reminderTime} 
                onChange={(value) => handleChange('reminderTime', value)} 
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <Textarea
            value={values.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any additional details..."
            rows={3}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6"
          disabled={!isFormValid}
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditMemoryPage;
