import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Vehicle, Customer, Rental, ToastMessage } from '../types';
import { mockVehicles, mockCustomers, mockRentals } from '../data/mockData';

interface DataContextType {
  vehicles: Vehicle[];
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  rentals: Rental[];
  setRentals: React.Dispatch<React.SetStateAction<Rental[]>>;
  toasts: ToastMessage[];
  addToast: (message: string, type: ToastMessage['type']) => void;
  removeToast: (id: number) => void;
  bankAccountNumber: string;
  setBankAccountNumber: React.Dispatch<React.SetStateAction<string>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [rentals, setRentals] = useState<Rental[]>(mockRentals);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [bankAccountNumber, setBankAccountNumber] = useState('CZ12 3456 7890 1234 5678 9012');

  const addToast = useCallback((message: string, type: ToastMessage['type']) => {
    const newToast: ToastMessage = {
      id: new Date().getTime(),
      message,
      type,
    };
    setToasts(prevToasts => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(toast => toast.id !== newToast.id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const value = {
    vehicles,
    setVehicles,
    customers,
    setCustomers,
    rentals,
    setRentals,
    toasts,
    addToast,
    removeToast,
    bankAccountNumber,
    setBankAccountNumber
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
