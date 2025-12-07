import { useState } from 'react';
import { ArrowLeft, MapPin, Search, Heart, Clock, ArrowRight } from './ui/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';
import { MapView } from './MapView';

interface ShopInfo {
  id: number;
  name: string;
  branch?: string;
  category: string;
  deliveryTime: string;
  badge: string;
  badgeColor: string;
}

interface ShopsScreenProps {
  onBack: () => void;
  onShopClick?: (shop: ShopInfo) => void;
  onOrderClick?: (shop: ShopInfo) => void;
}

export function ShopsScreen({ onBack, onShopClick, onOrderClick }: ShopsScreenProps) {
  const { t } = useTranslation();
  const { isColorblindMode } = useAccessibility();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { name: 'Food', key: 'food', color: 'bg-pink-100', icon: '🍔' },
    { name: t('shops.categories.pharmacy'), key: 'pharmacy', color: 'bg-red-100', icon: '💊' },
    { name: t('shops.categories.groceries'), key: 'groceries', color: 'bg-green-100', icon: '🛒' },
    { name: t('shops.categories.bakery'), key: 'bakery', color: 'bg-yellow-100', icon: '🥖' },
    { name: 'Café', key: 'cafe', color: 'bg-amber-100', icon: '☕' },
  ];

  const allShops: ShopInfo[] = [
    {
      id: 1,
      name: 'PG Canteen Karachi University',
      category: 'Food',
      deliveryTime: '15–25 min',
      badge: t('shops.badge.fastDelivery'),
      badgeColor: 'bg-[#00D47C]',
    },
    {
      id: 2,
      name: 'Qasim Samosa Shop',
      category: 'Food',
      deliveryTime: '20–30 min',
      badge: t('shops.badge.popular'),
      badgeColor: 'bg-blue-500',
    },
    {
      id: 3,
      name: 'Burger Point',
      category: 'Food',
      deliveryTime: '15–25 min',
      badge: t('shops.badge.fastDelivery'),
      badgeColor: 'bg-[#00D47C]',
    },
    {
      id: 4,
      name: 'Al-Fatah',
      branch: 'Gulshan',
      category: t('shops.categories.groceries'),
      deliveryTime: '15–25 min',
      badge: t('shops.badge.fastDelivery'),
      badgeColor: 'bg-[#00D47C]',
    },
    {
      id: 5,
      name: 'Agha Khan Pharmacy',
      branch: 'Clifton',
      category: t('shops.categories.pharmacy'),
      deliveryTime: '20–30 min',
      badge: t('shops.badge.discount'),
      badgeColor: 'bg-orange-500',
    },
  ];

  const filteredShops = selectedCategory 
    ? allShops.filter(shop => {
        const categoryKey = categories.find(c => c.name === shop.category || shop.category.includes(c.name))?.key;
        return categoryKey === selectedCategory;
      })
    : [];

  const previousOrders = [
    {
      id: 1,
      shopName: 'Al-Fatah',
      items: 'Groceries',
      amount: 'Rs 1,250',
    },
    {
      id: 2,
      shopName: 'Metro',
      items: 'Fresh Items',
      amount: 'Rs 850',
    },
    {
      id: 3,
      shopName: 'Imtiaz',
      items: 'Snacks',
      amount: 'Rs 620',
    },
  ];

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 z-0">
        <MapView showRoute={false} />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={onBack}
          className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Content - White Card Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-3xl shadow-2xl" style={{ height: '70%' }}>
        <div className="h-full overflow-y-auto pt-6 pb-32">
          <div className="px-4">
            {/* Title */}
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Shops</h1>

            {/* Search Bar */}
            <div className="flex items-center gap-2 border-2 border-[#00D47C] rounded-2xl px-4 py-3 mb-6 bg-white">
              <Search className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search any store or market in your city"
                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400"
              />
            </div>

            {/* SELECT CATEGORY Label */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">SELECT CATEGORY</p>
            </div>

            {/* Categories Section - Circular Icons */}
            <div className="mb-6">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category, index) => {
                  const isSelected = selectedCategory === category.key;
                  return (
                    <button 
                      key={index}
                      onClick={() => {
                        setSelectedCategory(isSelected ? null : category.key);
                      }}
                      className={`flex-shrink-0 flex flex-col items-center gap-2 ${category.color} rounded-full w-20 h-20 justify-center relative`}
                    >
                      <span className="text-3xl">{category.icon}</span>
                      <span className={`text-xs text-center ${isSelected ? 'font-bold text-black' : 'text-gray-700'}`}>
                        {category.name}
                      </span>
                      {isSelected && (
                        <>
                          <div className="absolute inset-0 border-2 border-red-500 rounded-full"></div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-black"></div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shop List - Shown when category is selected */}
            {selectedCategory && filteredShops.length > 0 && (
              <div className="space-y-3">
                {filteredShops.map((shop) => (
                  <button
                    key={shop.id}
                    onClick={() => onOrderClick?.(shop)}
                    className="w-full bg-white border-2 border-[#00D47C] rounded-xl p-4 flex items-center gap-4 text-left hover:shadow-md transition-shadow"
                  >
                    <div className="bg-pink-100 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍔</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{shop.name}</h3>
                      <p className="text-sm text-gray-500">{shop.category}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}