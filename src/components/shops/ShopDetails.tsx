import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Plus, Store, MapPin, Phone } from 'lucide-react';
import { useGetShopByIdQuery } from '../../store/api/shopApi';
import { useGetProductsByShopQuery } from '../../store/api/productApi';
import ProductCard from '../products/ProductCard';
import ProductForm from '../products/ProductForm';
import ShopForm from './ShopForm';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const ShopDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showShopForm, setShowShopForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  const { 
    data: shopResponse, 
    isLoading: shopLoading, 
    error: shopError 
  } = useGetShopByIdQuery(id!);

  const { 
    data: productsResponse, 
    isLoading: productsLoading 
  } = useGetProductsByShopQuery({ shopId: id! });

  const shop = shopResponse?.data;
  const products = productsResponse?.data || [];

  if (shopLoading) return <Loading message="Loading shop details..." />;
  if (shopError) return <ErrorMessage message="Failed to load shop details" />;

  return (
    <div className="shop-details-container">
      <div className="shop-details-header">
        <button 
          onClick={() => navigate('/shops')}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back to Shops
        </button>
        
        <div className="shop-title-section">
          <div className="shop-icon-large">
            <Store size={32} />
          </div>
          <div className="shop-title-info">
            <h1>{shop?.name}</h1>
            {shop?.description && <p>{shop.description}</p>}
          </div>
          <button 
            onClick={() => setShowShopForm(true)}
            className="btn-secondary"
          >
            <Edit size={20} />
            Edit Shop
          </button>
        </div>
      </div>

      <div className="shop-info-cards">
        <div className="info-card">
          <MapPin size={20} />
          <span>{shop?.address}</span>
        </div>
        <div className="info-card">
          <Phone size={20} />
          <span>{shop?.phone}</span>
        </div>
      </div>

      <div className="shop-products-section">
        <div className="products-header">
          <h2>Products ({products.length})</h2>
          <button 
            onClick={() => setShowProductForm(true)}
            className="btn-primary"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {productsLoading ? (
          <Loading message="Loading products..." />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products yet</h3>
            <p>Add your first product to start selling!</p>
            <button 
              onClick={() => setShowProductForm(true)}
              className="btn-primary"
            >
              Add First Product
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {showShopForm && (
        <ShopForm
          shop={shop}
          onSubmit={() => setShowShopForm(false)}
          onClose={() => setShowShopForm(false)}
          isLoading={false}
        />
      )}

      {showProductForm && (
        <ProductForm
          defaultShopId={id}
          onClose={() => setShowProductForm(false)}
          onSubmit={() => setShowProductForm(false)}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default ShopDetails;
