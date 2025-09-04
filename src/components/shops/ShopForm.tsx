import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';
import { Shop, ShopFormData } from '../../types';

interface ShopFormProps {
  shop?: Shop | null;
  onSubmit: SubmitHandler<ShopFormData>;
  onClose: () => void;
  isLoading: boolean;
}

const ShopForm: React.FC<ShopFormProps> = ({ 
  shop = null, 
  onSubmit, 
  onClose, 
  isLoading 
}) => {
  const isEdit = !!shop;
  const { register, handleSubmit, formState: { errors } } = useForm<ShopFormData>({
    defaultValues: shop ? {
      name: shop.name,
      description: shop.description || '',
      address: shop.address,
      phone: shop.phone
    } : {}
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Shop' : 'Create New Shop'}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="shop-form">
          <div className="form-group">
            <label htmlFor="name">Shop Name *</label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Shop name is required',
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
                maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
              })}
              className={errors.description ? 'error' : ''}
              placeholder="Tell customers about your shop..."
            />
            {errors.description && <span className="error-text">{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <input
              id="address"
              type="text"
              {...register('address', {
                required: 'Address is required'
              })}
              className={errors.address ? 'error' : ''}
              placeholder="Shop address"
            />
            {errors.address && <span className="error-text">{errors.address.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be 10 digits'
                }
              })}
              className={errors.phone ? 'error' : ''}
              placeholder="1234567890"
            />
            {errors.phone && <span className="error-text">{errors.phone.message}</span>}
          </div>

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
              {isLoading ? 'Saving...' : isEdit ? 'Update Shop' : 'Create Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopForm;
