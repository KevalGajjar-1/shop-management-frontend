import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useCreateProductMutation, useUpdateProductMutation } from '@/store/api/productsApi';
import { toast } from 'sonner';
import ShopSelector from '@/components/ui/shop-selector';

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
  onLoadingChange?: (loading: boolean) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  shopId: propShopId,
  onSuccess,
  onCancel,
  onLoadingChange
}) => {
  const [ shopId, setShopId ] = useState<string | undefined>(propShopId);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    if (propShopId) {
      setShopId(propShopId);
    }
  }, [ propShopId ]);

  // ✅ Notify parent about loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [ isLoading, onLoadingChange ]);

  const [ createProduct ] = useCreateProductMutation();
  const [ updateProduct ] = useUpdateProductMutation();

  const isEditing = Boolean(product);

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
  }, [ shopId, reset, watch ]);

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  // ✅ Show ShopSelector if no shop is selected
  if (!shopId) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">Select a Shop</h3>
          <p className="text-sm text-muted-foreground">Choose which shop this product belongs to</p>
        </div>

        <ShopSelector
          onSelect={ setShopId }
          onCancel={ handleCancel }
        />
      </div>
    );
  }

  // ✅ Show Product Form once shop is selected
  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="space-y-4">
      {/* Loading indicator */ }
      { isLoading && (
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-700">
            { isEditing ? 'Updating product...' : 'Creating product...' }
          </span>
        </div>
      ) }

      {/* Product fields */ }
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          { ...register('name') }
          className={ errors.name ? 'border-destructive' : '' }
          disabled={ isLoading }
        />
        { errors.name && <p className="text-sm text-destructive">{ errors.name.message }</p> }
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description (optional)"
          { ...register('description') }
          className={ errors.description ? 'border-destructive' : '' }
          disabled={ isLoading }
        />
        { errors.description && <p className="text-sm text-destructive">{ errors.description.message }</p> }
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
            { ...register('price') }
            className={ errors.price ? 'border-destructive' : '' }
            disabled={ isLoading }
          />
          { errors.price && <p className="text-sm text-destructive">{ errors.price.message }</p> }
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            placeholder="0"
            { ...register('stock') }
            className={ errors.stock ? 'border-destructive' : '' }
            disabled={ isLoading }
          />
          { errors.stock && <p className="text-sm text-destructive">{ errors.stock.message }</p> }
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          placeholder="e.g., Electronics, Clothing"
          { ...register('category') }
          className={ errors.category ? 'border-destructive' : '' }
          disabled={ isLoading }
        />
        { errors.category && <p className="text-sm text-destructive">{ errors.category.message }</p> }
      </div>

      <div className="flex justify-between items-center pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={ () => setShopId(undefined) }
          disabled={ isLoading }
        >
          ← Change Shop
        </Button>

        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={ handleCancel }
            disabled={ isLoading }
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={ isLoading }
          >
            { isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                { isEditing ? 'Updating...' : 'Creating...' }
              </>
            ) : (
              isEditing ? 'Update Product' : 'Create Product'
            ) }
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
