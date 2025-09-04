import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Phone, Package, Edit, Trash2 } from 'lucide-react';
import { useDeleteShopMutation } from '../../store/api/shopApi';
import { Shop } from '../../types';
import toast from 'react-hot-toast';

interface ShopCardProps {
  shop: Shop;
  onEdit: (shop: Shop) => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onEdit }) => {
  const navigate = useNavigate();
  const [deleteShop, { isLoading: isDeleting }] = useDeleteShopMutation();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        await deleteShop(shop._id).unwrap();
        toast.success('Shop deleted successfully');
      } catch (error: any) {
        toast.error(error.data?.message || 'Failed to delete shop');
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/shops/${shop._id}`);
  };

  return (
    <div className="shop-card" onClick={handleCardClick}>
      <div className="shop-card-header">
        <div className="shop-icon">
          <Store size={24} />
        </div>
        <div className="shop-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(shop);
            }}
            className="action-btn edit-btn"
            title="Edit Shop"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="action-btn delete-btn"
            title="Delete Shop"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="shop-info">
        <h3 className="shop-name">{shop.name}</h3>
        {shop.description && (
          <p className="shop-description">{shop.description}</p>
        )}
        
        <div className="shop-details">
          <div className="shop-detail">
            <MapPin size={16} />
            <span>{shop.address}</span>
          </div>
          <div className="shop-detail">
            <Phone size={16} />
            <span>{shop.phone}</span>
          </div>
          {shop.productCount !== undefined && (
            <div className="shop-detail">
              <Package size={16} />
              <span>{shop.productCount} Products</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
