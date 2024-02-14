// src/hooks/useInventories.tsx
import { useCallback, useState, useEffect } from 'react';
import api from '../utils/API';

interface FilterOptions {
  'filter[_timestamp][end]'?: string;
  'filter[_timestamp][start]'?: string;
  'filter[supplier_id]'?: number;
  'filter[_status]'?: number;
  'include'?: string;
  'page[number]'?: number;
}

interface InventoryItem {
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

interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  path: string;
  per_page: number;
  to: number | null;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

interface InventoryResponse {
  data: InventoryItem[];
  meta: PaginationMeta;
}