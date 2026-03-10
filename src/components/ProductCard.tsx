'use client';

import { Product } from '@/types';
import { cartStorage } from '@/lib/cart';
import { ShoppingCart, Plus, Star, Package, Badge } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = () => {
    cartStorage.addToCart(product);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const getStockStatus = () => {
    if (!product.stock) return { color: 'text-gray-500', text: 'Stok tersedia' };
    if (product.stock <= 10) return { color: 'text-red-500', text: `Sisa ${product.stock}` };
    return { color: 'text-green-500', text: 'Tersedia' };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="text-gray-400">
              <ShoppingCart className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Badge className="w-3 h-3" />
              {product.badge}
            </span>
          )}
          {product.stock && product.stock <= 10 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Terbatas
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.category === 'asinan' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {product.category === 'asinan' ? '🥗 Asinan' : '🥬 Warung'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating!) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {product.rating} ({product.reviews} ulasan)
            </span>
          </div>
        )}

        {/* Stock & Unit */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-400" />
            <span className={`text-xs font-medium ${stockStatus.color}`}>
              {stockStatus.text}
            </span>
            {product.unit && (
              <span className="text-xs text-gray-500">
                / {product.unit}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-green-600">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.unit && (
              <span className="text-xs text-gray-500 ml-1">
                /{product.unit}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
            disabled={product.stock === 0}
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>
      </div>
    </div>
  );
}
