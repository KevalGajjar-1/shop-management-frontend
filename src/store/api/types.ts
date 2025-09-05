// User types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Shop types
export interface Shop {
  _id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
  totalValue?: number;
  products?: Product[];
}

export interface CreateShopRequest {
  name: string;
  description?: string;
  address: string;
  phone: string;
}

export interface UpdateShopRequest {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
}

// Product types
export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  shop: {
    _id: string;
    name: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  shop: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
}
