import React from 'react';
import { useNavigate } from 'react-router-dom';
import ShopForm from './ShopForm';
import { useCreateShopMutation } from '../../store/api/shopApi';
import { ShopFormData } from '../../types';
import toast from 'react-hot-toast';

const CreateShop: React.FC = () => {
  const navigate = useNavigate();
  const [createShop, { isLoading }] = useCreateShopMutation();

  const handleSubmit = async (data: ShopFormData) => {
    try {
      const result = await createShop(data).unwrap();
      toast.success('Shop created successfully!');
      navigate(`/shops/${result.data._id}`);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create shop');
    }
  };

  const handleClose = () => {
    navigate('/shops');
  };

  return (
    <ShopForm
      onSubmit={handleSubmit}
      onClose={handleClose}
      isLoading={isLoading}
    />
  );
};

export default CreateShop;
