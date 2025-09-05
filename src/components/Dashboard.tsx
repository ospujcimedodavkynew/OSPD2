// Populating placeholder file with Dashboard component implementation.
import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { vehicles, rentals, customers } = useData();

  const activeRentals = rentals.filter(r => r.status === 'active').length;
  const upcomingRentals = rentals.filter(r => r.status === 'upcoming').length;
  const availableVehicles = vehicles.length - activeRentals;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Přehled</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <h3 className="text-md font-semibold text-text-secondary">Celkem vozidel</h3>
          <p className="text-3xl font-bold">{vehicles.length}</p>
        </Card>
        <Card>
          <h3 className="text-md font-semibold text-text-secondary">Aktivní pronájmy</h3>
          <p className="text-3xl font-bold">{activeRentals}</p>
        </Card>
        <Card>
          <h3 className="text-md font-semibold text-text-secondary">Dostupná vozidla</h3>
          <p className="text-3xl font-bold">{availableVehicles}</p>
        </Card>
        <Card>
          <h3 className="text-md font-semibold text-text-secondary">Registrovaní zákazníci</h3>
          <p className="text-3xl font-bold">{customers.length}</p>
        </Card>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-bold mb-4">Nadcházející pronájmy</h2>
          <div className="space-y-3">
            {rentals.filter(r => r.status === 'upcoming').slice(0, 5).map(rental => {
              const vehicle = vehicles.find(v => v.id === rental.vehicleId);
              const customer = customers.find(c => c.id === rental.customerId);
              return (
                <div key={rental.id} className="p-3 bg-gray-800 rounded-md">
                  <p className="font-semibold">{vehicle?.brand} - {customer?.first_name} {customer?.last_name}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(rental.startDate).toLocaleString('cs-CZ')} - {new Date(rental.endDate).toLocaleString('cs-CZ')}
                  </p>
                </div>
              );
            })}
            {upcomingRentals === 0 && <p className="text-text-secondary">Žádné nadcházející pronájmy.</p>}
             <Link to="/rentals" className="text-primary hover:underline mt-2 inline-block">Zobrazit všechny</Link>
          </div>
        </Card>
        <Card>
           <h2 className="text-xl font-bold mb-4">Vozidla vyžadující pozornost</h2>
           <div className="space-y-3">
            {/* Logic for vehicles needing service would go here */}
            <p className="text-text-secondary">Všechna vozidla jsou v pořádku.</p>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
