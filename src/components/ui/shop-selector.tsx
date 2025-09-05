import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useGetShopsQuery } from '@/store/api/shopsApi';

interface Shop {
  _id: string;
  name: string;
  address: string;
}

interface ShopSelectorProps {
  onSelect: (shopId: string) => void;
  onCancel: () => void;
}

const ShopSelector: React.FC<ShopSelectorProps> = ({ onSelect, onCancel }) => {
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ debouncedSearch ] = useDebounce(searchTerm, 300);

  // ✅ Use API to fetch shops with search and pagination
  const { data, isLoading, error } = useGetShopsQuery({
    search: debouncedSearch || '', // Empty string shows all shops initially
    page: 1,
    limit: 10 // Show 10 shops by default
  });

  const shops: Shop[] = data?.data || [];

  return (
    <div className="space-y-4">
      {/* Search Input */ }
      <div>
        <Input
          value={ searchTerm }
          onChange={ (e) => setSearchTerm(e.target.value) }
          placeholder="Search shops..."
          className="w-full"
        />
      </div>

      {/* Loading State */ }
      { isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">Loading shops...</span>
        </div>
      ) : (
        /* Shops List */
        <div className="max-h-60 overflow-auto border rounded-md">
          { shops.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              { searchTerm ? 'No shops found matching your search' : 'No shops available' }
            </div>
          ) : (
            <ul className="divide-y">
              { shops.map((shop) => (
                <li
                  key={ shop._id }
                  className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={ () => onSelect(shop._id) }
                >
                  <div className="font-medium text-gray-900">{ shop.name }</div>
                  <div className="flex gap-1 items-center mt-1">
                    <MapPin size={ 14 } className="text-gray-400" />
                    <div className="text-sm text-muted-foreground">{ shop.address }</div>
                  </div>
                </li>
              )) }
            </ul>
          ) }
        </div>
      ) }

      {/* Error State */ }
      { error && (
        <div className="p-3 text-center text-sm text-red-600 bg-red-50 rounded-md">
          Failed to load shops. Please try again.
        </div>
      ) }

      {/* Actions */ }
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={ onCancel }>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ShopSelector;
