import { CartItem, Product } from '@/types';

export const cartStorage = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const cart = localStorage.getItem('warung-cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToCart: (product: Product, quantity: number = 1): void => {
    if (typeof window === 'undefined') return;
    
    const cart = cartStorage.getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('warung-cart', JSON.stringify(cart));
  },

  removeFromCart: (productId: string): void => {
    if (typeof window === 'undefined') return;
    
    const cart = cartStorage.getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    localStorage.setItem('warung-cart', JSON.stringify(updatedCart));
  },

  updateQuantity: (productId: string, quantity: number): void => {
    if (typeof window === 'undefined') return;
    
    const cart = cartStorage.getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        cartStorage.removeFromCart(productId);
      } else {
        localStorage.setItem('warung-cart', JSON.stringify(cart));
      }
    }
  },

  clearCart: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('warung-cart');
  },

  getCartTotal: (): number => {
    const cart = cartStorage.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};
