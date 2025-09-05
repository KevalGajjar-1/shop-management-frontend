import { createRootRoute, createRoute, createRouter, Navigate } from '@tanstack/react-router';
import RootLayout from '@/components/layout/RootLayout';
import Welcome from '@/pages/Welcome';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ShopsPage from '@/pages/shops/ShopsPage';
import ProductsPage from '@/pages/products/ProductsPage';
import ProtectedRoute from '@/components/guards/ProtectedRoute';

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/welcome" />,
});

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/welcome',
  component: Welcome,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const shopsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shops',
  component: () => (
    <ProtectedRoute>
      <ShopsPage />
    </ProtectedRoute>
  ),
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: () => (
    <ProtectedRoute>
      <ProductsPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  welcomeRoute,
  loginRoute,
  dashboardRoute,
  shopsRoute,
  productsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
