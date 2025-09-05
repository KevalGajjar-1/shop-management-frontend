import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Store, MapPin, Phone, Trash2, Edit, Eye, Loader2, MoreVertical } from 'lucide-react';
import { useGetShopsQuery, useDeleteShopMutation } from '@/store/api/shopsApi';
import { useDebounce } from 'use-debounce';
import ShopForm from '@/components/forms/ShopForm';
import { toast } from 'sonner';
import { Shop } from '@/interfaces';

const ShopsPage: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Infinite scroll states
  const [ page, setPage ] = useState(1);
  const [ allShops, setAllShops ] = useState<Shop[]>([]);
  const [ hasMoreShops, setHasMoreShops ] = useState(true);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ debouncedSearch ] = useDebounce(searchTerm, 500);

  // ✅ Intersection Observer hook
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px', // Trigger 100px before reaching the bottom
  });

  // Dialog states
  const [ isCreateModalOpen, setIsCreateModalOpen ] = useState(false);
  const [ editingShop, setEditingShop ] = useState<Shop | null>(null);
  const [ deleteConfirm, setDeleteConfirm ] = useState<Shop | null>(null);
  const [ isFormLoading, setIsFormLoading ] = useState(false);

  const [ deleteShop, { isLoading: isDeleting } ] = useDeleteShopMutation();

  // ✅ Fetch shops with pagination
  const { data: shopsResponse, isLoading, isFetching, error } = useGetShopsQuery({
    search: debouncedSearch,
    page,
    limit: 10,
  });

  // ✅ Handle data loading and pagination
  useEffect(() => {
    if (shopsResponse?.success) {
      const newShops = shopsResponse.data;
      const pagination = shopsResponse.pagination;

      if (page === 1) {
        // Reset shops list for new search or initial load
        setAllShops(newShops);
      } else {
        // Append new shops for infinite scroll
        setAllShops(prevShops => [ ...prevShops, ...newShops ]);
      }

      setHasMoreShops(pagination.hasNextPage);
    }
  }, [ shopsResponse, page ]);

  // ✅ Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
    setAllShops([]);
    setHasMoreShops(true);
  }, [ debouncedSearch ]);

  // ✅ Load more when scrolling reaches bottom
  useEffect(() => {
    if (inView && hasMoreShops && !isFetching && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [ inView, hasMoreShops, isFetching, isLoading ]);

  // ✅ Filter shops on frontend for immediate feedback
  const filteredShops = allShops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteShop = async (shopId: string) => {
    try {
      await deleteShop(shopId).unwrap();
      toast.success('Shop deleted successfully');
      setDeleteConfirm(null);

      // ✅ Remove deleted shop from local state
      setAllShops(prevShops => prevShops.filter(shop => shop._id !== shopId));
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Failed to delete shop');
    }
  };

  const handleViewProducts = (shopId: string) => {
    navigate({ to: '/products', search: { shopId } });
  };

  // ✅ Loading state for initial load
  if (isLoading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading shops...</span>
      </div>
    );
  }

  if (error && page === 1) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load shops</p>
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
          <h1 className="text-3xl font-bold">Shops</h1>
          <p className="text-muted-foreground">Manage your shops</p>
        </div>

        {/* Create/Edit Shop Dialog */ }
        <Dialog
          open={ isCreateModalOpen || !!editingShop }
          onOpenChange={ (open) => {
            if (!isFormLoading) {
              if (open) {
                // ✅ Handle opening the dialog
                setIsCreateModalOpen(true);
              } else {
                // ✅ Handle closing the dialog
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
              <DialogTitle>{ editingShop ? 'Edit Shop' : 'Create New Shop' }</DialogTitle>
            </DialogHeader>
            {/* { isFormLoading && (
              <div className="flex items-center space-x-2 mb-4 p-3 bg-blue-50 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">
                  { editingShop ? 'Updating shop...' : 'Creating shop...' }
                </span>
              </div>
            ) } */}
            <ShopForm
              shop={ editingShop ?? undefined }
              onSuccess={ () => {
                setIsCreateModalOpen(false);
                setEditingShop(null);
                setIsFormLoading(false);
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

      {/* Search */ }
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search shops..."
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) }
          className="max-w-sm"
          disabled={ isFormLoading || isDeleting }
        />
        <Badge>{ filteredShops.length } { filteredShops.length === 1 ? 'shop' : 'shops' }</Badge>
      </div>

      {/* Shops Grid */ }
      { filteredShops.length === 0 && !isLoading && !isFetching ? (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            { filteredShops.map((shop, index) => (
              <Card key={ index } className="hover:shadow-lg transition-shadow">
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

          {/* ✅ Infinite Scroll Loading Trigger */ }
          { hasMoreShops && (
            <div ref={ loadMoreRef } className="flex items-center justify-center py-8">
              { isFetching ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading more shops...</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Scroll for more</div>
              ) }
            </div>
          ) }

          {/* ✅ End of Data Message */ }
          { !hasMoreShops && allShops.length > 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">🎉 You've seen all shops!</p>
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
