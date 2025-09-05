import React, { useState, useCallback } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, MoreVertical, Package, IndianRupee, Archive, Edit, Trash2, ArrowLeft, Loader2, Store, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetProductsQuery, useGetProductsByShopQuery, useDeleteProductMutation } from '@/store/api/productsApi';
import { useGetShopQuery } from '@/store/api/shopsApi';
import { Product } from '@/interfaces';
import ProductForm from '@/components/forms/ProductForm';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/products' });
  const shopId = search?.shopId;

  // ✅ Pagination states
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ categoryFilter, setCategoryFilter ] = useState('all');
  const [ debouncedSearch ] = useDebounce(searchTerm, 500);
  const itemsPerPage = 20;

  // Dialog states
  const [ isCreateModalOpen, setIsCreateModalOpen ] = useState<boolean>(false);
  const [ editingProduct, setEditingProduct ] = useState<Product | null>(null);
  const [ deleteConfirm, setDeleteConfirm ] = useState<Product | null>(null);
  const [ isFormLoading, setIsFormLoading ] = useState<boolean>(false);

  const [ deleteProduct, { isLoading: isDeleting } ] = useDeleteProductMutation();

  // ✅ Call hooks unconditionally, use skip to control execution
  const {
    data: allProductsResponse,
    isLoading: allProductsLoading,
    isFetching: allProductsFetching,
    error: allProductsError,
    refetch: refetchAllProducts
  } = useGetProductsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    category: categoryFilter !== 'all' ? categoryFilter : 'all'
  }, {
    skip: !!shopId // Skip when shopId exists
  });

  const {
    data: shopProductsResponse,
    isLoading: shopProductsLoading,
    isFetching: shopProductsFetching,
    error: shopProductsError,
    refetch: refetchShopProducts
  } = useGetProductsByShopQuery({
    shopId: shopId!,
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch,
    category: categoryFilter !== 'all' ? categoryFilter : 'all'
  }, {
    skip: !shopId // Skip when no shopId
  });

  const {
    data: shopResponse,
    isLoading: shopLoading
  } = useGetShopQuery(shopId!, { skip: !shopId });

  // ✅ Select the correct response based on shopId
  const productsResponse = shopId ? shopProductsResponse : allProductsResponse;
  const isLoading = shopId ? shopProductsLoading : allProductsLoading;
  const isFetching = shopId ? shopProductsFetching : allProductsFetching;
  const error = shopId ? shopProductsError : allProductsError;
  const refetch = shopId ? refetchShopProducts : refetchAllProducts;

  // ✅ Direct data usage - no accumulation
  const products = productsResponse?.data || [];
  const shop = shopResponse?.data;
  const pagination = productsResponse?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;

  // ✅ Extract unique categories from current products
  const categories = [ ...new Set(products.map(product => product.category)) ];

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success('Product deleted successfully!');
      setDeleteConfirm(null);

      // ✅ Simple refetch - no state manipulation needed
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1); // Reset to first page on filter
  }, []);

  // ✅ Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // ✅ Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, array) => array.indexOf(item) === index);
  };

  // ✅ Show loading state - considering shop loading only when we need shop data
  if (isLoading || (shopId && shopLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load products</p>
        <Button onClick={ () => refetch() } className="mt-4">
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
                  disabled={ isFormLoading || isDeleting }
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

        {/* Add Product Dialog */ }
        <Dialog
          open={ isCreateModalOpen || !!editingProduct }
          onOpenChange={ (open) => {
            if (!isFormLoading) {
              if (open) {
                setIsCreateModalOpen(true);
              } else {
                setIsCreateModalOpen(false);
                setEditingProduct(null);
              }
            }
          } }
        >
          <DialogTrigger asChild>
            <Button disabled={ isFormLoading || isDeleting }>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-md"
            onInteractOutside={ (e) => {
              if (isFormLoading) {
                e.preventDefault();
              }
            } }
            onEscapeKeyDown={ (e) => {
              if (isFormLoading) {
                e.preventDefault();
              }
            } }
          >
            <DialogHeader>
              <DialogTitle>{ editingProduct ? 'Edit Product' : 'Add New Product' }</DialogTitle>
            </DialogHeader>
            <ProductForm
              product={ editingProduct ?? undefined }
              // ✅ FIXED: Use product's shop ID when editing, current shopId when creating new
              shopId={ editingProduct?.shop?._id || shopId || undefined }
              onSuccess={ () => {
                setIsCreateModalOpen(false);
                setEditingProduct(null);
                setIsFormLoading(false);
                refetch(); // ✅ Simple refetch
              } }
              onCancel={ () => {
                if (!isFormLoading) {
                  setIsCreateModalOpen(false);
                  setEditingProduct(null);
                }
              } }
              onLoadingChange={ setIsFormLoading }
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Shop Info Card */ }
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
              { totalItems } product{ totalItems !== 1 ? 's' : '' }
            </Badge>
          </CardContent>
        </Card>
      ) }

      {/* Filters and Stats */ }
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search products..."
            value={ searchTerm }
            onChange={ handleSearchChange }
            className="max-w-sm"
            disabled={ isFormLoading || isDeleting }
          />

          <Select
            value={ categoryFilter }
            onValueChange={ handleCategoryChange }
            disabled={ isFormLoading || isDeleting }
          >
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

          { isFetching && (
            <div className="flex items-center space-x-1">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
          ) }
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            { products.length } of { totalItems } products
          </Badge>
          <Badge variant="outline">
            Page { currentPage } of { totalPages }
          </Badge>
        </div>
      </div>

      {/* Product Grid */ }
      { products.length === 0 ? (
        <Card className="text-center py-20">
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
              <Button
                onClick={ () => setIsCreateModalOpen(true) }
                disabled={ isFormLoading || isDeleting }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            ) }
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            { products.map((product) => (
              <Card key={ product._id } className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{ product.name }</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">
                          { product.category }
                        </Badge>
                      </div>
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
                        <Button variant="ghost" size="sm" disabled={ isFormLoading || isDeleting }>
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
                      <span className="font-semibold">₹{ product.price.toLocaleString() }</span>
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

          {/* ✅ Pagination Controls */ }
          { totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-8">
              <Button
                variant="outline"
                size="sm"
                onClick={ handlePreviousPage }
                disabled={ currentPage === 1 || isFetching }
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center space-x-1">
                { getPageNumbers().map((page, index) => (
                  <React.Fragment key={ index }>
                    { page === '...' ? (
                      <span className="px-2 py-1 text-sm text-muted-foreground">...</span>
                    ) : (
                      <Button
                        variant={ currentPage === page ? 'default' : 'outline' }
                        size="sm"
                        onClick={ () => handlePageClick(page as number) }
                        disabled={ isFetching }
                        className="min-w-[40px]"
                      >
                        { page }
                      </Button>
                    ) }
                  </React.Fragment>
                )) }
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={ handleNextPage }
                disabled={ currentPage === totalPages || isFetching }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ) }
        </>
      ) }

      {/* Delete Confirmation Dialog */ }
      <AlertDialog
        open={ !!deleteConfirm }
        onOpenChange={ (open) => {
          if (!isDeleting && !open) {
            setDeleteConfirm(null);
          }
        } }
      >
        <AlertDialogContent
          onFocusOutside={ (e) => {
            if (isDeleting) {
              e.preventDefault();
            }
          } }
          onEscapeKeyDown={ (e) => {
            if (isDeleting) {
              e.preventDefault();
            }
          } }
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{ deleteConfirm?.name }"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          { isDeleting && (
            <div className="flex items-center space-x-2 my-4 p-3 bg-red-50 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              <span className="text-sm text-red-700">Deleting product...</span>
            </div>
          ) }
          <AlertDialogFooter>
            <AlertDialogCancel disabled={ isDeleting }>Cancel</AlertDialogCancel>
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
