import { VALIDATION } from './constants';

export const validateName = (name: string): string[] => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Name is required');
  } else if (name.length < VALIDATION.NAME_MIN) {
    errors.push(`Name must be at least ${VALIDATION.NAME_MIN} characters`);
  } else if (name.length > VALIDATION.NAME_MAX) {
    errors.push(`Name cannot exceed ${VALIDATION.NAME_MAX} characters`);
  }
  
  return errors;
};

export const validateEmail = (email: string): string[] => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  return errors;
};

export const validatePhone = (phone: string): string[] => {
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('Phone number is required');
  } else if (!VALIDATION.PHONE_REGEX.test(phone)) {
    errors.push('Phone number must be 10 digits');
  }
  
  return errors;
};

export const validateShopForm = (data: any): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};
  
  const nameErrors = validateName(data.name);
  if (nameErrors.length > 0) errors.name = nameErrors;
  
  if (!data.address) {
    errors.address = ['Address is required'];
  }
  
  const phoneErrors = validatePhone(data.phone);
  if (phoneErrors.length > 0) errors.phone = phoneErrors;
  
  if (data.description && data.description.length > 500) {
    errors.description = ['Description cannot exceed 500 characters'];
  }
  
  return errors;
};

export const validateProductForm = (data: any): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};
  
  if (!data.name) {
    errors.name = ['Product name is required'];
  } else if (data.name.length < 2) {
    errors.name = ['Product name must be at least 2 characters'];
  } else if (data.name.length > VALIDATION.PRODUCT_NAME_MAX) {
    errors.name = [`Product name cannot exceed ${VALIDATION.PRODUCT_NAME_MAX} characters`];
  }
  
  if (!data.price) {
    errors.price = ['Price is required'];
  } else if (data.price < 0) {
    errors.price = ['Price must be positive'];
  }
  
  if (!data.category) {
    errors.category = ['Category is required'];
  }
  
  if (data.stock === undefined || data.stock === null) {
    errors.stock = ['Stock is required'];
  } else if (data.stock < 0) {
    errors.stock = ['Stock cannot be negative'];
  }
  
  if (!data.shop) {
    errors.shop = ['Shop is required'];
  }
  
  if (data.description && data.description.length > VALIDATION.DESCRIPTION_MAX) {
    errors.description = [`Description cannot exceed ${VALIDATION.DESCRIPTION_MAX} characters`];
  }
  
  return errors;
};
