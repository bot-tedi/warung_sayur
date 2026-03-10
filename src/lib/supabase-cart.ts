import { supabase } from './supabase';
import { CartItem, Product } from '@/types';

// Generate or get session ID for guest users
function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  let sessionId = sessionStorage.getItem('warung_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('warung_session_id', sessionId);
  }
  return sessionId;
}

export async function getCartItems(): Promise<CartItem[]> {
  try {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from('cart')
      .select(`
        *,
        product:products (*)
      `)
      .eq('session_id', sessionId);

    if (error) throw error;

    return data.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      description: item.product.description || '',
      category: item.product.category as 'asinan' | 'warung',
      subcategory: item.product.subcategory || undefined,
      stock: item.product.stock || undefined,
      unit: item.product.unit || undefined,
      badge: item.product.badge || undefined,
      rating: item.product.rating || undefined,
      reviews: item.product.reviews || undefined,
      image: item.product.image_url || undefined,
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

export async function addToCart(product: Product, quantity: number = 1): Promise<boolean> {
  try {
    const sessionId = getSessionId();
    
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', product.id)
      .single();

    if (existingItem) {
      // Update quantity if item exists
      const { error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      // Insert new item
      const { error } = await supabase
        .from('cart')
        .insert({
          session_id: sessionId,
          product_id: product.id,
          quantity: quantity,
        });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return false;
  }
}

export async function updateCartItemQuantity(productId: string, quantity: number): Promise<boolean> {
  try {
    const sessionId = getSessionId();
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      const { error } = await supabase
        .from('cart')
        .delete()
        .eq('session_id', sessionId)
        .eq('product_id', productId);

      if (error) throw error;
    } else {
      // Update quantity
      const { error } = await supabase
        .from('cart')
        .update({ quantity })
        .eq('session_id', sessionId)
        .eq('product_id', productId);

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return false;
  }
}

export async function removeFromCart(productId: string): Promise<boolean> {
  try {
    const sessionId = getSessionId();
    
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('session_id', sessionId)
      .eq('product_id', productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
}

export async function clearCart(): Promise<boolean> {
  try {
    const sessionId = getSessionId();
    
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('session_id', sessionId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
}

export async function getCartTotal(): Promise<number> {
  try {
    const sessionId = getSessionId();
    const { data, error } = await supabase
      .from('cart')
      .select(`
        quantity,
        product:products (price)
      `)
      .eq('session_id', sessionId);

    if (error) throw error;

    return data.reduce((total, item) => {
      const product = item.product as unknown as { price: number };
      return total + (product.price * item.quantity);
    }, 0);
  } catch (error) {
    console.error('Error calculating cart total:', error);
    return 0;
  }
}
