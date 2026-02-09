import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Gym } from '../types';
import { getGyms, createGym } from '../api';
import GymCard from '../components/GymCard';
import { useAuth } from '../context/AuthContext';
import { Plus, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [gyms, setGyms] = useState<Gym[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGymName, setNewGymName] = useState('');
    const [newGymLocation, setNewGymLocation] = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        loadGyms();
    }, []);

    const loadGyms = async () => {
        try {
            const data = await getGyms();
            setGyms(data);
        } catch (error) {
            console.error('Failed to load gyms');
        }
    };

    const handleCreateGym = async () => {
        if (!newGymName || !newGymLocation) return;
        await createGym({ name: newGymName, location: newGymLocation });
        setIsModalOpen(false);
        setNewGymName('');
        setNewGymLocation('');
        loadGyms();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <h1>Gym Dashboard</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Add Gym
                    </button>
                    <button 
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#ef4444', // Red color for logout
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            <div className="gym-grid">
                {gyms.map((gym) => (
                    <GymCard key={gym.id} gym={gym} onClick={() => navigate(`/gyms/${gym.id}`)} />
                ))}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Add New Gym</h2>
                        <input placeholder="Gym Name" value={newGymName} onChange={(e) => setNewGymName(e.target.value)} />
                        <input placeholder="Location" value={newGymLocation} onChange={(e) => setNewGymLocation(e.target.value)} />
                        <div className="modal-actions">
                            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className="primary-btn" onClick={handleCreateGym}>Create</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
