'use client';

import { useState } from 'react';
import type { ProductFilters } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  subcategories: string[];
}

export default function ProductFilters({ filters, onFiltersChange, subcategories }: ProductFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({ ...filters, searchTerm });
  };

  const handleSubcategoryChange = (subcategory: string) => {
    onFiltersChange({ 
      ...filters, 
      subcategory: filters.subcategory === subcategory ? undefined : subcategory 
    });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const currentRange = filters.priceRange || [0, 100000];
    const newRange: [number, number] = [...currentRange];
    
    if (type === 'min') {
      newRange[0] = parseInt(value) || 0;
    } else {
      newRange[1] = parseInt(value) || 100000;
    }
    
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const clearFilters = () => {
    onFiltersChange({ category: filters.category });
  };

  const hasActiveFilters = filters.subcategory || filters.priceRange || filters.searchTerm;

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {filters.searchTerm && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            hasActiveFilters
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Filter className="w-4 h-4" />
          Filter
          {hasActiveFilters && (
            <span className="bg-white text-green-500 px-2 py-0.5 rounded-full text-xs font-bold">
              {[filters.subcategory, filters.priceRange, filters.searchTerm].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subkategori
              </label>
              <div className="space-y-2">
                {subcategories.map((subcategory) => (
                  <label key={subcategory} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.subcategory === subcategory}
                      onChange={() => handleSubcategoryChange(subcategory)}
                      className="w-4 h-4 text-green-500 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {subcategory}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rentang Harga
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.[0] || ''}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.[1] || ''}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Hapus filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
