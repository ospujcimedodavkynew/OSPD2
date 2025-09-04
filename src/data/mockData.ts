import type { Vehicle, Customer, Rental } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    brand: 'Renault Master',
    licensePlate: '1AB 1234',
    vin: 'VF1MA000000000001',
    year: 2022,
    lastServiceDate: '2024-05-15',
    lastServiceCost: 5000,
    stkDate: '2026-04-20',
    insuranceInfo: 'ČSOB Pojišťovna, pol. 123456789',
    vignetteUntil: '2025-01-31',
    pricing: { '4h': 800, '6h': 1000, '12h': 1200, '24h': 1500, daily: 1300 },
  },
  {
    id: 'v2',
    brand: 'Opel Movano',
    licensePlate: '2BC 5678',
    vin: 'W0V00000000000002',
    year: 2021,
    lastServiceDate: '2024-03-10',
    lastServiceCost: 4500,
    stkDate: '2025-08-10',
    insuranceInfo: 'Generali, pol. 987654321',
    vignetteUntil: '2025-06-30',
    pricing: { '4h': 850, '6h': 1050, '12h': 1250, '24h': 1550, daily: 1350 },
  },
   {
    id: 'v3',
    brand: 'Fiat Ducato',
    licensePlate: '3CD 9012',
    vin: 'ZFA25000000000003',
    year: 2023,
    lastServiceDate: '2024-06-01',
    lastServiceCost: 6000,
    stkDate: '2027-02-15',
    insuranceInfo: 'Allianz, pol. 112233445',
    vignetteUntil: '2025-03-31',
    pricing: { '4h': 900, '6h': 1100, '12h': 1300, '24h': 1600, daily: 1400 },
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
    driversLicenseNumber: '987654321',
  },
  {
    id: 'c2',
    firstName: 'Petra',
    lastName: 'Svobodová',
    email: 'petra.svobodova@example.com',
    phone: '+420 987 654 321',
    idCardNumber: '112233445',
    driversLicenseNumber: '554433221',
  },
];

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 2);
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const lastWeek = new Date();
lastWeek.setDate(today.getDate() - 7);


export const mockRentals: Rental[] = [
  {
    id: 'r1',
    vehicleId: 'v1',
    customerId: 'c1',
    startDate: yesterday.toISOString().slice(0, 16),
    endDate: tomorrow.toISOString().slice(0, 16),
    totalPrice: 3 * 1300,
    status: 'active',
  },
  {
    id: 'r2',
    vehicleId: 'v2',
    customerId: 'c2',
    startDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().slice(0, 16),
    endDate: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString().slice(0, 16),
    totalPrice: 3 * 1350,
    status: 'upcoming',
  },
  {
    id: 'r3',
    vehicleId: 'v1',
    customerId: 'c2',
    startDate: lastWeek.toISOString().slice(0, 16),
    endDate: yesterday.toISOString().slice(0, 16),
    totalPrice: 6 * 1300,
    status: 'completed',
  },
];
