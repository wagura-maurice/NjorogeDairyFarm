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
  // ... any other properties as per your actual order object structure
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

interface FilterOptions {
  [key: string]: any; // A flexible object to hold various filter criteria
}

const useOrders = (customerId?: number, filterOptions?: FilterOptions) => {
  const [ordersResponse, setOrdersResponse] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/order/catalog';

      // Array to hold query parameters
      const queryParams = [];

      // Add customer ID to the query parameters if it's provided
      if (customerId) {
        queryParams.push(`filter[customer_id]=${customerId}`);
      }

      // Add other filter options to the query parameters
      if (filterOptions) {
        for (const key in filterOptions) {
          if (filterOptions[key]) {
            queryParams.push(`${key}=${encodeURIComponent(filterOptions[key])}`);
          }
        }
      }

      // Construct the full URL with query parameters
      if (queryParams.length) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await api.get(url);
      if (response && response.data) {
        setOrdersResponse(response.data);
      } else {
        setError('No data received');
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [customerId, JSON.stringify(filterOptions)]); // Depend on both customerId and filterOptions

  return { 
    orders: ordersResponse?.data, 
    pagination: ordersResponse?.meta, 
    loading, 
    error, 
    refresh: fetchOrders 
  };
};

export default useOrders;
