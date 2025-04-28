
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';

const AddClientPage: React.FC = () => {
  const navigate = useNavigate();
  const { addClient } = useApp();
  
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    personalFacts: ''
  });
  
  const handleChange = (field: string, value: string) => {
    setValues({ ...values, [field]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addClient({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      personalFacts: values.personalFacts || undefined
    });
    
    navigate('/clients');
  };
  
  return (
    <div>
      <div onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 mb-4 cursor-pointer">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Add New Client</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <Input
            value={values.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Client name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <Input
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="client@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <Input
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personal Facts (Optional)
          </label>
          <Textarea
            value={values.personalFacts}
            onChange={(e) => handleChange('personalFacts', e.target.value)}
            placeholder="Hobbies, preferences, family details..."
            rows={3}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6"
          disabled={!values.name.trim()}
        >
          Save Client
        </Button>
      </form>
    </div>
  );
};

export default AddClientPage;
