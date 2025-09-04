import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Package, Store, Tag, Archive } from 'lucide-react';
import { useGetProductByIdQuery } from '../../store/api/productApi';
import ProductForm from './ProductForm';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const { 
    data: response, 
    isLoading, 
    error 
  } = useGetProductByIdQuery(id!);

  const product = response?.data;
  const shopData = product && typeof product.shop === 'object' ? product.shop : null;

  if (isLoading) return <Loading message="Loading product details..." />;
  if (error) return <ErrorMessage message="Failed to load product details" />;

  return (
    <div className="product-details-container">
      <div className="product-details-header">
        <button 
          onClick={() => navigate('/products')}
          className="back-btn"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>
        
        <div className="product-title-section">
          <div className="product-icon-large">
            <Package size={32} />
          </div>
          <div className="product-title-info">
            <h1>{product?.name}</h1>
            {product?.description && <p>{product.description}</p>}
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="btn-secondary"
          >
            <Edit size={20} />
            Edit Product
          </button>
        </div>
      </div>

      <div className="product-info-grid">
        <div className="info-card">
          <div className="info-icon">
            <Tag size={24} />
          </div>
          <div className="info-content">
            <h3>Price</h3>
            <p className="price-large">₹{product?.price}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Archive size={24} />
          </div>
          <div className="info-content">
            <h3>Stock</h3>
            <p className={`stock-large ${product?.stock && product.stock < 10 ? 'low-stock' : ''}`}>
              {product?.stock} units
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Tag size={24} />
          </div>
          <div className="info-content">
            <h3>Category</h3>
            <p>{product?.category}</p>
          </div>
        </div>

        {shopData && (
          <div className="info-card">
            <div className="info-icon">
              <Store size={24} />
            </div>
            <div className="info-content">
              <h3>Shop</h3>
              <p>{shopData.name}</p>
              <small>{shopData.address}</small>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <ProductForm
          product={product}
          onClose={() => setShowForm(false)}
          onSubmit={() => setShowForm(false)}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default ProductDetails;
