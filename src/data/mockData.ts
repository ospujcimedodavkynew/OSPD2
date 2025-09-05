import type { Vehicle, Rental, Customer, RentalRequest } from '../types';

export const initialCustomers: Customer[] = [
  { id: 'c1', first_name: 'Jan', last_name: 'Novák', email: 'jan.novak@example.com', phone: '123456789', id_card_number: '123456789', drivers_license_number: '987654321', drivers_license_image_path: undefined },
  { id: 'c2', first_name: 'Eva', last_name: 'Svobodová', email: 'eva.svobodova@example.com', phone: '987654321', id_card_number: '987654321', drivers_license_number: '123456789', drivers_license_image_path: undefined },
];

export const initialVehicles: Vehicle[] = [
  { 
    id: 'v1', 
    brand: 'Renault Master L3H2', 
    license_plate: '1AB 1234', 
    vin: 'ABC123XYZ', 
    year: 2022, 
    pricing: { '4h': 500, '6h': 700, '12h': 900, '24h': 1200, daily: 1000 },
    serviceHistory: [
      { id: 'sr1', date: '2023-05-20', description: 'Výměna oleje', cost: 2500 },
      { id: 'sr2', date: '2023-11-15', description: 'Kontrola brzd', cost: 1500 },
    ],
  },
  { 
    id: 'v2', 
    brand: 'Citroen Jumper L2H2', 
    license_plate: '2CD 5678', 
    vin: 'DEF456ABC', 
    year: 2021, 
    pricing: { '4h': 450, '6h': 650, '12h': 850, '24h': 1100, daily: 900 },
    serviceHistory: [],
  },
  { 
    id: 'v3', 
    brand: 'Ford Transit L4H3', 
    license_plate: '3EF 9012', 
    vin: 'GHI789DEF', 
    year: 2023, 
    pricing: { '4h': 550, '6h': 750, '12h': 950, '24h': 1300, daily: 1100 },
    serviceHistory: [
      { id: 'sr3', date: '2024-01-10', description: 'Přezutí pneu', cost: 1200 },
    ],
  },
];

const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const getPastDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export const initialRentals: Rental[] = [
  { id: 'r1', vehicleId: 'v1', customerId: 'c1', startDate: getPastDate(2), endDate: getFutureDate(2), totalPrice: 4000, status: 'active' },
  { id: 'r2', vehicleId: 'v2', customerId: 'c2', startDate: getFutureDate(5), endDate: getFutureDate(8), totalPrice: 2700, status: 'upcoming' },
  { id: 'r3', vehicleId: 'v3', customerId: 'c1', startDate: getPastDate(10), endDate: getPastDate(7), totalPrice: 3300, status: 'completed' },
];

export const initialRentalRequests: RentalRequest[] = [
    {
        id: 'req1',
        customer_details: {
            first_name: 'Tomáš',
            last_name: 'Marný',
            email: 'tomas.marny@example.com',
            phone: '555 666 777',
            id_card_number: '555666777',
            drivers_license_number: '777666555',
        },
        drivers_license_image_base64: '', // In a real app, this would be a long base64 string
        digital_consent_at: new Date().toISOString(),
        status: 'pending'
    }
];
