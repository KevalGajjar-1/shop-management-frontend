import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/api/shopManagementApi';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(100, 'Product name cannot exceed 100 characters'),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Stock must be a non-negative number'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  shopId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, shopId, onSuccess, onCancel }) => {
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  
  const isEditing = !!product;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price?.toString() || '',
      category: product?.category || '',
      stock: product?.stock?.toString() || '0',
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        stock: Number(data.stock),
        shop: shopId,
      };

      if (isEditing) {
        const updateData = { ...productData };
        // delete updateData.shop; // Don't send shop in update
        await updateProduct({ id: product._id, data: updateData }).unwrap();
        
        toast.success('Product updated successfully!');
      } else {
        await createProduct(productData).unwrap();
        toast.success('Product created successfully!');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          {...register('name')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description (optional)"
          {...register('description')}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register('price')}
            className={errors.price ? 'border-destructive' : ''}
          />
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            placeholder="0"
            {...register('stock')}
            className={errors.stock ? 'border-destructive' : ''}
          />
          {errors.stock && (
            <p className="text-sm text-destructive">{errors.stock.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          placeholder="e.g., Electronics, Clothing, Food"
          {...register('category')}
          className={errors.category ? 'border-destructive' : ''}
        />
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEditing ? 'Update Product' : 'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
