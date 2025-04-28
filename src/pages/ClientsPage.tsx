
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import ClientCard from '@/components/ClientCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const ClientsPage: React.FC = () => {
  const { clients } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Memory Vault</h1>
        <Link to="/add-client">
          <Button size="sm" className="rounded-full">
            <Plus className="h-4 w-4 mr-1" />
            New Client
          </Button>
        </Link>
      </div>
      
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      {filteredClients.length > 0 ? (
        filteredClients.map(client => (
          <ClientCard key={client.id} client={client} />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No clients found</p>
          <Link to="/add-client" className="block mt-2 text-blue-600">
            + Add your first client
          </Link>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
