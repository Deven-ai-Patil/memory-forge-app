
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import EventCard from '@/components/EventCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { events, clients, markEventAsDone } = useApp();
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today');
  
  // If there are no clients, show the welcome screen
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">
            Welcome to Memory Architect! 👋
          </h1>
          
          <p className="text-gray-600 mb-8">
            Never forget a client promise again. Start by adding your most important client relationship.
          </p>
          
          <Link to="/add-client">
            <Button size="lg" className="w-full">
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Client
            </Button>
          </Link>
          
          <p className="text-sm text-gray-500 mt-6">
            Takes less than a minute to get started
          </p>
        </div>
      </div>
    );
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todaysEvents = events.filter(event => {
    const reminderDate = new Date(event.reminderDate);
    reminderDate.setHours(0, 0, 0, 0);
    return reminderDate <= today && event.status === 'Pending';
  });
  
  const pendingEvents = events.filter(event => event.status === 'Pending');
  const completedEvents = events.filter(event => event.status === 'Done');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Today's Actions</h1>
      
      <Tabs defaultValue="today" className="mb-6">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="today">
            Today & Overdue
            {todaysEvents.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                {todaysEvents.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-2">
          {todaysEvents.length > 0 ? (
            todaysEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onMarkAsDone={markEventAsDone}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No actions for today! 🎉</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          {pendingEvents.length > 0 ? (
            <>
              <h2 className="text-lg font-medium mb-3">Pending</h2>
              {pendingEvents.map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onMarkAsDone={markEventAsDone}
                />
              ))}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No pending actions! 🎉</p>
            </div>
          )}
          
          {completedEvents.length > 0 && (
            <>
              <h2 className="text-lg font-medium mt-6 mb-3">Completed</h2>
              {completedEvents.slice(0, 5).map(event => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onMarkAsDone={markEventAsDone}
                />
              ))}
              
              {completedEvents.length > 5 && (
                <p className="text-sm text-center text-gray-500 mt-2">
                  + {completedEvents.length - 5} more completed actions
                </p>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
