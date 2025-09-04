import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductForm from './ProductForm';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { 
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation 
} from '../../store/api/productApi';
import { useGetShopsQuery } from '../../store/api/shopApi';
import { Product, ProductFormData } from '../../types';
import toast from 'react-hot-toast';

const ProductList: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    shop: ''
  });

  const { 
    data: productsResponse, 
    isLoading, 
    error,
    refetch 
  } = useGetProductsQuery(filters);

  const { data: shopsResponse } = useGetShopsQuery();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const products = productsResponse?.data || [];
  const shops = shopsResponse?.data || [];

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

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      await createProduct(data).unwrap();
      toast.success('Product created successfully!');
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;
    
    try {
      await updateProduct({ id: editingProduct._id, ...data }).unwrap();
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to update product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) return <Loading message="Loading products..." />;
  if (error) return <ErrorMessage message="Failed to load products" onRetry={refetch} />;

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <div className="header-left">
          <h1>All Products</h1>
          <p>Manage products across all your shops</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          Add New Product
        </button>
      </div>

      <div className="product-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="filter-select"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.shop}
          onChange={(e) => handleFilterChange('shop', e.target.value)}
          className="filter-select"
        >
          <option value="">All Shops</option>
          {shops.map((shop) => (
            <option key={shop._id} value={shop._id}>
              {shop.name}
            </option>
          ))}
        </select>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products found</h3>
          <p>
            {Object.values(filters).some(f => f) 
              ? "No products match your search criteria."
              : "You haven't added any products yet. Add your first product to get started!"
            }
          </p>
          {!Object.values(filters).some(f => f) && (
            <button 
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add Your First Product
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onClose={closeForm}
          isLoading={isCreating || isUpdating}
        />
      )}
    </div>
  );
};

export default ProductList;
