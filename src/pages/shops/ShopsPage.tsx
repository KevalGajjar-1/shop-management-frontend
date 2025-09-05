import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Store, MapPin, Phone, Trash2, Edit, Eye, Loader2, MoreVertical } from 'lucide-react';
import { useGetShopsQuery, useDeleteShopMutation } from '@/store/api/shopsApi';
import ShopForm from '@/components/forms/ShopForm';
import { toast } from 'sonner';
import { Shop } from '@/interfaces';

const ShopsPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: response, isLoading, error } = useGetShopsQuery({});
  const [ deleteShop, { isLoading: isDeleting } ] = useDeleteShopMutation();

  const [ isCreateModalOpen, setIsCreateModalOpen ] = useState(false);
  const [ editingShop, setEditingShop ] = useState<Shop | null>(null);
  const [ deleteConfirm, setDeleteConfirm ] = useState<Shop | null>(null);
  const [ searchTerm, setSearchTerm ] = useState('');

  const shops: Shop[] = response?.data ?? [];

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteShop = async (shopId: string) => {
    try {
      await deleteShop(shopId).unwrap();
      toast.success('Shop deleted successfully');
      setDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Failed to delete shop');
    }
  };

  const handleViewProducts = (shopId: string) => {
    navigate({ to: '/products', search: { shopId } });
  };

  return (
    <div className="space-y-6">
      { isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading shops...</span>
        </div>
      ) }
      { error && (
        <div className="text-center py-8">
          <p className="text-destructive">Failed to load shops</p>
          <Button onClick={ () => window.location.reload() } className="mt-4">Retry</Button>
        </div>
      ) }
      { !isLoading && !error && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Shops</h1>
              <p className="text-muted-foreground">Manage your shop</p>
            </div>
            <Dialog open={ isCreateModalOpen } onOpenChange={ setIsCreateModalOpen }>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2" />
                  Add Shop
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{ editingShop ? 'Edit Shop' : 'Create New Shop' }</DialogTitle>
                </DialogHeader>
                <ShopForm
                  shop={ editingShop ?? undefined }
                  onSuccess={ () => { setIsCreateModalOpen(false); setEditingShop(null); } }
                  onCancel={ () => { setIsCreateModalOpen(false); setEditingShop(null); } }
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search shops..."
              value={ searchTerm }
              onChange={ e => setSearchTerm(e.target.value) }
              className="max-w-sm"
            />
            <Badge>{ filteredShops.length } { filteredShops.length === 1 ? 'shop' : 'shops' }</Badge>
          </div>

          { filteredShops.length === 0 ? (
            <div className="text-center py-20">
              No shops found.
              <br />
              <Button onClick={ () => setIsCreateModalOpen(true) } className="mt-4">Add your first shop</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              { filteredShops.map(shop => (
                <Card key={ shop._id } className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Store className="text-primary" />
                        <CardTitle>{ shop.name }</CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical />{/* use MoreVert or MoreVertical from lucide-react */ }
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={ () => handleViewProducts(shop._id) }>
                            <Eye className="mr-2" /> View Products
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={ () => { setEditingShop(shop); setIsCreateModalOpen(true); } }>
                            <Edit className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={ () => setDeleteConfirm(shop) }>
                            <Trash2 className="mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    { shop.description && <CardDescription>{ shop.description }</CardDescription> }
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <MapPin /> <span>{ shop.address }</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone /> <span>{ shop.phone }</span>
                    </div>
                    <div className="flex justify-between pt-2 text-sm text-muted-foreground">
                      <span>Created on { new Date(shop.createdAt).toLocaleDateString() }</span>
                    </div>
                  </CardContent>
                </Card>
              )) }
            </div>
          ) }

          {/* Delete Confirmation Dialog */ }
          <AlertDialog open={ !!deleteConfirm } onOpenChange={ () => setDeleteConfirm(null) }>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Shop</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{ deleteConfirm?.name }"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={ () => setDeleteConfirm(null) }>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={ () => deleteConfirm && handleDeleteShop(deleteConfirm._id) }
                  disabled={ isDeleting }
                  className="bg-destructive text-destructive-foreground"
                >
                  { isDeleting ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Deleting...</> : 'Delete' }
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) }
    </div>
  );
};

export default ShopsPage;
