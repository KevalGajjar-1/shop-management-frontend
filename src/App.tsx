import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ShopsPage from './pages/ShopsPage';
import ShopDetailsPage from './pages/ShopDetailsPage';
import ProductsPage from './pages/ProductsPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={!isAuthenticated ? <HomePage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shops"
          element={
            <ProtectedRoute>
              <Layout>
                <ShopsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shops/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ShopDetailsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
