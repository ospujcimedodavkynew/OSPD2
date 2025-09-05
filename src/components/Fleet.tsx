import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Modal, Input, ConfirmModal } from './ui';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';
import type { Vehicle } from '../types';

const VehicleForm: React.FC<{ vehicle?: Vehicle; onSave: (vehicle: Omit<Vehicle, 'id'> | Vehicle) => void; onCancel: () => void }> = ({ vehicle, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Vehicle, 'id' | 'pricing'> & { pricing: { [key: string]: string } }>({
        brand: vehicle?.brand ?? '',
        model: vehicle?.model ?? '',
        year: vehicle?.year ?? new Date().getFullYear(),
        licensePlate: vehicle?.licensePlate ?? '',
        vin: vehicle?.vin ?? '',
        status: vehicle?.status ?? 'available',
        pricing: {
            '4h': String(vehicle?.pricing['4h'] ?? '0'),
            '6h': String(vehicle?.pricing['6h'] ?? '0'),
            '12h': String(vehicle?.pricing['12h'] ?? '0'),
            '24h': String(vehicle?.pricing['24h'] ?? '0'),
            daily: String(vehicle?.pricing.daily ?? '0'),
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, pricing: { ...prev.pricing, [name]: value } }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const vehicleData = {
            ...formData,
            year: Number(formData.year),
            pricing: {
                '4h': Number(formData.pricing['4h']),
                '6h': Number(formData.pricing['6h']),
                '12h': Number(formData.pricing['12h']),
                '24h': Number(formData.pricing['24h']),
                daily: Number(formData.pricing.daily),
            }
        };

        if (vehicle) {
            onSave({ ...vehicleData, id: vehicle.id });
        } else {
            onSave(vehicleData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Značka" name="brand" value={formData.brand} onChange={handleChange} required />
                <Input label="Model" name="model" value={formData.model} onChange={handleChange} required />
                <Input label="Rok výroby" name="year" type="number" value={formData.year} onChange={handleChange} required />
                <Input label="SPZ" name="licensePlate" value={formData.licensePlate} onChange={handleChange} required />
                <Input label="VIN" name="vin" value={formData.vin} onChange={handleChange} required />
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-text-primary focus:ring-accent focus:border-accent">
                        <option value="available">Dostupné</option>
                        <option value="rented">Půjčeno</option>
                        <option value="maintenance">V údržbě</option>
                    </select>
                </div>
            </div>
            <h3 className="text-lg font-semibold pt-4 border-t border-gray-700">Ceník (Kč)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Input label="4 hodiny" name="4h" type="number" value={formData.pricing['4h']} onChange={handlePricingChange} required />
                <Input label="6 hodin" name="6h" type="number" value={formData.pricing['6h']} onChange={handlePricingChange} required />
                <Input label="12 hodin" name="12h" type="number" value={formData.pricing['12h']} onChange={handlePricingChange} required />
                <Input label="24 hodin" name="24h" type="number" value={formData.pricing['24h']} onChange={handlePricingChange} required />
                <Input label="Denní sazba" name="daily" type="number" value={formData.pricing.daily} onChange={handlePricingChange} required />
            </div>
            <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="secondary" onClick={onCancel}>Zrušit</Button>
                <Button type="submit">{vehicle ? 'Uložit změny' : 'Přidat vozidlo'}</Button>
            </div>
        </form>
    );
};

const Fleet: React.FC = () => {
  const { vehicles, setVehicles, addToast } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [deletingVehicle, setDeletingVehicle] = useState<Vehicle | null>(null);

  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id'> | Vehicle) => {
    if ('id' in vehicleData) { // Editing
      setVehicles(prev => prev.map(v => v.id === vehicleData.id ? vehicleData : v));
      addToast('Vozidlo bylo úspěšně upraveno.', 'success');
    } else { // Adding
      const newVehicle: Vehicle = { ...vehicleData, id: `v${new Date().getTime()}` };
      setVehicles(prev => [...prev, newVehicle]);
      addToast('Vozidlo bylo úspěšně přidáno.', 'success');
    }
    setIsModalOpen(false);
    setEditingVehicle(undefined);
  };
  
  const handleDeleteVehicle = () => {
    if (!deletingVehicle) return;
    setVehicles(prev => prev.filter(v => v.id !== deletingVehicle.id));
    addToast(`Vozidlo ${deletingVehicle.brand} bylo smazáno.`, 'info');
    setDeletingVehicle(null);
  }

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingVehicle(undefined);
    setIsModalOpen(true);
  };

  const getStatusChip = (status: Vehicle['status']) => {
    const styles = {
      available: 'bg-green-500 text-white',
      rented: 'bg-yellow-500 text-black',
      maintenance: 'bg-red-500 text-white',
    };
    const text = {
      available: 'Dostupné',
      rented: 'Půjčeno',
      maintenance: 'V údržbě',
    }
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{text[status]}</span>;
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Správa vozového parku</h2>
          <Button onClick={handleAddNew}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Přidat vozidlo
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-3">Vozidlo</th>
                <th className="p-3">SPZ</th>
                <th className="p-3">Cena / den</th>
                <th className="p-3">Status</th>
                <th className="p-3">Akce</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(vehicle => (
                <tr key={vehicle.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="p-3 font-medium">{vehicle.brand} <span className="text-sm text-gray-400">{vehicle.model}</span></td>
                  <td className="p-3">{vehicle.licensePlate}</td>
                  <td className="p-3">{formatCurrency(vehicle.pricing.daily)}</td>
                  <td className="p-3">{getStatusChip(vehicle.status)}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => handleEdit(vehicle)} className="p-2 h-9 w-9"><EditIcon className="w-4 h-4" /></Button>
                        <Button variant="danger" onClick={() => setDeletingVehicle(vehicle)} className="p-2 h-9 w-9"><TrashIcon className="w-4 h-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingVehicle ? "Upravit vozidlo" : "Přidat nové vozidlo"}>
        <VehicleForm 
            vehicle={editingVehicle}
            onSave={handleSaveVehicle}
            onCancel={() => { setIsModalOpen(false); setEditingVehicle(undefined); }}
        />
      </Modal>

      <ConfirmModal
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleDeleteVehicle}
        title="Opravdu smazat vozidlo?"
      >
        Tato akce je nevratná. Opravdu chcete smazat vozidlo {deletingVehicle?.brand} ({deletingVehicle?.licensePlate})?
      </ConfirmModal>

    </>
  );
};

export default Fleet;
