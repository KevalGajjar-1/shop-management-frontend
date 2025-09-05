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
  const isEditing = Boolean(product);
  const [ isLoading, setIsLoading ] = useState(false);

  // ✅ Smart shopId management
  const [ shopId, setShopId ] = useState<string | undefined>(() => {
    // Priority: 1. Product's shop (when editing), 2. Provided shopId, 3. undefined
    if (isEditing && product?.shop) {
      return typeof product.shop === 'string' ? product.shop : product.shop._id;
    }
    return propShopId;
  });

  // ✅ Notify parent about loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [ isLoading, onLoadingChange ]);

  const [ createProduct ] = useCreateProductMutation();
  const [ updateProduct ] = useUpdateProductMutation();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price?.toString() ?? '',
      category: product?.category ?? '',
      stock: product?.stock?.toString() ?? '0',
      shopId: shopId ?? '',
    }
  });

  // ✅ Update form when shopId changes
  useEffect(() => {
    if (shopId) {
      setValue('shopId', shopId, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }
  }, [ shopId, setValue ]);

  // ✅ Update shopId when propShopId changes (but only if not editing)
  useEffect(() => {
    if (!isEditing && propShopId && propShopId !== shopId) {
      setShopId(propShopId);
    }
  }, [ propShopId, isEditing, shopId ]);

  const onSubmit = async (data: ProductFormData) => {
    if (!shopId) {
      toast.error('Please select a shop');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        stock: Number(data.stock),
        shop: shopId, // ✅ Use local shopId state
      };

      if (isEditing) {
        await updateProduct({ id: product._id, data: payload }).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Product created successfully!');
      }

      onSuccess();
      reset();

      // ✅ Only reset shopId if it wasn't provided as prop (for new products)
      if (!propShopId && !isEditing) {
        setShopId(undefined);
      }
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

  const handleChangeShop = () => {
    if (!isEditing && !isLoading) {
      setShopId(undefined);
    }
  };

  // ✅ Show ShopSelector if no shop is selected (only for new products)
  if (!shopId && !isEditing) {
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

  // ✅ Show Product Form once shop is selected or when editing
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

      {/* ✅ Hidden shopId field for form validation */ }
      <input type="hidden" { ...register('shopId') } value={ shopId || '' } />

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

      {/* ✅ Show shop info and change option */ }
      { shopId && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Selected Shop</Label>
              <p className="text-sm text-muted-foreground">
                { isEditing ? 'Product shop (cannot be changed)' : 'Shop for this product' }
              </p>
            </div>
            { !isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={ handleChangeShop }
                disabled={ isLoading }
              >
                Change Shop
              </Button>
            ) }
          </div>
        </div>
      ) }

      <div className="flex justify-end space-x-2 pt-4">
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
          disabled={ isLoading || !shopId }
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
    </form>
  );
};

export default ProductForm;
