import React, { useRef, useState, useEffect } from 'react';
import type { Rental, Vehicle, Customer } from '../types';
import { Modal, Button } from './ui';
import SignaturePad, { SignaturePadRef } from './SignaturePad';
import { useData } from '../context/DataContext';

interface ContractViewProps {
  rental: Rental;
  vehicle: Vehicle;
  customer: Customer;
  onClose: () => void;
}

const ContractView: React.FC<ContractViewProps> = ({ rental, vehicle, customer, onClose }) => {
  const signaturePadRef = useRef<SignaturePadRef>(null);
  const [customerSignature, setCustomerSignature] = useState<string | undefined>(undefined);
  const { bankAccountNumber, getLicenseImageUrl } = useData();
  const printRef = useRef<HTMLDivElement>(null);
  const [licenseImageUrl, setLicenseImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
        if (customer.drivers_license_image_path) {
            const url = await getLicenseImageUrl(customer.drivers_license_image_path);
            setLicenseImageUrl(url);
        }
    };
    fetchImageUrl();
  }, [customer, getLicenseImageUrl]);

  const handleSaveSignature = () => {
    const signature = signaturePadRef.current?.getSignature();
    if (signature) {
      setCustomerSignature(signature);
    } else {
        alert("Prosím, podepište se.");
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
      const windowUrl = 'about:blank';
      const uniqueName = new Date().getTime();
      const windowName = `Print_${uniqueName}`;
      const printWindow = window.open(windowUrl, windowName, 'width=800,height=600');
      
      if(printWindow) {
          printWindow.document.write(`<html><head><title>Smlouva o pronájmu</title>`);
          printWindow.document.write('<style>body { font-family: sans-serif; margin: 2rem; } .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; } .section { margin-bottom: 1.5rem; } h3 { border-bottom: 1px solid #ccc; padding-bottom: 0.5rem; } .signatures { display: flex; justify-content: space-between; margin-top: 4rem; } .signature-box { border-top: 1px solid black; width: 40%; text-align: center; padding-top: 0.5rem; } .signature-box img { max-width: 150px; display: block; margin: 0 auto; } </style>');
          printWindow.document.write('</head><body>');
          printWindow.document.write(printContent.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
      }
    }
  };


  return (
    <Modal isOpen={true} onClose={onClose} title="Detail pronájmu a smlouva">
      <div className="bg-white text-black p-8 rounded-lg" ref={printRef}>
        <h2 style={{textAlign: 'center', marginBottom: '2rem'}}>Smlouva o pronájmu vozidla</h2>
        
        <div className="grid">
            <div>
                <h3>Pronajímatel</h3>
                <p>
                    <strong>RentalManager s.r.o.</strong><br/>
                    Ukázková 123, 110 00 Praha 1<br/>
                    IČO: 12345678<br/>
                    Tel: +420 123 456 789
                </p>
            </div>
            <div>
                <h3>Nájemce</h3>
                <p>
                    <strong>{customer.first_name} {customer.last_name}</strong><br/>
                    Email: {customer.email}<br/>
                    Tel: {customer.phone}<br/>
                    Číslo OP: {customer.id_card_number}<br/>
                    Číslo ŘP: {customer.drivers_license_number}
                </p>
                {licenseImageUrl && (
                    <div className="mt-4">
                        <strong>Řidičský průkaz:</strong><br/>
                        <img src={licenseImageUrl} alt="Řidičský průkaz" className="max-w-full h-auto rounded-md border" />
                    </div>
                )}
            </div>
        </div>

        <div className="section">
            <h3>Předmět pronájmu</h3>
             <p>
                <strong>Vozidlo:</strong> {vehicle.brand}<br/>
                <strong>SPZ:</strong> {vehicle.license_plate}<br/>
                <strong>VIN:</strong> {vehicle.vin}<br/>
                <strong>Rok výroby:</strong> {vehicle.year}
            </p>
        </div>

         <div className="section">
            <h3>Doba pronájmu</h3>
            <p>
                <strong>Začátek:</strong> {new Date(rental.startDate).toLocaleString('cs-CZ')}<br/>
                <strong>Konec:</strong> {new Date(rental.endDate).toLocaleString('cs-CZ')}
            </p>
        </div>

        <div className="section">
            <h3>Cena a platební podmínky</h3>
            <p>
                <strong>Celková cena:</strong> {rental.totalPrice} Kč<br/>
                <strong>Stav:</strong> {rental.status === 'completed' ? 'Zaplaceno' : 'Nezaplaceno'}<br/>
                <strong>Bankovní účet pro platbu:</strong> {bankAccountNumber}
            </p>
        </div>

        <div className="signatures">
            <div className="signature-box">
                <p>Podpis pronajímatele</p>
            </div>
            <div className="signature-box">
                {rental.digital_consent_at ? (
                    <p className="text-sm italic">Digitálně odsouhlaseno<br/>{new Date(rental.digital_consent_at).toLocaleString('cs-CZ')}</p>
                ) : (
                    customerSignature && <img src={customerSignature} alt="Podpis zákazníka" />
                )}
                <p>Podpis nájemce</p>
            </div>
        </div>
      </div>

      {!rental.digital_consent_at && (
        <div className="non-printable mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-2 text-text-primary">Podpis nájemce</h3>
            {!customerSignature ? (
                <div className="flex flex-col items-center gap-4">
                    <SignaturePad ref={signaturePadRef} />
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => signaturePadRef.current?.clear()}>Smazat</Button>
                        <Button onClick={handleSaveSignature}>Uložit podpis</Button>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4">
                    <img src={customerSignature} alt="Podpis zákazníka" className="bg-gray-100 p-2 rounded max-w-[200px]" />
                    <Button variant="secondary" onClick={() => setCustomerSignature(undefined)}>Změnit podpis</Button>
                </div>
            )}
        </div>
      )}

      <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-700">
        <Button variant="secondary" onClick={onClose}>Zavřít</Button>
        <Button onClick={handlePrint}>Vytisknout smlouvu</Button>
      </div>
    </Modal>
  );
};

export default ContractView;
