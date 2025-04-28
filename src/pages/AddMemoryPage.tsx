
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, CalendarIcon } from 'lucide-react';
import { EventType } from '@/types';
import { cn } from '@/lib/utils';

const AddMemoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clients, addEvent } = useApp();
  
  const queryParams = new URLSearchParams(location.search);
  const preselectedClientId = queryParams.get('clientId');
  
  const [values, setValues] = useState({
    clientId: preselectedClientId || '',
    eventType: 'Promise' as EventType,
    description: '',
    reminderDate: new Date(),
    notes: ''
  });
  
  const handleChange = (field: string, value: any) => {
    setValues({ ...values, [field]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedClient = clients.find(client => client.id === values.clientId);
    
    if (selectedClient) {
      addEvent({
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        eventType: values.eventType,
        description: values.description,
        reminderDate: values.reminderDate,
        notes: values.notes,
        status: 'Pending'
      });
      
      navigate('/');
    }
  };
  
  const isFormValid = values.clientId && values.description && values.reminderDate;
  
  return (
    <div>
      <div onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 mb-4 cursor-pointer">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Add Memory</h1>
      
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
          Save Memory
        </Button>
      </form>
    </div>
  );
};

export default AddMemoryPage;
