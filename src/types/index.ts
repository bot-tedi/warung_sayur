export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: 'asinan' | 'warung';
  subcategory?: string;
  stock?: number;
  unit?: string;
  badge?: string;
  rating?: number;
  reviews?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OrderInfo {
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'transfer' | 'qris';
  paymentProof?: string;
}

export interface DistanceResult {
  distance: {
    text: string;
    value: number;
  };
  duration: {
    text: string;
    value: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  subcategories?: string[];
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  priceRange?: [number, number];
  inStock?: boolean;
  searchTerm?: string;
}
