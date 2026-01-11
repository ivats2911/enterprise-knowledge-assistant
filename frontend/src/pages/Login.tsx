import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api';
import { Lock, User } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect when authenticated (fixes race condition)
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginApi(username, password);
            
            // Diagnostic check: If proxy fails, we might get HTML back (SPA fallback)
            if (typeof data === 'string' || !data.access_token) {
                console.error("Login received invalid data:", data);
                setError('Setup Error: Please restart your command prompt/terminal for the frontend.');
                return;
            }
            
            login(data.access_token);
            // Navigate handled by useEffect
        } catch (err: any) {
            console.error("Login Error:", err);
            // Check if it's a 401 (Invalid creds) or something else
            if (err.response && err.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('Connection failed. Is the backend running?');
            }
        }
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
        }}>
            <div style={{ 
                background: 'white', 
                padding: '40px', 
                borderRadius: '12px', 
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Welcome Back</h2>
                
                {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="input-group">
                        <User size={20} color="#666" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '12px 12px 12px 40px', 
                                borderRadius: '8px', 
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <div className="input-group" style={{ position: 'relative' }}>
                        <Lock size={20} color="#666" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '12px 12px 12px 40px', 
                                borderRadius: '8px', 
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <button 
                        type="submit" 
                        style={{
                            background: '#4f46e5',
                            color: 'white',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Sign In
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666' }}>
                        Default: admin / password123
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
