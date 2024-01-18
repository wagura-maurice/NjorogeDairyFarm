// src/hooks/useOrders.tsx
import { useState, useEffect } from 'react';
import api from '../utils/API';

interface Order {
  id: number;
  _pid: string;
  order_category_id: number;
  produce_category_id: number;
  customer_id: number;
  driver_id: number | null;
  quantity: number;
  total_amount: string;
  _timestamp: string;
  _status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderResponse {
  data: Order[];
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

const useOrders = (filterOptions?: FilterOptions) => {
  const [ordersResponse, setOrdersResponse] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to wait for a given number of milliseconds
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Function to perform exponential backoff
  const exponentialBackoff = async (attempt) => {
    const delay = Math.pow(2, attempt) * 1000; // Exponential delay calculation
    await wait(delay);
  };

  const fetchOrders = async (attempt = 0) => {
    setLoading(true);
    try {
      let url = '/order/catalog';
      const queryParams = [];

      // Handle customer_id and driver_id in the filterOptions
      if (filterOptions?.customer_id) {
        queryParams.push(`filter[customer_id]=${filterOptions.customer_id}`);
      }

      if (filterOptions?.driver_id) {
        queryParams.push(`filter[driver_id]=${filterOptions.driver_id}`);
      }

      // Handle other filters
      Object.entries(filterOptions || {}).forEach(([key, value]) => {
        if (value && key !== 'customer_id' && key !== 'driver_id') {
          queryParams.push(`${key}=${encodeURIComponent(value)}`);
        }
      });

      url += queryParams.length ? `?${queryParams.join('&')}` : '';

      const response = await api.get(url);
      if (response && response.data) {
        setOrdersResponse(response.data);
      } else {
        setError('No data received');
      }
    } catch (err) {
      if (err.response && err.response.status === 429 && attempt < 5) {
        // If a 429 error is received, try again with exponential backoff
        await exponentialBackoff(attempt);
        fetchOrders(attempt + 1); // Retry the request with an incremented attempt count
      } else {
        // For other errors or if the maximum number of attempts is reached
        setError('Failed to fetch orders: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(); // Initial fetch without any attempts (default is 0)
  }, [JSON.stringify(filterOptions)]);

  return {
    orders: ordersResponse?.data,
    pagination: ordersResponse?.meta,
    loading,
    error,
    refresh: () => fetchOrders(), // Provide a way to manually refresh data
  };
};

export default useOrders;
