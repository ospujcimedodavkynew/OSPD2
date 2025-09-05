import React, { useState } from 'react';
import { Button, Card, Input } from './ui';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd validate credentials here.
        // For this demo, we'll just log in.
        onLogin();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-sm">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-2xl font-bold">Rental<span className="text-accent">Manager</span></h1>
                        <p className="text-text-secondary">Přihlaste se do svého účtu</p>
                    </div>
                    <div className="space-y-4">
                        <Input 
                            label="Email" 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="you@example.com"
                            required 
                        />
                        <Input 
                            label="Heslo" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            required 
                        />
                    </div>
                    <Button type="submit" className="w-full mt-6">
                        Přihlásit se
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
