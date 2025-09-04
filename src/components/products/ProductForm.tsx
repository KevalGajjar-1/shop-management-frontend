import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';
import { useGetShopsQuery } from '../../store/api/shopApi';
import { Product, ProductFormData } from '../../types';

interface ProductFormProps {
  product?: Product | null;
  defaultShopId?: string | null;
  onSubmit: SubmitHandler<ProductFormData>;
  onClose: () => void;
  isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  product = null, 
  defaultShopId = null,
  onSubmit, 
  onClose, 
  isLoading 
}) => {
  const isEdit = !!product;
  const { data: shopsResponse } = useGetShopsQuery();
  const shops = shopsResponse?.data || [];

  const shopId = product && typeof product.shop === 'object' 
    ? product.shop._id 
    : typeof product?.shop === 'string' 
    ? product.shop 
    : defaultShopId || '';

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: product ? {
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      shop: shopId
    } : {
      shop: defaultShopId || ''
    }
  });

  const categories = [
    'Electronics',
    'Clothing & Fashion',
    'Food & Beverages',
    'Books & Media',
    'Home & Garden',
    'Sports & Outdoors',
    'Health & Beauty',
    'Toys & Games',
    'Automotive',
    'Jewelry & Accessories',
    'Office Supplies',
    'Pet Supplies'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Product name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 100, message: 'Name cannot exceed 100 characters' }
              })}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={4}
              {...register('description', {
                maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' }
              })}
              className={errors.description ? 'error' : ''}
              placeholder="Product description..."
            />
            {errors.description && <span className="error-text">{errors.description.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' },
                  valueAsNumber: true
                })}
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-text">{errors.price.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                id="stock"
                type="number"
                min="0"
                {...register('stock', {
                  required: 'Stock quantity is required',
                  min: { value: 0, message: 'Stock cannot be negative' },
                  valueAsNumber: true
                })}
                className={errors.stock ? 'error' : ''}
              />
              {errors.stock && <span className="error-text">{errors.stock.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              {...register('category', {
                required: 'Category is required'
              })}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category.message}</span>}
          </div>

          {!defaultShopId && (
            <div className="form-group">
              <label htmlFor="shop">Shop *</label>
              <select
                id="shop"
                {...register('shop', {
                  required: 'Please select a shop'
                })}
                className={errors.shop ? 'error' : ''}
              >
                <option value="">Select a shop</option>
                {shops.map((shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.name}
                  </option>
                ))}
              </select>
              {errors.shop && <span className="error-text">{errors.shop.message}</span>}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
