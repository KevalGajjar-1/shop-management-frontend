import React, { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Store, MapPin, Phone, Trash2, Edit, Eye, Loader2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetShopsQuery, useDeleteShopMutation } from '@/store/api/shopsApi';
import { useDebounce } from 'use-debounce';
import ShopForm from '@/components/forms/ShopForm';
import { toast } from 'sonner';
import { Shop } from '@/interfaces';

const ShopsPage: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Simple pagination states
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ debouncedSearch ] = useDebounce(searchTerm, 500);
  const itemsPerPage = 20

  // Dialog states
  const [ isCreateModalOpen, setIsCreateModalOpen ] = useState(false);
  const [ editingShop, setEditingShop ] = useState<Shop | null>(null);
  const [ deleteConfirm, setDeleteConfirm ] = useState<Shop | null>(null);
  const [ isFormLoading, setIsFormLoading ] = useState(false);

  const [ deleteShop, { isLoading: isDeleting } ] = useDeleteShopMutation();

  // ✅ Simple query - no complex state management
  const {
    data: shopsResponse,
    isLoading,
    isFetching,
    error,
    refetch
  } = useGetShopsQuery({
    search: debouncedSearch,
    page: currentPage,
    limit: itemsPerPage,
  });

  // ✅ Direct data usage - no accumulation
  const shops = shopsResponse?.data || [];
  const pagination = shopsResponse?.pagination;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;

  const handleDeleteShop = async (shopId: string) => {
    try {
      await deleteShop(shopId).unwrap();
      toast.success('Shop deleted successfully');
      setDeleteConfirm(null);

      // ✅ Simple refetch - no state manipulation needed
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Failed to delete shop');
    }
  };

  const handleViewProducts = (shopId: string) => {
    navigate({ to: '/products', search: { shopId } });
  };

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  // ✅ Simple pagination handlers
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
    const delta = 2; // Show 2 pages before and after current page
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

    return rangeWithDots;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading shops...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load shops</p>
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
          <h1 className="text-3xl font-bold">Shops</h1>
          <p className="text-muted-foreground">Manage your shops</p>
        </div>

        {/* Create/Edit Shop Dialog */ }
        <Dialog
          open={ isCreateModalOpen || !!editingShop }
          onOpenChange={ (open) => {
            if (!isFormLoading) {
              if (open) {
                setIsCreateModalOpen(true);
              } else {
                setIsCreateModalOpen(false);
                setEditingShop(null);
              }
            }
          } }
        >
          <DialogTrigger asChild>
            <Button disabled={ isFormLoading || isDeleting }>
              <Plus className="mr-2" />
              Add Shop
            </Button>
          </DialogTrigger>
          <DialogContent
            onInteractOutside={ (e) => {
              if (isFormLoading) e.preventDefault();
            } }
            onEscapeKeyDown={ (e) => {
              if (isFormLoading) e.preventDefault();
            } }
          >
            <DialogHeader>
              <DialogTitle>{ editingShop ? 'Edit Shop' : 'Create New Shop' }</DialogTitle>
            </DialogHeader>
            { isFormLoading && (
              <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">
                  { editingShop ? 'Updating shop...' : 'Creating shop...' }
                </span>
              </div>
            ) }
            <ShopForm
              shop={ editingShop ?? undefined }
              onSuccess={ () => {
                setIsCreateModalOpen(false);
                setEditingShop(null);
                setIsFormLoading(false);
                refetch(); // ✅ Simple refetch
              } }
              onCancel={ () => {
                if (!isFormLoading) {
                  setIsCreateModalOpen(false);
                  setEditingShop(null);
                }
              } }
              onLoadingChange={ setIsFormLoading }
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Stats */ }
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search shops..."
            value={ searchTerm }
            onChange={ handleSearchChange }
            className="max-w-sm"
            disabled={ isFormLoading || isDeleting }
          />
          { isFetching && (
            <div className="flex items-center space-x-1">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs text-muted-foreground">Searching...</span>
            </div>
          ) }
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            { totalItems } total { totalItems === 1 ? 'shop' : 'shops' }
          </Badge>
          <Badge variant="outline">
            Page { currentPage } of { totalPages }
          </Badge>
        </div>
      </div>

      {/* Shops Grid */ }
      { shops.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent>
            <Store className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No shops found</h3>
            <p className="text-muted-foreground mb-4">
              { searchTerm ? 'Try adjusting your search' : 'Get started by creating your first shop' }
            </p>
            <Button
              onClick={ () => setIsCreateModalOpen(true) }
              disabled={ isFormLoading || isDeleting }
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Shop
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            { shops.map((shop) => (
              <Card key={ shop._id } className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Store className="text-primary h-5 w-5" />
                      <CardTitle className="text-lg">{ shop.name }</CardTitle>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={ isFormLoading || isDeleting }>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={ () => handleViewProducts(shop._id) }>
                          <Eye className="mr-2 h-4 w-4" />
                          View Products
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={ () => {
                          setEditingShop(shop);
                          setIsCreateModalOpen(true);
                        } }>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={ () => setDeleteConfirm(shop) }>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  { shop.description && <CardDescription>{ shop.description }</CardDescription> }
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 mb-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{ shop.address }</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{ shop.phone }</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      Created { new Date(shop.createdAt).toLocaleDateString() }
                    </span>
                    <Button
                      size="sm"
                      onClick={ () => handleViewProducts(shop._id) }
                      disabled={ isFormLoading || isDeleting }
                    >
                      View Products
                    </Button>
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
            if (isDeleting) e.preventDefault();
          } }
          onEscapeKeyDown={ (e) => {
            if (isDeleting) e.preventDefault();
          } }
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Shop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{ deleteConfirm?.name }"? This action cannot be undone.
              <p className="text-red-600 mt-2">⚠️ Deleting this shop will also delete all its products.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          { isDeleting && (
            <div className="flex items-center space-x-2 my-4 p-3 bg-red-50 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin text-red-600" />
              <span className="text-sm text-red-700">Deleting shop...</span>
            </div>
          ) }
          <AlertDialogFooter>
            <AlertDialogCancel disabled={ isDeleting }>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={ () => deleteConfirm && handleDeleteShop(deleteConfirm._id) }
              disabled={ isDeleting }
              className="bg-destructive text-white hover:bg-red-400"
            >
              { isDeleting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              ) }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShopsPage;
