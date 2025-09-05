import type { Vehicle, Customer, Rental } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    brand: 'Ford Transit',
    model: 'L3H2',
    year: 2022,
    licensePlate: '5B2 1234',
    vin: 'WF0XXXTTGXGA12345',
    status: 'available',
    pricing: { '4h': 700, '6h': 900, '12h': 1100, '24h': 1300, daily: 1300 },
  },
  {
    id: 'v2',
    brand: 'Mercedes-Benz Sprinter',
    model: '316 CDI',
    year: 2021,
    licensePlate: '3E9 5678',
    vin: 'WDB9066351N123456',
    status: 'available',
    pricing: { '4h': 800, '6h': 1000, '12h': 1300, '24h': 1500, daily: 1500 },
  },
  {
    id: 'v3',
    brand: 'Renault Master',
    model: 'L2H2',
    year: 2023,
    licensePlate: '1AD 9012',
    vin: 'VF1MA0H0G12345678',
    status: 'rented',
    pricing: { '4h': 750, '6h': 950, '12h': 1200, '24h': 1400, daily: 1400 },
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 'c1',
    firstName: 'Jan',
    lastName: 'Novák',
    email: 'jan.novak@example.com',
    phone: '+420 123 456 789',
    idCardNumber: '123456789',
    driversLicenseNumber: 'C98765432',
  },
  {
    id: 'c2',
    firstName: 'Petra',
    lastName: 'Svobodová',
    email: 'petra.svobodova@example.com',
    phone: '+420 987 654 321',
    idCardNumber: '987654321',
    driversLicenseNumber: 'D12345678',
  },
];

const now = new Date();
export const mockRentals: Rental[] = [
  {
    id: 'r1',
    customerId: 'c1',
    vehicleId: 'v3',
    startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 10).toISOString(),
    endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18).toISOString(),
    totalPrice: 3 * 1400,
    status: 'active',
  },
  {
    id: 'r2',
    customerId: 'c2',
    vehicleId: 'v1',
    startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10, 9).toISOString(),
    endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 12).toISOString(),
    totalPrice: 3 * 1300,
    status: 'completed',
  },
  {
    id: 'r3',
    customerId: 'c1',
    vehicleId: 'v2',
    startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 14).toISOString(),
    endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8, 14).toISOString(),
    totalPrice: 3 * 1500,
    status: 'upcoming',
  },
];
