import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Store, Package, Plus, TrendingUp } from 'lucide-react';
import { useGetShopsWithProductsQuery } from '../store/api/shopApi';
import { RootState } from '../store';
import Loading from '../components/common/Loading';
import '../styles/pages/dashboard.css';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: response, isLoading } = useGetShopsWithProductsQuery();

  const shops = response?.data || [];
  const totalShops = shops.length;
  const totalProducts = shops.reduce((sum, shop) => sum + (shop.productCount || 0), 0);
  const totalValue = shops.reduce((sum, shop) => sum + (shop.totalValue || 0), 0);

  if (isLoading) return <Loading message="Loading dashboard..." />;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your business today.</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon shops">
            <Store size={24} />
          </div>
          <div className="stat-content">
            <h3>{totalShops}</h3>
            <p>Active Shops</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{totalProducts}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon value">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>₹{totalValue.toLocaleString()}</h3>
            <p>Inventory Value</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-cards">
          <Link to="/shops" className="action-card">
            <Plus size={24} />
            <h3>Create New Shop</h3>
            <p>Add a new shop to expand your business</p>
          </Link>

          <Link to="/products" className="action-card">
            <Plus size={24} />
            <h3>Add Products</h3>
            <p>Add new products to your inventory</p>
          </Link>
        </div>
      </div>

      {shops.length > 0 && (
        <div className="dashboard-shops">
          <h2>Your Shops</h2>
          <div className="shops-preview">
            {shops.slice(0, 3).map((shop) => (
              <Link 
                key={shop._id} 
                to={`/shops/${shop._id}`}
                className="shop-preview-card"
              >
                <div className="shop-preview-header">
                  <Store size={20} />
                  <h3>{shop.name}</h3>
                </div>
                <p>{shop.productCount} products</p>
                <p className="shop-value">₹{(shop.totalValue || 0).toLocaleString()}</p>
              </Link>
            ))}
          </div>
          {shops.length > 3 && (
            <Link to="/shops" className="view-all-link">
              View all {shops.length} shops →
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
