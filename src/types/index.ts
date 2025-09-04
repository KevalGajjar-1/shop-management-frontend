// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Shop Types
export interface Shop {
  _id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  owner: string | User;
  productCount?: number;
  totalValue?: number;
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

export interface ShopFormData {
  name: string;
  description?: string;
  address: string;
  phone: string;
}

export interface ShopState {
  shops: Shop[];
  currentShop: Shop | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    page: number;
    limit: number;
  };
}

// Product Types
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  shop: string | Shop;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  shop: string;
}

export interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
    shopId: string;
    page: number;
    limit: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  count?: number;
  pagination?: {
    current: number;
    pages: number;
    total: number;
    limit: number;
  };
}

export interface ApiError {
  data?: {
    message: string;
    errors?: Array<{
      field: string;
      message: string;
    }>;
  };
  status: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
