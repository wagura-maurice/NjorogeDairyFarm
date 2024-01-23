// src/hooks/useInventories.tsx
import { useState, useEffect } from 'react';
import api from '../utils/API';

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
    title: string;
    slug: string;
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

interface FilterOptions {
  // Define your filter options here
}

const useInventories = (filterOptions?: FilterOptions) => {
  const [inventoriesResponse, setInventoriesResponse] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to wait for a given number of milliseconds
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Function to perform exponential backoff
  const exponentialBackoff = async (attempt) => {
    const delay = Math.pow(2, attempt) * 1000; // Exponential delay calculation
    await wait(delay);
  };

  const fetchInventories = async (attempt = 0) => {
    setLoading(true);
    try {
      const url = '/api/inventory/catalog?include=category,supplier';

      const response = await api.get(url);
      if (response && response.data) {
        setInventoriesResponse(response.data);
      } else {
        setError('No data received');
      }
    } catch (err) {
      if (err.response && err.response.status === 429 && attempt < 5) {
        // If a 429 error is received, try again with exponential backoff
        await exponentialBackoff(attempt);
        fetchInventories(attempt + 1); // Retry the request with an incremented attempt count
      } else {
        // For other errors or if the maximum number of attempts is reached
        setError('Failed to fetch inventories: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventories(); // Initial fetch without any attempts (default is 0)
  }, []);

  return {
    inventories: inventoriesResponse?.data,
    pagination: inventoriesResponse?.meta,
    loading,
    error,
    refresh: () => fetchInventories(), // Provide a way to manually refresh data
  };
};

export default useInventories;
