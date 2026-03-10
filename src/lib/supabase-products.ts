import { supabase } from './supabase';
import { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category as 'asinan' | 'warung',
      subcategory: product.subcategory || undefined,
      stock: product.stock || undefined,
      unit: product.unit || undefined,
      badge: product.badge || undefined,
      rating: product.rating || undefined,
      reviews: product.reviews || undefined,
      image: product.image_url || undefined,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category as 'asinan' | 'warung',
      subcategory: product.subcategory || undefined,
      stock: product.stock || undefined,
      unit: product.unit || undefined,
      badge: product.badge || undefined,
      rating: product.rating || undefined,
      reviews: product.reviews || undefined,
      image: product.image_url || undefined,
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory,
        stock: product.stock,
        unit: product.unit,
        badge: product.badge,
        rating: product.rating,
        reviews: product.reviews,
        image_url: product.image,
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description || '',
      category: data.category as 'asinan' | 'warung',
      subcategory: data.subcategory || undefined,
      stock: data.stock || undefined,
      unit: data.unit || undefined,
      badge: data.badge || undefined,
      rating: data.rating || undefined,
      reviews: data.reviews || undefined,
      image: data.image_url || undefined,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updates.name,
        description: updates.description,
        price: updates.price,
        category: updates.category,
        subcategory: updates.subcategory,
        stock: updates.stock,
        unit: updates.unit,
        badge: updates.badge,
        rating: updates.rating,
        reviews: updates.reviews,
        image_url: updates.image,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      description: data.description || '',
      category: data.category as 'asinan' | 'warung',
      subcategory: data.subcategory || undefined,
      stock: data.stock || undefined,
      unit: data.unit || undefined,
      badge: data.badge || undefined,
      rating: data.rating || undefined,
      reviews: data.reviews || undefined,
      image: data.image_url || undefined,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || '',
      category: product.category as 'asinan' | 'warung',
      subcategory: product.subcategory || undefined,
      stock: product.stock || undefined,
      unit: product.unit || undefined,
      badge: product.badge || undefined,
      rating: product.rating || undefined,
      reviews: product.reviews || undefined,
      image: product.image_url || undefined,
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}
