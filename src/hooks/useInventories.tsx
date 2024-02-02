// src/hooks/useInventories.tsx
import { useState, useEffect } from 'react';
import api from '../utils/API';

interface FilterOptions {
  category_id?: number;
  supplier_id?: number;
  // Add any other filter options as needed
}

interface Inventory {
  id: number;
  _pid: string;
  category_id: number;
  supplier_id: number;
  name: string;
  quantity: number;
  price: string;
  _timestamp: string;
  _status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    image: string;
    description: string;
  };
  supplier: {
    id: number;
    _pid: string;
    user_id: number;
    company_name: string;
    address: string;
    contact_number: string;
    email: string;
    other_details: string;
    type: string;
    is_active: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

interface InventoryResponse {
  data: Inventory[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

const useInventories = (filterOptions?: FilterOptions) => {
  const [inventoriesResponse, setInventoriesResponse] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(true);
  const [fetchedOnce, setFetchedOnce] = useState(false); // Track if API has been called

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const exponentialBackoff = async (attempt: number) => {
    const delay = Math.pow(2, attempt) * 1000;
    await wait(delay);
  };

  const fetchInventories = async (attempt = 0) => {
    setLoading(true);
    try {
      let url = '/inventory/catalog';
      const queryParams = [];

      if (filterOptions?.category_id) {
        queryParams.push(`filter[category_id]=${filterOptions.category_id}`);
      }

      /* if (filterOptions?.supplier_id) {
        queryParams.push(`filter[supplier_id]=${filterOptions.supplier_id}`);
      } */

      Object.entries(filterOptions || {}).forEach(([key, value]) => {
        if (value && key !== 'category_id' && key !== 'supplier_id') {
          queryParams.push(`${key}=${encodeURIComponent(value)}`);
        }
      });

      url += queryParams.length ? `?${queryParams.join('&')}` : '';

      const response = await api.get(url);
      if (response && response.data && mounted) { // Check if the component is still mounted
        setInventoriesResponse(response.data);
        setFetchedOnce(true); // Set fetchedOnce to true after the first successful API call
      } else if (!mounted) {
        // Component unmounted, do nothing
      } else {
        setError('No data received');
      }
    } catch (err) {
      if (err.response && err.response.status === 429 && attempt < 5) {
        await exponentialBackoff(attempt);
        fetchInventories(attempt + 1);
      } else {
        setError('Failed to fetch inventories: ' + err.message);
      }
    } finally {
      if (mounted) { // Check if the component is still mounted
        setLoading(false);
      }
    }
  };

  const refresh = () => {
    if (filterOptions) {
      fetchInventories();
    }
  };

  useEffect(() => {
    setMounted(true); // Component mounted
    return () => setMounted(false); // Component unmounted
  }, []);

  useEffect(() => {
    if (filterOptions && !fetchedOnce) { // Check if filterOptions is truthy and API hasn't been called yet
      fetchInventories();
    }
  }, [filterOptions, mounted, fetchedOnce]);

  return {
    inventories: inventoriesResponse?.data,
    pagination: inventoriesResponse?.meta,
    loading,
    error,
    refresh,
  };
};

export default useInventories;
