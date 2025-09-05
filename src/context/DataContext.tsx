import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialVehicles, initialRentals, initialCustomers, initialRentalRequests } from '../data/mockData';
import type { Vehicle, Rental, Customer, ToastMessage, ServiceRecord, RentalRequest } from '../types';
import { supabase } from '../supabaseClient';

// Helper to decode Base64
const base64ToBlob = (base64: string, contentType: string) => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};


interface DataContextProps {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  rentals: Rental[];
  setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  rentalRequests: RentalRequest[];
  toasts: ToastMessage[];
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  bankAccountNumber: string;
  setBankAccountNumber: (accountNumber: string) => void;
  addServiceRecord: (vehicleId: string, record: Omit<ServiceRecord, 'id'>) => void;
  updateServiceRecord: (vehicleId: string, record: ServiceRecord) => void;
  deleteServiceRecord: (vehicleId: string, recordId: string) => void;
  addRentalRequest: (request: Omit<RentalRequest, 'id' | 'status'>) => void;
  approveRentalRequest: (requestId: string, vehicleId: string, startDate: string, endDate: string, totalPrice: number) => Promise<void>;
  getLicenseImageUrl: (path: string) => Promise<string | null>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => sessionStorage.getItem('isAuthenticated') === 'true');
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => JSON.parse(localStorage.getItem('vehicles') || 'null') || initialVehicles);
  const [rentals, setRentals] = useState<Rental[]>(() => JSON.parse(localStorage.getItem('rentals') || 'null') || initialRentals);
  const [customers, setCustomers] = useState<Customer[]>(() => JSON.parse(localStorage.getItem('customers') || 'null') || initialCustomers);
  const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>(() => JSON.parse(localStorage.getItem('rentalRequests') || 'null') || initialRentalRequests);
  const [bankAccountNumber, setBankAccountNumberState] = useState<string>(() => localStorage.getItem('bankAccountNumber') || '123456789/0800');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => { localStorage.setItem('vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('rentals', JSON.stringify(rentals)); }, [rentals]);
  useEffect(() => { localStorage.setItem('customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('rentalRequests', JSON.stringify(rentalRequests)); }, [rentalRequests]);
  useEffect(() => { localStorage.setItem('bankAccountNumber', bankAccountNumber); }, [bankAccountNumber]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(toast => toast.id !== id)), 3000);
  };
  
  const login = (password: string): boolean => {
    const correctPassword = import.meta.env.VITE_APP_PASSWORD || 'password';
    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      addToast('Přihlášení úspěšné!', 'success');
      return true;
    }
    addToast('Nesprávné heslo.', 'error');
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  };

  const setBankAccountNumber = (accountNumber: string) => setBankAccountNumberState(accountNumber);

  const addServiceRecord = (vehicleId: string, record: Omit<ServiceRecord, 'id'>) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, serviceHistory: [...v.serviceHistory, { ...record, id: `sr${Date.now()}` }] } : v));
  };

  const updateServiceRecord = (vehicleId: string, updatedRecord: ServiceRecord) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, serviceHistory: v.serviceHistory.map(r => r.id === updatedRecord.id ? updatedRecord : r) } : v));
  };

  const deleteServiceRecord = (vehicleId: string, recordId: string) => {
    setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, serviceHistory: v.serviceHistory.filter(r => r.id !== recordId) } : v));
    addToast('Servisní záznam byl smazán.', 'info');
  };
  
  const addRentalRequest = (request: Omit<RentalRequest, 'id' | 'status'>) => {
    const newRequest: RentalRequest = { ...request, id: `req${Date.now()}`, status: 'pending' };
    setRentalRequests(prev => [...prev, newRequest]);
  };

  const approveRentalRequest = async (requestId: string, vehicleId: string, startDate: string, endDate: string, totalPrice: number) => {
    const request = rentalRequests.find(r => r.id === requestId);
    if (!request) {
      addToast('Žádost nenalezena.', 'error');
      return;
    }

    // 1. Upload driver's license image to Supabase Storage
    let imagePath = '';
    if (request.drivers_license_image_base64) {
        try {
            const blob = base64ToBlob(request.drivers_license_image_base64, 'image/jpeg');
            const fileName = `public/${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`;
            const { data, error } = await supabase.storage
                .from('drivers_licenses')
                .upload(fileName, blob);

            if (error) throw error;
            imagePath = data.path;

        } catch (error) {
            console.error("Error uploading image:", error);
            addToast('Nahrání obrázku selhalo.', 'error');
            return;
        }
    }

    // 2. Create new customer
    const newCustomer: Customer = {
      id: `c${Date.now()}`,
      ...request.customer_details,
      drivers_license_image_path: imagePath,
    };
    setCustomers(prev => [...prev, newCustomer]);

    // 3. Create new rental
    const newRental: Rental = {
      id: `r${Date.now()}`,
      customerId: newCustomer.id,
      vehicleId,
      startDate,
      endDate,
      totalPrice,
      status: new Date(startDate) > new Date() ? 'upcoming' : 'active',
      digital_consent_at: request.digital_consent_at,
    };
    setRentals(prev => [...prev, newRental]);
    
    // 4. Update request status
    setRentalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));
    addToast('Žádost byla schválena a smlouva vytvořena.', 'success');
  };

  const getLicenseImageUrl = async (path: string): Promise<string | null> => {
      try {
          const { data, error } = await supabase.storage
              .from('drivers_licenses')
              .createSignedUrl(path, 60 * 5); // URL platná 5 minut
          if (error) throw error;
          return data.signedUrl;
      } catch (error) {
          console.error("Error getting signed URL:", error);
          addToast("Nepodařilo se načíst obrázek.", 'error');
          return null;
      }
  };


  const value = {
    vehicles, setVehicles,
    rentals, setRentals,
    customers, setCustomers,
    rentalRequests,
    toasts, addToast,
    isAuthenticated, login, logout,
    bankAccountNumber, setBankAccountNumber,
    addServiceRecord, updateServiceRecord, deleteServiceRecord,
    addRentalRequest, approveRentalRequest, getLicenseImageUrl
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
