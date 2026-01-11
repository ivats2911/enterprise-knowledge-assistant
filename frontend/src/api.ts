import axios from 'axios';
import type { Gym, Asset, MaintenanceLog } from './types';

// Use relative path which will be proxied by Vite
const API_URL = '';

export const getGyms = async (): Promise<Gym[]> => {
    const response = await axios.get(`${API_URL}/gyms/`);
    return response.data;
};

export const createGym = async (gym: Gym): Promise<Gym> => {
    const response = await axios.post(`${API_URL}/gyms/`, gym);
    return response.data;
};

export const getGym = async (id: number): Promise<Gym> => {
    const response = await axios.get(`${API_URL}/gyms/${id}`);
    return response.data;
};

export const createAsset = async (asset: Asset): Promise<Asset> => {
    const response = await axios.post(`${API_URL}/assets/`, asset);
    return response.data;
};

export const getAssetsByGym = async (gymId: number): Promise<Asset[]> => {
    const response = await axios.get(`${API_URL}/gyms/${gymId}/assets/`);
    return response.data;
};

export const uploadManual = async (assetId: number, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_URL}/assets/${assetId}/manual/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateAsset = async (assetId: number, asset: Partial<Asset>): Promise<Asset> => {
    const response = await axios.put(`${API_URL}/assets/${assetId}`, asset);
    return response.data;
};

export const deleteAsset = async (assetId: number): Promise<void> => {
    await axios.delete(`${API_URL}/assets/${assetId}`);
};

export const getMaintenanceLogs = async (assetId: number): Promise<MaintenanceLog[]> => {
    const response = await axios.get(`${API_URL}/assets/${assetId}/maintenance/`);
    return response.data;
};

export const createMaintenanceLog = async (assetId: number, log: MaintenanceLog): Promise<MaintenanceLog> => {
    const response = await axios.post(`${API_URL}/assets/${assetId}/maintenance/`, log);
    return response.data;
};

export const login = async (username: string, password: string): Promise<{ access_token: string }> => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await axios.post(`${API_URL}/token`, formData);
    return response.data;
};

export const queryKnowledgeBase = async (question: string): Promise<{ answer: string }> => {
    const response = await axios.post(`${API_URL}/query/`, null, { params: { question } });
    return response.data;
};
