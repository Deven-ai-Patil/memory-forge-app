
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { 
    notificationsEnabled, 
    reminderTime, 
    toggleNotifications, 
    setReminderTime 
  } = useApp();
  
  const handleResetApp = () => {
    // This would clear all data in a real app
    toast.info("This feature will be available in a future update");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Notifications</h2>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">Enable Notifications</p>
              <p className="text-sm text-gray-500">
                Get reminders for upcoming events
              </p>
            </div>
            <Switch 
              checked={notificationsEnabled} 
              onCheckedChange={toggleNotifications}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Daily Reminder Time
            </label>
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              disabled={!notificationsEnabled}
            />
            <p className="text-xs text-gray-500">
              You'll receive notifications at this time every day
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="text-lg font-medium mb-4">Data Management</h2>
          
          <Button 
            variant="outline" 
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            onClick={handleResetApp}
          >
            Reset Application Data
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            This will remove all your clients and events data
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bell className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Memory Architect</h2>
              <p className="text-sm text-gray-500">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
