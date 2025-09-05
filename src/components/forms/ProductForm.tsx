import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetShopsQuery } from '@/store/api/shopsApi';
import { useDebounce } from 'use-debounce';
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/api/productsApi';
import { toast } from 'sonner';
import ShopSelector from '@/components/ui/shop-selector'; // Import the new ShopSelector component


const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(100, 'Product name cannot exceed 100 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Stock must be a non-negative number'),
  shopId: z.string().min(1, 'Shop selection is required'),
});


type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  shopId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}


const ProductForm: React.FC<ProductFormProps> = ({ product, shopId: propShopId, onSuccess, onCancel }) => {
  const [shopId, setShopId] = useState<string | undefined>(propShopId);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 300);

  const { data: shopsData, isLoading: shopsLoading } = useGetShopsQuery({ search: debouncedSearch });
  const shops = shopsData?.data ?? [];

  useEffect(() => {
    if (propShopId) {
      setShopId(propShopId);
    }
  }, [propShopId]);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isEditing = Boolean(product);
  const isLoading = isCreating || isUpdating;

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price?.toString() ?? '',
      category: product?.category ?? '',
      stock: product?.stock?.toString() ?? '0',
      shopId: propShopId ?? '',
    }
  });

  useEffect(() => {
    reset({ ...watch(), shopId: shopId ?? '' });
  }, [shopId, reset, watch]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        stock: Number(data.stock),
        shop: data.shopId,
      };

      if (isEditing) {
        const updatePayload = { ...payload };
        await updateProduct({ id: product._id, data: updatePayload }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Product created successfully!');
      }
      onSuccess();
      reset();
      if (!propShopId) setShopId(undefined);
    } catch (error: any) {
      toast.error(error?.data?.message ?? 'Operation failed');
    }
  };


  if (!shopId) {
    return (
      <ShopSelector
        shops={shops}
        loading={shopsLoading}
        onSelect={setShopId}
        onSearch={setSearchTerm}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Product fields */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input id="name" placeholder="Enter product name" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
        {errors.name && <p className="text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter product description (optional)" {...register('description')} className={errors.description ? 'border-destructive' : ''} />
        {errors.description && <p className="text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input id="price" type="number" step="0.01" min="0" placeholder="0.00" {...register('price')} className={errors.price ? 'border-destructive' : ''} />
          {errors.price && <p className="text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input id="stock" type="number" min="0" placeholder="0" {...register('stock')} className={errors.stock ? 'border-destructive' : ''} />
          {errors.stock && <p className="text-destructive">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input id="category" placeholder="e.g., Electronics, Clothing" {...register('category')} className={errors.category ? 'border-destructive' : ''} />
        {errors.category && <p className="text-destructive">{errors.category.message}</p>}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Product' : 'Create Product')}</Button>
      </div>
    </form>
  );
};

export default ProductForm;
