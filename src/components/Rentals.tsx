// Populating placeholder file with Rentals component implementation.
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Input, Select } from './ui';
import { PlusIcon } from './Icons';
import NewRentalForm from './NewRentalForm';
import ContractView from './ContractView';
import type { Rental } from '../types';

const Rentals: React.FC = () => {
    const { rentals, vehicles, customers, setRentals, addToast } = useData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

    const getStatusText = (status: Rental['status']) => {
        switch (status) {
            case 'active': return 'Aktivní';
            case 'completed': return 'Dokončeno';
            case 'upcoming': return 'Nadcházející';
            case 'pending': return 'Čeká na schválení';
            default: return 'Neznámý';
        }
    };

    const getStatusColor = (status: Rental['status']) => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'completed': return 'bg-gray-500';
            case 'upcoming': return 'bg-blue-500';
            case 'pending': return 'bg-yellow-500';
            default: return 'bg-gray-700';
        }
    };
    
    const handleCompleteRental = (rentalId: string) => {
        setRentals(prev => prev.map(r => r.id === rentalId ? {...r, status: 'completed'} : r));
        addToast('Pronájem byl označen jako dokončený.', 'success');
    };

    const selectedVehicle = selectedRental ? vehicles.find(v => v.id === selectedRental.vehicleId) : null;
    const selectedCustomer = selectedRental ? customers.find(c => c.id === selectedRental.customerId) : null;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Správa pronájmů</h1>
                <Button onClick={() => setIsFormOpen(true)}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Vytvořit rezervaci
                </Button>
            </div>

            <Card className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="p-4">Vozidlo</th>
                            <th className="p-4">Zákazník</th>
                            <th className="p-4">Období</th>
                            <th className="p-4">Cena</th>
                            <th className="p-4">Stav</th>
                            <th className="p-4">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.map(rental => {
                            const vehicle = vehicles.find(v => v.id === rental.vehicleId);
                            const customer = customers.find(c => c.id === rental.customerId);

                            return (
                                <tr key={rental.id} className="border-b border-gray-800 hover:bg-gray-800">
                                    <td className="p-4">{vehicle?.brand}</td>
                                    <td className="p-4">{customer?.first_name} {customer?.last_name}</td>
                                    <td className="p-4 text-sm">
                                        {new Date(rental.startDate).toLocaleString('cs-CZ')} <br />
                                        {new Date(rental.endDate).toLocaleString('cs-CZ')}
                                    </td>
                                    <td className="p-4">{rental.totalPrice} Kč</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(rental.status)}`}>
                                            {getStatusText(rental.status)}
                                        </span>
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => setSelectedRental(rental)}>Detail</Button>
                                        {rental.status === 'active' && <Button size="sm" onClick={() => handleCompleteRental(rental.id)}>Dokončit</Button>}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>

            {isFormOpen && (
                <NewRentalForm 
                    onSave={() => setIsFormOpen(false)} 
                    onCancel={() => setIsFormOpen(false)}
                />
            )}

            {selectedRental && selectedVehicle && selectedCustomer && (
                <ContractView 
                    rental={selectedRental}
                    vehicle={selectedVehicle}
                    customer={selectedCustomer}
                    onClose={() => setSelectedRental(null)}
                />
            )}
        </>
    );
};

export default Rentals;
