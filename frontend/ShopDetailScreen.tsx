import { ArrowLeft, Search, Info, ShoppingBag, Plus, ChevronDown, ChevronRight } from './ui/icons';
import { ShopCartItem } from './types';
import { useTranslation } from './i18n';
import { usePageAnnouncement, useVoiceAnnouncements } from './useVoiceAnnouncements';

interface ShopDetailScreenProps {
  onBack: () => void;
  shopName?: string;
  shopBranch?: string;
  cartItems: ShopCartItem[];
  onAddToCart: (item: Omit<ShopCartItem, 'quantity'>) => void;
  onCheckout: () => void;
}

export function ShopDetailScreen({ 
  onBack, 
  shopName = "Chase Up",
  shopBranch = "Johar",
  cartItems,
  onAddToCart,
  onCheckout,
}: ShopDetailScreenProps) {
  const { t } = useTranslation();
  const { announceAction } = useVoiceAnnouncements();
  usePageAnnouncement(t('voice.shopDetail', `Shop: ${shopName}`), [shopName]);
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.priceValue * item.quantity), 0);
  };

  const handleCheckout = () => {
    onCheckout();
  };

  const categories = [
    { name: 'Fruits & Vegetables', icon: '🥬', color: 'bg-green-50' },
    { name: 'Meat & Seafood', icon: '🥩', color: 'bg-red-50' },
    { name: 'Beverages', icon: '🥤', color: 'bg-blue-50' },
    { name: 'Dairy Products', icon: '🥛', color: 'bg-yellow-50' },
    { name: 'Bakery', icon: '🍞', color: 'bg-orange-50' },
    { name: 'Snacks', icon: '🍿', color: 'bg-purple-50' },
  ];

  const saleProducts = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      priceLabel: 'Rs 80/kg',
      priceValue: 80,
      originalPrice: 'Rs 120/kg',
      discount: '33% OFF',
      image: '🍅',
    },
    {
      id: 2,
      name: 'Milk 1L',
      priceLabel: 'Rs 180',
      priceValue: 180,
      originalPrice: 'Rs 220',
      discount: '18% OFF',
      image: '🥛',
    },
    {
      id: 3,
      name: 'Fresh Bread',
      priceLabel: 'Rs 60',
      priceValue: 60,
      originalPrice: 'Rs 80',
      discount: '25% OFF',
      image: '🍞',
    },
    {
      id: 4,
      name: 'Orange Juice',
      priceLabel: 'Rs 150',
      priceValue: 150,
      originalPrice: 'Rs 200',
      discount: '25% OFF',
      image: '🧃',
    },
  ];

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden">
      {/* Header Section */}
      <div className="absolute top-8 left-0 right-0 z-40 bg-white pb-3 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-2 pb-3">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="bg-gray-100 rounded-full p-2"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Shop Info */}
          <div className="flex items-center gap-3 flex-1 mx-3">
            {/* Shop Logo */}
            <div className="bg-[#00A859] rounded-xl w-12 h-12 flex items-center justify-center shadow-sm">
              <span className="text-2xl">🏪</span>
            </div>
            
            {/* Shop Name and Details */}
            <div className="flex-1">
              <h2 className="text-gray-800">{shopName} ({shopBranch})</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-600">Rs 50 {t('shop.deliveryFee')}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-600">Min Rs 250</span>
              </div>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button className="bg-gray-100 rounded-full p-2">
              <Info className="w-5 h-5 text-gray-600" />
            </button>
            <button className="bg-[#00A859] rounded-full p-2 relative">
              <ShoppingBag className="w-5 h-5 text-white" />
              {/* Cart Badge */}
              <span className="absolute -top-1 -right-1 bg-[#FFD600] text-black rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {getTotalItems()}
              </span>
            </button>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between px-4 py-2 bg-green-50 mx-4 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-800">🚴 {t('shop.deliveryTime')} <span className="text-[#00A859]">20–35 min</span></span>
          </div>
          <button className="text-xs text-[#00A859]">Change</button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="h-full overflow-y-auto pt-48 pb-28">
        <div className="px-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-3 mb-6">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder={t('shop.searchPlaceholder')}
              className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400"
            />
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide mb-3">
              {categories.map((category, index) => (
                <button 
                  key={index}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 ${category.color} rounded-2xl px-5 py-4 min-w-[110px] shadow-sm hover:shadow-md transition-shadow`}
                >
                  <span className="text-3xl">{category.icon}</span>
                  <span className="text-xs text-gray-700 text-center leading-tight">{category.name}</span>
                </button>
              ))}
            </div>

            {/* View All Categories Button */}
            <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <span>View all categories</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Sale Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-800">{t('shop.sale')}</h2>
              <button className="text-sm text-[#00A859]">View All</button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {saleProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex-shrink-0 bg-white border border-gray-200 rounded-2xl p-4 min-w-[160px] shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="bg-gray-100 rounded-xl h-32 mb-3 flex items-center justify-center relative">
                    <span className="text-5xl">{product.image}</span>
                    {/* Discount Badge */}
                    <div className="absolute top-2 right-2 bg-[#FFD600] text-black rounded-full px-2 py-1 text-xs">
                      {product.discount}
                    </div>
                  </div>

                  {/* Product Name */}
                  <h3 className="mb-1 text-gray-800 text-sm">{product.name}</h3>

                  {/* Price Section */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00A859]">{product.priceLabel}</span>
                    </div>
                    <span className="text-xs text-gray-400 line-through">{product.originalPrice}</span>
                  </div>

                  {/* Add to Cart Button */}
                  <button 
                    className="w-full bg-[#00A859] hover:bg-[#009950] text-white rounded-xl py-2 flex items-center justify-center gap-1 transition-colors"
                    onClick={() =>
                      onAddToCart({
                        id: product.id,
                        name: product.name,
                        priceLabel: product.priceLabel,
                        priceValue: product.priceValue,
                      })
                    }
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">{t('shop.addToCart')}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Products Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-gray-800">Popular</h2>
              <button className="text-sm text-[#00A859]">View All</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 101, name: 'Fresh Eggs (12 pcs)', priceLabel: 'Rs 220', priceValue: 220, image: '🥚' },
                { id: 102, name: 'Chicken 1kg', priceLabel: 'Rs 380', priceValue: 380, image: '🍗' },
                { id: 103, name: 'Fresh Apples', priceLabel: 'Rs 150/kg', priceValue: 150, image: '🍎' },
                { id: 104, name: 'Cooking Oil 1L', priceLabel: 'Rs 450', priceValue: 450, image: '🛢️' },
              ].map((product) => (
                <div 
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-100 rounded-xl h-28 mb-3 flex items-center justify-center">
                    <span className="text-4xl">{product.image}</span>
                  </div>
                  <h3 className="mb-2 text-gray-800 text-sm">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#00A859]">{product.priceLabel}</span>
                    <button 
                      className="bg-[#00A859] hover:bg-[#009950] text-white rounded-lg p-1.5 transition-colors"
                      onClick={() =>
                        onAddToCart({
                          id: product.id,
                          name: product.name,
                          priceLabel: product.priceLabel,
                          priceValue: product.priceValue,
                        })
                      }
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Summary Popup - Shows when cart has items */}
      {cartItems.length > 0 && (
        <div className="absolute bottom-20 left-0 right-0 z-50 px-4 pb-4">
          <button 
            onClick={handleCheckout}
            className="w-full bg-[#00A859] hover:bg-[#009950] text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center justify-between transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full px-3 py-1">
                <span className="text-white">{getTotalItems()} {getTotalItems() === 1 ? t('shop.item') : t('shop.items')}</span>
              </div>
              <div className="h-6 w-px bg-white/30"></div>
              <span className="text-white">Rs {getTotalAmount()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">{t('shop.checkout')}</span>
              <div className="bg-white/20 rounded-full p-1">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </div>
          </button>
        </div>
      )}

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