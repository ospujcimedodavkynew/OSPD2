import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';
import { TruckIcon, UsersIcon, TrendingUpIcon, CalendarIcon } from './Icons';

const Dashboard: React.FC = () => {
  const { vehicles, rentals, customers } = useData();

  const activeRentals = rentals.filter(r => r.status === 'active').length;
  const totalRevenue = rentals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.totalPrice, 0);
  
  const upcomingRentals = rentals
    .filter(r => new Date(r.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(amount);
  };
  
  const getVehicleStatusChip = (status: 'available' | 'rented' | 'maintenance') => {
    const styles = {
      available: 'bg-green-500 text-white',
      rented: 'bg-yellow-500 text-black',
      maintenance: 'bg-red-500 text-white',
    };
    const text = {
      available: 'Dostupné',
      rented: 'Půjčeno',
      maintenance: 'V údržbě',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary/20 text-primary">
              <TruckIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-text-secondary">Celkem vozidel</p>
              <p className="text-2xl font-bold">{vehicles.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-secondary/20 text-secondary">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-text-secondary">Aktivní pronájmy</p>
              <p className="text-2xl font-bold">{activeRentals}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-accent/20 text-accent">
              <TrendingUpIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-text-secondary">Celkové tržby (dokončené)</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/20 text-green-500">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-text-secondary">Zákazníků</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Rentals */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Nadcházející pronájmy</h2>
          <div className="space-y-3">
            {upcomingRentals.length > 0 ? (
              upcomingRentals.map(rental => {
                const vehicle = vehicles.find(v => v.id === rental.vehicleId);
                const customer = customers.find(c => c.id === rental.customerId);
                return (
                  <div key={rental.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                    <div>
                      <p className="font-semibold">{customer?.firstName} {customer?.lastName}</p>
                      <p className="text-sm text-text-secondary">{vehicle?.brand} ({vehicle?.licensePlate})</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{new Date(rental.startDate).toLocaleDateString('cs-CZ')}</p>
                      <p className="text-sm text-text-secondary">{new Date(rental.startDate).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-text-secondary">Žádné nadcházející pronájmy.</p>
            )}
          </div>
        </Card>

        {/* Vehicle Status */}
        <Card>
          <h2 className="text-xl font-bold mb-4">Status vozidel</h2>
          <div className="space-y-3">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-md">
                <div>
                  <p className="font-semibold">{vehicle.brand}</p>
                  <p className="text-sm text-text-secondary">{vehicle.licensePlate}</p>
                </div>
                {getVehicleStatusChip(vehicle.status)}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
