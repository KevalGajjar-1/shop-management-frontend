import React from 'react';
import { Package, Edit, Trash2, Store } from 'lucide-react';
import { useDeleteProductMutation } from '../../store/api/productApi';
import { Product } from '../../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(product._id).unwrap();
        toast.success('Product deleted successfully');
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to delete product');
      }
    }
  };

  const shopData = typeof product.shop === 'string' ? null : product.shop;

  return (
    <div className="product-card">
      <div className="product-card-header">
        <div className="product-icon">
          <Package size={24} />
        </div>
        <div className="product-actions">
          <button
            onClick={() => onEdit && onEdit(product)}
            className="action-btn edit-btn"
            title="Edit Product"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="action-btn delete-btn"
            title="Delete Product"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-details">
          <div className="product-price">
            <span className="price-label">Price:</span>
            <span className="price-value">₹{product.price}</span>
          </div>
          <div className="product-stock">
            <span className="stock-label">Stock:</span>
            <span className={`stock-value ${product.stock < 10 ? 'low-stock' : ''}`}>
              {product.stock}
            </span>
          </div>
          <div className="product-category">
            <span className="category-label">Category:</span>
            <span className="category-value">{product.category}</span>
          </div>
          {shopData && (
            <div className="product-shop">
              <Store size={16} />
              <span>{shopData.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
