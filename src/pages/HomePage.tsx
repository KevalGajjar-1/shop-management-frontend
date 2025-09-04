import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Store, Package, BarChart3 } from 'lucide-react';
import '../styles/pages/home.css';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const HomePage: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <Store size={48} />,
      title: 'Manage Shops',
      description: 'Create and manage multiple shops with ease'
    },
    {
      icon: <Package size={48} />,
      title: 'Product Catalog',
      description: 'Add and organize products in your shops'
    },
    {
      icon: <BarChart3 size={48} />,
      title: 'Track Inventory',
      description: 'Monitor stock levels and product performance'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-icon">
            <ShoppingBag size={64} />
          </div>
          <h1>Shop Management System</h1>
          <p>Streamline your business operations with our comprehensive shop and inventory management solution</p>
          
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Everything you need to manage your business</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
