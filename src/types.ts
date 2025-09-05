export interface ServiceRecord {
  id: string;
  date: string;
  description: string;
  cost: number;
}

export interface Vehicle {
  id:string;
  brand: string;
  license_plate: string;
  vin: string;
  year: number;
  pricing: {
    '4h': number;
    '6h': number;
    '12h': number;
    '24h': number;
    daily: number;
  };
  serviceHistory: ServiceRecord[];
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id_card_number: string;
  drivers_license_number: string;
  drivers_license_image_path?: string; // Cesta k souboru v Supabase Storage
}

export interface Rental {
  id: string;
  vehicleId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'active' | 'completed' | 'upcoming' | 'pending';
  digital_consent_at?: string; // Čas digitálního souhlasu
}

export interface RentalRequest {
    id: string;
    customer_details: Omit<Customer, 'id' | 'drivers_license_image_path'>;
    drivers_license_image_base64: string; // Base64 pro nahrání
    digital_consent_at: string;
    status: 'pending' | 'approved' | 'rejected';
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};
