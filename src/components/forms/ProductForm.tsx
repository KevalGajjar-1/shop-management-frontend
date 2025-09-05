import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useGetShopsQuery } from '@/store/api/shopsApi';
import { useDebounce } from 'use-debounce';
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
  onLoadingChange?: (loading: boolean) => void; // ✅ Added this prop
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  shopId: propShopId,
  onSuccess,
  onCancel,
  onLoadingChange // ✅ Added this prop
}) => {
  const [ shopId, setShopId ] = useState<string | undefined>(propShopId);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ debouncedSearch ] = useDebounce(searchTerm, 300);
  const [ isLoading, setIsLoading ] = useState(false); // ✅ Local loading state

  const { data: shopsData, isLoading: shopsLoading } = useGetShopsQuery({ search: debouncedSearch });
  const shops = shopsData?.data ?? [];

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
    setIsLoading(true); // ✅ Set loading to true

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
      setIsLoading(false); // ✅ Set loading to false
    }
  };

  // Handle cancel with loading check
  const handleCancel = () => {
    if (!isLoading) {
      onCancel();
    }
  };

  if (!shopId) {
    return (
      <div className="space-y-4">
        <ShopSelector
          shops={ shops }
          loading={ shopsLoading }
          onSelect={ setShopId }
          onSearch={ setSearchTerm }
          onCancel={ handleCancel }
        />
      </div>
    );
  }

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
          disabled={ isLoading } // ✅ Disable during loading
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
          disabled={ isLoading } // ✅ Disable during loading
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
            disabled={ isLoading } // ✅ Disable during loading
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
            disabled={ isLoading } // ✅ Disable during loading
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
    </form>
  );
};

export default ProductForm;
