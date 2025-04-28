
import React from 'react';
import { Link } from 'react-router-dom';
import { Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <Link to={`/clients/${client.id}`}>
      <Card className="mb-3 transition-all hover:shadow-md">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
          {client.personalFacts && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{client.personalFacts}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClientCard;
