import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Gym, Asset, MaintenanceLog } from '../types';
import { getGym, getAssetsByGym, createAsset, uploadManual, updateAsset, deleteAsset, getMaintenanceLogs, createMaintenanceLog } from '../api';
import { ArrowLeft, Plus, FileText, Search, Edit2, Trash2, MessageCircle, Wrench, Clock, DollarSign, User } from 'lucide-react';
import { eventBus } from '../events';

const GymView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [gym, setGym] = useState<Gym | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    
    // Asset Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentAssetId, setCurrentAssetId] = useState<number | null>(null);
    const [assetName, setAssetName] = useState('');
    const [assetType, setAssetType] = useState('');
    
    // Maintenance Modal State
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
    const [maintDate, setMaintDate] = useState('');
    const [maintDesc, setMaintDesc] = useState('');
    const [maintCost, setMaintCost] = useState('');
    const [maintTech, setMaintTech] = useState('');

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (id) {
            loadData(parseInt(id));
        }
    }, [id]);

    const loadData = async (gymId: number) => {
        const gymData = await getGym(gymId);
        const assetsData = await getAssetsByGym(gymId);
        setGym(gymData);
        setAssets(assetsData);
    };

    const resetModal = () => {
        setAssetName('');
        setAssetType('');
        setCurrentAssetId(null);
        setIsEdit(false);
        setIsModalOpen(false);
    }
    
    const resetMaintenanceModal = () => {
        setMaintDate('');
        setMaintDesc('');
        setMaintCost('');
        setMaintTech('');
        setIsMaintenanceModalOpen(false);
    }

    const handleCreateAsset = async () => {
        if (!assetName || !assetType || !gym?.id) return;
        try {
            await createAsset({
                name: assetName,
                type: assetType,
                gym_id: gym.id
            });
            resetModal();
            loadData(gym.id);
        } catch (error) {
            console.error("Create failed", error);
        }
    };

    const handleUpdateAsset = async () => {
        if (!currentAssetId || !assetName || !assetType || !gym?.id) return;
        try {
            await updateAsset(currentAssetId, { name: assetName, type: assetType });
            resetModal();
            loadData(gym.id);
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleDeleteAsset = async (assetId: number) => {
        if (!window.confirm("Are you sure you want to delete this asset?")) return;
        try {
            await deleteAsset(assetId);
            if (gym?.id) loadData(gym.id);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };
    
    const openEditModal = (asset: Asset) => {
        setAssetName(asset.name);
        setAssetType(asset.type);
        setCurrentAssetId(asset.id!);
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const openMaintenanceModal = async (assetId: number) => {
        setCurrentAssetId(assetId);
        // Load logs
        const logs = await getMaintenanceLogs(assetId);
        setMaintenanceLogs(logs);
        // Set default date to today
        setMaintDate(new Date().toISOString().split('T')[0]);
        setIsMaintenanceModalOpen(true);
    };

    const handleAddMaintenanceLog = async () => {
        if (!currentAssetId || !maintDate || !maintDesc) return;
        try {
            await createMaintenanceLog(currentAssetId, {
                asset_id: currentAssetId,
                date: maintDate,
                description: maintDesc,
                cost: maintCost ? parseFloat(maintCost) : undefined,
                technician: maintTech
            });
            // Reload logs
            const logs = await getMaintenanceLogs(currentAssetId);
            setMaintenanceLogs(logs);
            // Reset form fields but keep modal open
            setMaintDesc('');
            setMaintCost('');
            setMaintTech('');
        } catch (error) {
            console.error("Log failed", error);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, assetId: number) => {
        if (!event.target.files?.length) return;
        const file = event.target.files[0];
        try {
            await uploadManual(assetId, file);
            alert("Manual uploaded successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed.");
        }
        event.target.value = '';
    };

    const askAI = (asset: Asset) => {
        eventBus.emit('chat:open', { message: `Tell me about the ${asset.name} (${asset.type}).` });
    };

    const filteredAssets = assets.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!gym) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <button className="back-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={18} /> Back to Dashboard
            </button>
            
            <header className="page-header">
                <div>
                    <h1>{gym.name}</h1>
                    <p className="subtitle">{gym.location}</p>
                </div>
                <button className="primary-btn" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Add Asset
                </button>
            </header>

            <div className="controls-bar" style={{ marginBottom: '20px' }}>
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #eee' }}>
                    <Search size={20} color="#888" />
                    <input 
                        placeholder="Search assets..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem' }}
                    />
                </div>
            </div>

            <div className="assets-list">
                <h3>Assets ({filteredAssets.length})</h3>
                {filteredAssets.length === 0 ? <p>No assets found.</p> : (
                    <div className="asset-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {filteredAssets.map((asset) => (
                            <div key={asset.id} className="gym-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{asset.name}</h3>
                                        <p style={{ color: '#666', margin: '5px 0' }}>{asset.type}</p>
                                    </div>
                                    <div className="asset-actions">
                                        <button className="icon-btn" onClick={() => openEditModal(asset)} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn" onClick={() => handleDeleteAsset(asset.id!)} title="Delete" style={{ color: '#ff4444' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="card-footer" style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #eee', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <button 
                                        className="secondary-btn" 
                                        onClick={() => openMaintenanceModal(asset.id!)}
                                        style={{ fontSize: '0.8rem', padding: '6px 10px', color: '#e67700', borderColor: '#e67700' }}
                                    >
                                        <Wrench size={14} /> Log Service
                                    </button>

                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="file"
                                            id={`file-${asset.id}`}
                                            style={{ display: 'none' }}
                                            accept=".pdf,.txt"
                                            onChange={(e) => handleFileUpload(e, asset.id!)}
                                        />
                                        <label htmlFor={`file-${asset.id}`}>
                                            <button 
                                                className="secondary-btn" 
                                                title="Upload Manual"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    document.getElementById(`file-${asset.id}`)?.click();
                                                }}
                                                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                            >
                                                <FileText size={14} /> Manual
                                            </button>
                                        </label>
                                    </div>
                                    
                                    <button 
                                        className="secondary-btn" 
                                        onClick={() => askAI(asset)}
                                        style={{ fontSize: '0.8rem', padding: '6px 10px', marginLeft: 'auto', color: '#646cff', borderColor: '#646cff' }}
                                    >
                                        <MessageCircle size={14} /> Ask AI
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{isEdit ? 'Edit Asset' : 'Add Asset'}</h2>
                        <input placeholder="Asset Name" value={assetName} onChange={(e) => setAssetName(e.target.value)} />
                        <input placeholder="Type (e.g. Treadmill)" value={assetType} onChange={(e) => setAssetType(e.target.value)} />
                        <div className="modal-actions">
                            <button onClick={resetModal}>Cancel</button>
                            <button className="primary-btn" onClick={isEdit ? handleUpdateAsset : handleCreateAsset}>
                                {isEdit ? 'Save Changes' : 'Add'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isMaintenanceModalOpen && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '600px', width: '100%' }}>
                        <h2>Maintenance History</h2>
                        
                        <div className="maintenance-logs" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                            {maintenanceLogs.length === 0 ? <p style={{ color: '#888' }}>No logs yet.</p> : (
                                maintenanceLogs.map(log => (
                                    <div key={log.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                                        <div style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{log.date}</span>
                                            {log.cost && <span>${log.cost}</span>}
                                        </div>
                                        <div>{log.description}</div>
                                        {log.technician && <div style={{ fontSize: '0.8rem', color: '#666' }}>Tech: {log.technician}</div>}
                                    </div>
                                ))
                            )}
                        </div>

                        <h3>Add New Log</h3>
                        <div style={{ display: 'grid', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div className="input-with-icon" style={{ flex: 1 }}>
                                    <Clock size={16} />
                                    <input type="date" value={maintDate} onChange={(e) => setMaintDate(e.target.value)} />
                                </div>
                                <div className="input-with-icon" style={{ flex: 1 }}>
                                    <DollarSign size={16} />
                                    <input type="number" placeholder="Cost" value={maintCost} onChange={(e) => setMaintCost(e.target.value)} />
                                </div>
                            </div>
                            <input placeholder="Description (e.g. Changed belt)" value={maintDesc} onChange={(e) => setMaintDesc(e.target.value)} />
                            <div className="input-with-icon">
                                <User size={16} />
                                <input placeholder="Technician Name" value={maintTech} onChange={(e) => setMaintTech(e.target.value)} />
                            </div>
                        </div>

                        <div className="modal-actions" style={{ marginTop: '20px' }}>
                            <button onClick={resetMaintenanceModal}>Close</button>
                            <button className="primary-btn" onClick={handleAddMaintenanceLog}>Add Log</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GymView;
