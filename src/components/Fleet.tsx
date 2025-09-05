import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Modal, Input, ConfirmModal } from './ui';
import { PlusIcon, EditIcon, TrashIcon } from './Icons';
import type { Vehicle, ServiceRecord } from '../types';

// Service History Management Component
const ServiceHistoryManager: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    const { addServiceRecord, updateServiceRecord, deleteServiceRecord, addToast } = useData();
    const [editingRecord, setEditingRecord] = useState<ServiceRecord | null>(null);
    const [newRecord, setNewRecord] = useState({ date: '', description: '', cost: '' });

    const handleSave = () => {
        if (!newRecord.date || !newRecord.description || !newRecord.cost) {
            addToast('Vyplňte prosím všechna pole pro servisní záznam.', 'error');
            return;
        }
        const recordData = {
            date: newRecord.date,
            description: newRecord.description,
            cost: Number(newRecord.cost)
        };
        if (editingRecord) {
            updateServiceRecord(vehicle.id, { ...editingRecord, ...recordData });
            addToast('Servisní záznam byl upraven.', 'success');
        } else {
            addServiceRecord(vehicle.id, recordData);
            addToast('Nový servisní záznam byl přidán.', 'success');
        }
        setEditingRecord(null);
        setNewRecord({ date: '', description: '', cost: '' });
    };

    const handleEdit = (record: ServiceRecord) => {
        setEditingRecord(record);
        setNewRecord({
            date: record.date,
            description: record.description,
            cost: String(record.cost)
        });
    };
    
    const handleCancelEdit = () => {
        setEditingRecord(null);
        setNewRecord({ date: '', description: '', cost: '' });
    };

    return (
        <div className="space-y-4">
            <h4 className="text-md font-semibold text-text-primary">Servisní záznamy</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {vehicle.serviceHistory.map(record => (
                    <div key={record.id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                        <div>
                            <p className="font-medium">{new Date(record.date).toLocaleDateString('cs-CZ')} - {record.description}</p>
                            <p className="text-sm text-accent">{record.cost} Kč</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" className="p-1 h-7 w-7" onClick={() => handleEdit(record)}><EditIcon className="w-4 h-4"/></Button>
                            <Button variant="danger" className="p-1 h-7 w-7" onClick={() => deleteServiceRecord(vehicle.id, record.id)}><TrashIcon className="w-4 h-4"/></Button>
                        </div>
                    </div>
                ))}
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-t border-gray-700 pt-4">
                <Input label="Datum" type="date" value={newRecord.date} onChange={e => setNewRecord({...newRecord, date: e.target.value})} />
                <Input label="Popis" value={newRecord.description} onChange={e => setNewRecord({...newRecord, description: e.target.value})} />
                <Input label="Cena (Kč)" type="number" value={newRecord.cost} onChange={e => setNewRecord({...newRecord, cost: e.target.value})} />
            </div>
            <div className="flex justify-end gap-2">
                {editingRecord && <Button variant="secondary" onClick={handleCancelEdit}>Zrušit úpravy</Button>}
                <Button onClick={handleSave}>{editingRecord ? 'Uložit změny' : 'Přidat záznam'}</Button>
            </div>
        </div>
    );
};


// Main Vehicle Form Component
const VehicleForm: React.FC<{ vehicle?: Vehicle; onSave: (vehicle: Omit<Vehicle, 'id'> | Vehicle) => void; onCancel: () => void }> = ({ vehicle, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        brand: vehicle?.brand ?? '',
        license_plate: vehicle?.license_plate ?? '',
        vin: vehicle?.vin ?? '',
        year: vehicle?.year ?? new Date().getFullYear(),
        pricing: {
            '4h': String(vehicle?.pricing['4h'] ?? '0'),
            '6h': String(vehicle?.pricing['6h'] ?? '0'),
            '12h': String(vehicle?.pricing['12h'] ?? '0'),
            '24h': String(vehicle?.pricing['24h'] ?? '0'),
            daily: String(vehicle?.pricing.daily ?? '0'),
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            },
            serviceHistory: vehicle?.serviceHistory ?? [],
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
                <Input label="SPZ" name="license_plate" value={formData.license_plate} onChange={handleChange} required />
                <Input label="VIN" name="vin" value={formData.vin} onChange={handleChange} required />
                <Input label="Rok výroby" name="year" type="number" value={formData.year} onChange={handleChange} required />
            </div>
            <h3 className="text-lg font-semibold pt-4 border-t border-gray-700">Ceník (Kč)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Input label="4h" name="4h" type="number" value={formData.pricing['4h']} onChange={handlePricingChange} required />
                <Input label="6h" name="6h" type="number" value={formData.pricing['6h']} onChange={handlePricingChange} required />
                <Input label="12h" name="12h" type="number" value={formData.pricing['12h']} onChange={handlePricingChange} required />
                <Input label="24h" name="24h" type="number" value={formData.pricing['24h']} onChange={handlePricingChange} required />
                <Input label="Denní" name="daily" type="number" value={formData.pricing.daily} onChange={handlePricingChange} required />
            </div>

            {vehicle && (
                <div className="pt-4 border-t border-gray-700">
                    <ServiceHistoryManager vehicle={vehicle} />
                </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
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
    if ('id' in vehicleData) {
      setVehicles(prev => prev.map(v => v.id === vehicleData.id ? vehicleData : v));
      addToast('Vozidlo bylo úspěšně upraveno.', 'success');
    } else {
      const newVehicle: Vehicle = { ...vehicleData, id: `v${Date.now()}` };
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

  const getLastServiceDate = (vehicle: Vehicle) => {
    if (vehicle.serviceHistory.length === 0) return 'N/A';
    const lastService = vehicle.serviceHistory.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return new Date(lastService.date).toLocaleDateString('cs-CZ');
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Správa vozového parku</h1>
        <Button onClick={handleAddNew}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Přidat vozidlo
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map(vehicle => (
          <Card key={vehicle.id} className="flex flex-col">
            <div className="flex-1">
                <h3 className="text-lg font-bold">{vehicle.brand}</h3>
                <p className="text-sm text-gray-400 mb-4">{vehicle.license_plate} | {vehicle.vin}</p>
                
                <div className="text-xs space-y-2">
                    <p><strong>Cena/den:</strong> {vehicle.pricing.daily} Kč</p>
                    <p><strong>Poslední servis:</strong> {getLastServiceDate(vehicle)}</p>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-700">
                <Button variant="secondary" onClick={() => handleEdit(vehicle)}><EditIcon className="w-4 h-4 mr-2"/>Upravit</Button>
                <Button variant="danger" onClick={() => setDeletingVehicle(vehicle)}><TrashIcon className="w-4 h-4 mr-2"/>Smazat</Button>
            </div>
          </Card>
        ))}
      </div>
      
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
        Tato akce je nevratná. Opravdu chcete smazat vozidlo {deletingVehicle?.brand} ({deletingVehicle?.license_plate})?
      </ConfirmModal>
    </>
  );
};

export default Fleet;
