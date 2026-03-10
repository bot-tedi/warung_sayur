'use client';

import { useState, useEffect } from 'react';
import { CartItem } from '@/types';
import { cartStorage } from '@/lib/cart';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

interface CartSummaryProps {
  onCheckout?: () => void;
}

export default function CartSummary({ onCheckout }: CartSummaryProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateCart = () => setCart(cartStorage.getCart());
    updateCart();
    
    window.addEventListener('cartUpdated', updateCart);
    return () => window.removeEventListener('cartUpdated', updateCart);
  }, []);

  const updateQuantity = (productId: string, quantity: number) => {
    cartStorage.updateQuantity(productId, quantity);
    setCart(cartStorage.getCart());
  };

  const removeFromCart = (productId: string) => {
    cartStorage.removeFromCart(productId);
    setCart(cartStorage.getCart());
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-semibold">{itemCount} item</span>
        <span className="font-bold">Rp {total.toLocaleString('id-ID')}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
          <h3 className="font-semibold text-lg mb-4">Keranjang Belanja</h3>
          
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Keranjang kosong</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-3 pb-3 border-b">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-gray-600 text-sm">Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center ml-2"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg text-green-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                {onCheckout && (
                  <button
                    onClick={onCheckout}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors"
                  >
                    Lanjut ke Checkout
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
