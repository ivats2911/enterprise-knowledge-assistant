export interface Gym {
    id?: number;
    name: string;
    location: string;
}

export interface Asset {
    id?: number;
    name: string;
    type: string;
    purchase_date?: string;
    notes?: string;
    gym_id?: number;
}

export interface MaintenanceLog {
    id?: number;
    asset_id: number;
    date: string;
    description: string;
    cost?: number;
    technician?: string;
}
