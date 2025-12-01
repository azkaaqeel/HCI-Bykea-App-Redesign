import { ArrowLeft, MapPin, Search, Heart, Clock } from './ui/icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';

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
}

export function ShopsScreen({ onBack, onShopClick }: ShopsScreenProps) {
  const { t } = useTranslation();
  const { isColorblindMode } = useAccessibility();
  const categories = [
    { name: t('shops.categories.groceries'), key: 'groceries', color: 'bg-green-100', icon: '🛒' },
    { name: t('shops.categories.pharmacy'), key: 'pharmacy', color: 'bg-red-100', icon: '💊' },
    { name: t('shops.categories.electronics'), key: 'electronics', color: 'bg-blue-100', icon: '📱' },
    { name: t('shops.categories.bakery'), key: 'bakery', color: 'bg-yellow-100', icon: '🥖' },
    { name: t('shops.categories.freshBazaar'), key: 'freshBazaar', color: 'bg-orange-100', icon: '🥬' },
  ];

  const popularShops: ShopInfo[] = [
    {
      id: 1,
      name: 'Al-Fatah',
      branch: 'Gulshan',
      category: t('shops.categories.groceries'),
      deliveryTime: '15–25 min',
      badge: t('shops.badge.fastDelivery'),
      badgeColor: 'bg-[#00D47C]',
    },
    {
      id: 2,
      name: 'Agha Khan Pharmacy',
      branch: 'Clifton',
      category: t('shops.categories.pharmacy'),
      deliveryTime: '20–30 min',
      badge: t('shops.badge.discount'),
      badgeColor: 'bg-orange-500',
    },
    {
      id: 3,
      name: 'Metro Cash & Carry',
      branch: 'Korangi',
      category: t('shops.categories.groceries'),
      deliveryTime: '25–35 min',
      badge: t('shops.badge.popular'),
      badgeColor: 'bg-blue-500',
    },
    {
      id: 4,
      name: 'Imtiaz Super Market',
      branch: 'Bahadurabad',
      category: t('shops.categories.groceries'),
      deliveryTime: '20–30 min',
      badge: t('shops.badge.fastDelivery'),
      badgeColor: 'bg-[#00D47C]',
    },
  ];

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
      {/* Top Header with Back */}
      <div className="absolute top-4 left-0 right-0 z-40 flex items-center justify-between px-4 bg-white pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="bg-gray-100 rounded-full p-2 shadow-sm hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-800">جامعہ دارالخیر</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-gray-100 rounded-full p-2">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
            <Clock className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">ابھی</span>
          </button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="h-full overflow-y-auto pt-32 pb-40">
        <div className="px-4">
          {/* Title */}
          <h1 className="mb-4">{t('shops.nearby')}</h1>

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3 mb-6">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder={t('shops.searchPlaceholder')}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400"
            />
            <button className="bg-white rounded-lg p-2 shadow-sm">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category, index) => {
                const getPatternStyle = () => {
                  if (!isColorblindMode) return {};
                  if (category.color.includes('green')) return {};
                  if (category.color.includes('yellow')) {
                    return { backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)' };
                  }
                  if (category.color.includes('orange')) {
                    return { backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)' };
                  }
                  return {};
                };
                return (
                  <button 
                    key={index}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 ${category.color} rounded-2xl px-6 py-4 min-w-[100px] relative`}
                    style={getPatternStyle()}
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-xs text-gray-700">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Shops Section */}
          <div className="mb-6">
            <h2 className="mb-3">{t('shops.popular')}</h2>
            <div className="grid grid-cols-2 gap-3">
              {popularShops.map((shop) => (
                <button 
                  key={shop.id}
                  onClick={() => onShopClick?.(shop)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="bg-gray-100 rounded-xl h-24 mb-3 flex items-center justify-center">
                    <span className="text-3xl">🏪</span>
                  </div>
                  <h3 className="mb-1 text-gray-800">{shop.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{shop.category}</p>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{shop.deliveryTime}</span>
                    </div>
                  </div>
                  <div className={`${shop.badgeColor} text-white rounded-full px-2 py-1 text-xs inline-block relative`}>
                    {isColorblindMode && shop.badgeColor.includes('green') && (
                      <span className="mr-1">✓</span>
                    )}
                    {isColorblindMode && shop.badgeColor.includes('orange') && (
                      <span className="mr-1">%</span>
                    )}
                    {isColorblindMode && shop.badgeColor.includes('blue') && (
                      <span className="mr-1">★</span>
                    )}
                    {shop.badge}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="mb-6 bg-gradient-to-r from-[#00D47C] to-[#00b869] rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-white mb-2">پہلے آرڈر پر 30٪ رعایت! 🎉</h2>
            <p className="text-sm text-white/90 mb-4">چیک آؤٹ پر FIRSTORDER کوڈ استعمال کریں</p>
            <button className="bg-white text-[#00D47C] px-6 py-2 rounded-full">
              ابھی خریدیں
            </button>
          </div>

          {/* Previous Orders Section */}
          <div className="mb-6">
            <h2 className="mb-3">{t('shops.orderAgain')}</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {previousOrders.map((order) => (
                <div 
                  key={order.id}
                  className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 min-w-[160px] shadow-sm"
                >
                  <div className="bg-gray-100 rounded-xl h-20 mb-3 flex items-center justify-center">
                    <span className="text-2xl">🛍️</span>
                  </div>
                  <h3 className="mb-1 text-gray-800">{order.shopName}</h3>
                  <p className="text-xs text-gray-500 mb-2">{order.items}</p>
                  <p className="text-sm text-[#00D47C]">{order.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>

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