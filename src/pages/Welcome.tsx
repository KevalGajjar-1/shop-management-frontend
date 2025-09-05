import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Store, Package, BarChart3, ArrowRight, UserPlus } from 'lucide-react';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Store className="h-12 w-12 text-primary" />,
      title: 'Manage Shops',
      description: 'Create and manage multiple shops with ease'
    },
    {
      icon: <Package className="h-12 w-12 text-primary" />,
      title: 'Product Catalog',
      description: 'Add and organize products in your shops'
    },
    {
      icon: <BarChart3 className="h-12 w-12 text-primary" />,
      title: 'Track Analytics',
      description: 'Monitor performance and sales'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="w-full px-4 py-24 text-center">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Store className="h-16 w-16 text-primary" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Shop Management System
            </h1>
            <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
              Streamline your business operations with our comprehensive shop and inventory management solution
            </p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="text-base">
              <Button onClick={() => navigate({to:'/register'})}>
                <UserPlus className="mr-2 h-4 w-4" />
                Get Started Free
              </Button>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to="/login">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your business
            </h2>
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
