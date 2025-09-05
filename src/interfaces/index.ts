
// Types
export interface User {
  id: string;
  name: string;
  email: string;
}

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

export interface ShopsResponse {
  success: boolean;
  data: Shop[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ShopsQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}
