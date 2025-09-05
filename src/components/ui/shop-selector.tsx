import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface Shop {
  _id: string;
  name: string;
  address: string;
}

interface ShopSelectorProps {
  shops: Shop[];
  onSelect: (shopId: string) => void;
  loading: boolean;
  onSearch: (search: string) => void;
}

const ShopSelector: React.FC<ShopSelectorProps> = ({ shops, loading, onSelect, onSearch }) => {
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ debouncedSearch ] = useDebounce(searchTerm, 300);

  // Call onSearch when debouncedSearch changes
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [ debouncedSearch, onSearch ]);

  return (
    <div>
      <Input
        value={ searchTerm }
        onChange={ (e) => setSearchTerm(e.target.value) }
        placeholder="Search shops..."
      />
      { loading ? (
        <div className="py-4 text-center">Loading...</div>
      ) : (
        <ul className="mt-2 max-h-60 overflow-auto border rounded-md divide-y">
          { shops.length === 0 ? (
            <li className="p-4 text-center text-sm text-muted-foreground">
              No shops found
            </li>
          ) : (
            shops.map((shop) => (
              <li
                key={ shop._id }
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={ () => onSelect(shop._id) }
              >
                <div className="font-medium">{ shop.name }</div>
                <div className='flex gap-1 items-center self-center'>
                  <MapPin size={ 14 } />
                  <div className="text-sm text-muted-foreground">{ shop.address }</div>
                </div>
              </li>
            ))
          ) }
        </ul>
      ) }
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={ () => onSelect('') }>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ShopSelector;
