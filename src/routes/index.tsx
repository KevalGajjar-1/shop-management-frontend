import { createRootRoute, createRoute, createRouter, Navigate, redirect } from '@tanstack/react-router';
import { store } from '@/store';
import RootLayout from '@/components/layout/RootLayout';
import Welcome from '@/pages/Welcome';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import ShopsPage from '@/pages/shops/ShopsPage';
import ProductsPage from '@/pages/products/ProductsPage';
import z from 'zod';

// Helper function to check authentication
const isAuthenticated = () => {
  return store.getState().auth.isAuthenticated;
};

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Navigate to="/welcome" />,
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
});

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/welcome',
  component: Welcome,
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
});

// Auth routes - redirect to dashboard if already authenticated
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: RegisterPage,
});

// Protected routes - redirect to login if not authenticated
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: DashboardPage,
});

const shopsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shops',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: ShopsPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  validateSearch: z.object({
    shopId: z.string().optional(),
  }),
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: ProductsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  welcomeRoute,
  loginRoute,
  registerRoute,
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
