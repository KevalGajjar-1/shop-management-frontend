import React, { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, MoreVertical, Package, IndianRupee, Archive, Edit, Trash2, ArrowLeft, Loader2, Store } from 'lucide-react';
import { useGetProductsQuery, useGetProductsByShopQuery, useDeleteProductMutation } from '@/store/api/productsApi';
import { useGetShopQuery } from '@/store/api/shopsApi';
import { Product } from '@/interfaces';
import ProductForm from '@/components/forms/ProductForm';
import { toast } from 'sonner';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/products' });
  const shopId = search?.shopId;

  const {
    data: allProductsResponse,
    isLoading: allProductsLoading,
    error: allProductsError,
  } = useGetProductsQuery(undefined, { skip: !!shopId });

  const {
    data: shopProductsResponse,
    isLoading: shopProductsLoading,
    error: shopProductsError,
  } = useGetProductsByShopQuery({ shopId: shopId! }, { skip: !shopId });

  const {
    data: shopResponse,
    isLoading: shopLoading
  } = useGetShopQuery(shopId!, { skip: !shopId });

  const [ deleteProduct, { isLoading: isDeleting } ] = useDeleteProductMutation();

  const [ isCreateModalOpen, setIsCreateModalOpen ] = useState<boolean>(false);
  const [ editingProduct, setEditingProduct ] = useState<Product | null>(null);
  const [ deleteConfirm, setDeleteConfirm ] = useState<Product | null>(null);
  const [ searchTerm, setSearchTerm ] = useState<string>('');
  const [ categoryFilter, setCategoryFilter ] = useState<string>('all');

  const productsResponse = shopId ? shopProductsResponse : allProductsResponse;
  const productsLoading = shopId ? shopProductsLoading : allProductsLoading;
  const productsError = shopId ? shopProductsError : allProductsError;

  const products = productsResponse?.data || [];
  const shop = shopResponse?.data;

  const categories = [ ...new Set(products.map(product => product.category)) ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success('Product deleted successfully!');
      setDeleteConfirm(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  };

  if (productsLoading || shopLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load products. Please try again.</p>
        <Button onClick={ () => window.location.reload() } className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */ }
      <div className="flex items-center justify-between">
        <div>
          { shopId ? (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={ () => navigate({ to: '/shops' }) }
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Shops
                </Button>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Products</h1>
              <p className="text-muted-foreground">
                Managing products for <span className="font-medium">{ shop?.name }</span>
              </p>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
              <p className="text-muted-foreground">
                View and manage products from all your shops
              </p>
            </div>
          ) }
        </div>

        <Dialog open={ isCreateModalOpen } onOpenChange={ setIsCreateModalOpen }>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              shopId={ shopId || '' }
              onSuccess={ () => setIsCreateModalOpen(false) }
              onCancel={ () => setIsCreateModalOpen(false) }
              
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Shop Info Card (only when viewing specific shop) */ }
      { shopId && shop && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{ shop.name }</h3>
                <p className="text-sm text-muted-foreground">{ shop.address }</p>
              </div>
            </div>
            <Badge variant="secondary">
              { products.length } product{ products.length !== 1 ? 's' : '' }
            </Badge>
          </CardContent>
        </Card>
      ) }

      {/* Filters */ }
      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search products..."
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) }
          className="max-w-sm"
        />

        <Select value={ categoryFilter } onValueChange={ setCategoryFilter }>
          <SelectTrigger className="max-w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            { categories.map(category => (
              <SelectItem key={ category } value={ category }>
                { category }
              </SelectItem>
            )) }
          </SelectContent>
        </Select>

        <Badge variant="secondary">
          { filteredProducts.length } product{ filteredProducts.length !== 1 ? 's' : '' }
        </Badge>
      </div>

      {/* Product Grid */ }
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        { filteredProducts.map((product) => (
          <Card key={ product._id } className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{ product.name }</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    Category:
                    <Badge variant="outline">
                      { product.category }
                    </Badge>
                  </div>
                  {/* Show shop name when viewing all products */ }
                  { !shopId && product.shop && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Store className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        { product.shop.name }
                      </span>
                    </div>
                  ) }
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={ () => setEditingProduct(product) }>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Product
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={ () => setDeleteConfirm(product) }
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              { product.description && (
                <CardDescription className="line-clamp-2 mt-2">
                  { product.description }
                </CardDescription>
              ) }
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{ product.price.toLocaleString() }</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Archive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    { product.stock } in stock
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Added { new Date(product.createdAt).toLocaleDateString() }
                </span>
              </div>
            </CardContent>
          </Card>
        )) }
      </div>

      {/* Empty State */ }
      { filteredProducts.length === 0 && !productsLoading && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              { searchTerm || categoryFilter !== 'all' ? 'No products found' : 'No products yet' }
            </h3>
            <p className="text-muted-foreground mb-4">
              { searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : shopId
                  ? `Start by adding products to ${shop?.name}`
                  : 'Start by adding products to your shops'
              }
            </p>
            { !searchTerm && categoryFilter === 'all' && (
              <Button onClick={ () => setIsCreateModalOpen(true) }>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            ) }
          </CardContent>
        </Card>
      ) }

      {/* Edit Product Modal */ }
      <Dialog open={ !!editingProduct } onOpenChange={ () => setEditingProduct(null) }>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          { editingProduct && (
            <ProductForm
              product={ editingProduct }
              shopId={ shopId || editingProduct.shop?._id || '' }
              onSuccess={ () => setEditingProduct(null) }
              onCancel={ () => setEditingProduct(null) }
            />
          ) }
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */ }
      <AlertDialog open={ !!deleteConfirm } onOpenChange={ () => setDeleteConfirm(null) }>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{ deleteConfirm?.name }"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={ () => deleteConfirm && handleDeleteProduct(deleteConfirm._id) }
              disabled={ isDeleting }
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              { isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Product'
              ) }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductsPage;
