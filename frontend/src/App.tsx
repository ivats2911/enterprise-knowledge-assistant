import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import GymView from './pages/GymView';
import FloatingChatbot from './components/FloatingChatbot';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" />;
    return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } />
            <Route path="/gyms/:id" element={
                <ProtectedRoute>
                    <GymView />
                </ProtectedRoute>
            } />
          </Routes>
          <FloatingChatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
