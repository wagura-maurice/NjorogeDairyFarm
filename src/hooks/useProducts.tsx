// src/hooks/useProducts.tsx
import { useState, useEffect } from 'react';
import api from '../utils/API';

interface Product {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  price: string;
  description: string | null;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/produce/category');
      if (response && response.data) {
        setProducts(response.data.data); // Adjust this line based on the actual data structure
      } else {
        setError('No data received');
      }
    } catch (err) {
      setError('Failed to fetch products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refresh: fetchProducts };
};

export default useProducts;
