import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ShopCard from './ShopCard';
import ShopForm from './ShopForm';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { 
  useGetShopsWithProductsQuery, 
  useCreateShopMutation,
  useUpdateShopMutation 
} from '../../store/api/shopApi';
import { Shop, ShopFormData } from '../../types';
import toast from 'react-hot-toast';

const ShopList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { 
    data: response, 
    isLoading, 
    error,
    refetch 
  } = useGetShopsWithProductsQuery();

  const [createShop, { isLoading: isCreating }] = useCreateShopMutation();
  const [updateShop, { isLoading: isUpdating }] = useUpdateShopMutation();

  const shops = response?.data || [];
  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateShop = async (data: ShopFormData) => {
    try {
      await createShop(data).unwrap();
      toast.success('Shop created successfully!');
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create shop');
    }
  };

  const handleUpdateShop = async (data: ShopFormData) => {
    if (!editingShop) return;
    
    try {
      await updateShop({ id: editingShop._id, ...data }).unwrap();
      toast.success('Shop updated successfully!');
      setEditingShop(null);
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update shop');
    }
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingShop(null);
  };

  if (isLoading) return <Loading message="Loading shops..." />;
  if (error) return <ErrorMessage message={'Failed to load shops'} onRetry={refetch} />;

  return (
    <div className="shop-list-container">
      <div className="shop-list-header">
        <div className="header-left">
          <h1>My Shops</h1>
          <p>Manage your shops and track products</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          Add New Shop
        </button>
      </div>

      <div className="shop-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search shops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredShops.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏪</div>
          <h3>No shops found</h3>
          <p>
            {shops.length === 0 
              ? "You haven't created any shops yet. Create your first shop to get started!"
              : "No shops match your search criteria."
            }
          </p>
          {shops.length === 0 && (
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Your First Shop
            </button>
          )}
        </div>
      ) : (
        <div className="shops-grid">
          {filteredShops.map((shop) => (
            <ShopCard 
              key={shop._id} 
              shop={shop} 
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ShopForm
          shop={editingShop}
          onSubmit={editingShop ? handleUpdateShop : handleCreateShop}
          onClose={closeForm}
          isLoading={isCreating || isUpdating}
        />
      )}
    </div>
  );
};

export default ShopList;
