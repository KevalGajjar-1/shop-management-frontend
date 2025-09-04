export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SHOPS: '/shops',
  SHOP_DETAILS: '/shops/:id',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id'
} as const;

export const PRODUCT_CATEGORIES = [
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
] as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;

export const VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  SHOP_NAME_MAX: 100,
  PRODUCT_NAME_MAX: 100,
  DESCRIPTION_MAX: 1000,
  PHONE_REGEX: /^[0-9]{10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
} as const;
