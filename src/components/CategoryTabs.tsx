'use client';

import { useState } from 'react';
import { Category } from '@/types';
import { categories } from '@/data/products';

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({ selectedCategory, onCategoryChange }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState(selectedCategory);

  const handleTabClick = (categoryId: string) => {
    setActiveTab(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🛒 Kategori Produk</h2>
        <div className="text-sm text-gray-600">
          {categories.length} kategori tersedia
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleTabClick(category.id)}
            className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 ${
              activeTab === category.id
                ? 'ring-4 ring-green-400 shadow-xl'
                : 'shadow-lg hover:shadow-xl'
            }`}
          >
            <div className={`absolute inset-0 ${category.color} opacity-10`}></div>
            
            <div className="relative z-10 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="text-4xl">{category.icon}</div>
                {activeTab === category.id && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Aktif
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600">
                {category.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${category.color} text-white`}>
                  {category.id === 'asinan' ? '4 Produk' : '20+ Produk'}
                </div>
                <div className="text-xs text-gray-500">
                  Klik untuk lihat
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Kategori aktif: {categories.find(c => c.id === activeTab)?.name}</span>
        </div>
      </div>
    </div>
  );
}
