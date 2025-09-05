import React from 'react';
import { useData } from '../context/DataContext';
import { Card, Input, Button } from './ui';

const Settings: React.FC = () => {
  const { bankAccountNumber, setBankAccountNumber, addToast } = useData();
  const [localAccountNumber, setLocalAccountNumber] = React.useState(bankAccountNumber);

  const handleSave = () => {
    setBankAccountNumber(localAccountNumber);
    addToast('Číslo účtu bylo uloženo.', 'success');
  };

  return (
    <div>
      <Card>
        <h2 className="text-xl font-bold mb-4">Nastavení</h2>
        <div className="max-w-md space-y-4">
          <Input
            label="Číslo bankovního účtu"
            name="bankAccountNumber"
            value={localAccountNumber}
            onChange={(e) => setLocalAccountNumber(e.target.value)}
            placeholder="123456789/0800"
          />
          <p className="text-xs text-gray-400">
            Toto číslo bude použito pro generování platebních QR kódů.
          </p>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Uložit změny</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
