import React from 'react';
import type { Gym } from '../types';
import { MapPin } from 'lucide-react';
import '../index.css';

interface GymCardProps {
  gym: Gym;
  onClick: () => void;
}

const GymCard: React.FC<GymCardProps> = ({ gym, onClick }) => {
  return (
    <div className="gym-card" onClick={onClick}>
        <h3>{gym.name}</h3>
        <div className="gym-location">
            <MapPin size={16} />
            <span>{gym.location}</span>
        </div>
    </div>
  );
};

export default GymCard;
