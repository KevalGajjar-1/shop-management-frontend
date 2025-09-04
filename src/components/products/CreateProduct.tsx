import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from './ProductForm';
import { useCreateProductMutation } from '../../store/api/productApi';
import { ProductFormData } from '../../types';
import toast from 'react-hot-toast';

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      await createProduct(data).unwrap();
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create product');
    }
  };

  const handleClose = () => {
    navigate('/products');
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      onClose={handleClose}
      isLoading={isLoading}
    />
  );
};

export default CreateProduct;
