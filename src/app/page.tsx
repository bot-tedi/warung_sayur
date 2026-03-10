'use client';

import { useState, useEffect } from 'react';
import type { Product, ProductFilters } from '@/types';
import { products as initialProducts, getProductsByCategory, searchProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import CategoryTabs from '@/components/CategoryTabs';
import ProductFilter from '@/components/ProductFilters';
import CartSummary from '@/components/CartSummary';
import { Settings, ShoppingCart } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    let result = selectedCategory === 'all' 
      ? initialProducts 
      : getProductsByCategory(selectedCategory);

    // Apply subcategory filter
    if (filters.subcategory) {
      result = result.filter(product => product.subcategory === filters.subcategory);
    }

    // Apply search filter
    if (filters.searchTerm) {
      result = searchProducts(filters.searchTerm).filter(product => 
        selectedCategory === 'all' || product.category === selectedCategory
      );
    }

    // Apply price range filter
    if (filters.priceRange) {
      result = result.filter(product => 
        product.price >= filters.priceRange![0] && product.price <= filters.priceRange![1]
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, filters]);

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  const getSubcategories = () => {
    const categoryProducts = selectedCategory === 'all' 
      ? initialProducts 
      : getProductsByCategory(selectedCategory);
    
    const subcategories = Array.from(new Set(categoryProducts
      .map(product => product.subcategory)
      .filter(Boolean)
    ));
    
    return subcategories as string[];
  };

  if (showAdmin) {
    window.location.href = '/admin';
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                🏪 Warung Akang
              </h1>
              <p className="text-green-100 mt-2">Sayuran segar, buah-buahan, ikan, dan asinan khas</p>
            </div>
            <button
              onClick={() => setShowAdmin(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <CategoryTabs 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Product Filters */}
        <ProductFilter 
          filters={filters}
          onFiltersChange={setFilters}
          subcategories={getSubcategories()}
        />

        {/* Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              {filteredProducts.length} Produk Tersedia
            </h2>
            <div className="text-sm text-gray-600">
              {selectedCategory !== 'all' && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  {selectedCategory === 'asinan' ? '🥗 Asinan Sayur' : '🥬 Warung Sayur'}
                </span>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Produk tidak ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* Featured Products */}
        {selectedCategory === 'all' && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              ⭐ Produk Unggulan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts
                .filter(product => product.badge)
                .slice(0, 3)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </section>
        )}
      </main>

      <CartSummary onCheckout={handleCheckout} />
    </div>
  );
}
