import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ShopsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shops</h1>
        <p className="text-muted-foreground">Manage your shops and track their performance.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Shops</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Shops management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopsPage;
