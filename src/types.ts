// src/types.ts
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  status: 'available' | 'rented' | 'maintenance';
  pricing: {
    '4h': number;
    '6h': number;
    '12h': number;
    '24h': number;
    daily: number;
  };
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idCardNumber: string;
  driversLicenseNumber: string;
}

export interface Rental {
  id: string;
  customerId: string;
  vehicleId: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  totalPrice: number;
  status: 'active' | 'completed' | 'upcoming';
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
