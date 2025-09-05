import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Package, TrendingUp, Users, Loader2 } from 'lucide-react';
import { useGetShopsWithProductsQuery } from '@/store/api/shopManagementApi';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: response, isLoading, error } = useGetShopsWithProductsQuery();

  const shops = response?.data || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading your business data...
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load dashboard data. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalShops = shops.length;
  const totalProducts = shops.reduce((acc, shop) => acc + (shop.productCount || 0), 0);
  const totalValue = shops.reduce((acc, shop) => acc + (shop.totalValue || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">Here's what's happening with your business today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shops</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShops}</div>
            <p className="text-xs text-muted-foreground">Active shops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Total products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total inventory worth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active User</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">{user?.name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shops */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Shops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shops.slice(0, 5).map((shop) => (
              <div key={shop._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium leading-none">{shop.name}</p>
                  <p className="text-sm text-muted-foreground">{shop.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{shop.productCount || 0} products</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{(shop.totalValue || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {shops.length === 0 && (
              <p className="text-muted-foreground text-center py-4">No shops created yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
