import { ArrowLeft } from './ui/icons';
import { ShopCartItem } from './types';
import { useTranslation } from './i18n';

interface ShopCartScreenProps {
  onBack: () => void;
  onContinueShopping: () => void;
  onProceed: () => void;
  cartItems: ShopCartItem[];
  shopName?: string | null;
  deliveryFee?: number;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
}

export function ShopCartScreen({
  onBack,
  onContinueShopping,
  onProceed,
  cartItems,
  shopName,
  deliveryFee = 50,
  onUpdateQuantity,
  onRemoveItem,
}: ShopCartScreenProps) {
  const { t } = useTranslation();
  const subtotal = cartItems.reduce((sum, item) => sum + item.priceValue * item.quantity, 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-2 pb-1 bg-white shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-base font-medium text-gray-900">{t('shop.cart.title')}</h1>
        <div className="w-5" />
      </div>

      <div className="h-full overflow-y-auto pt-20 pb-32">
        <div className="px-4 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm text-gray-500">{t('shop.cart.orderingFrom')}</p>
            <p className="text-lg font-semibold text-gray-800">{shopName || t('shop.cart.selectedShop')}</p>
            <p className="text-xs text-gray-500 mt-1">{t('shop.cart.standardDelivery')}</p>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-2xl p-4 flex items-center gap-3"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                  🛍️
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.priceLabel}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 text-lg text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium text-gray-800 w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 text-lg text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-2 text-xs text-gray-400 hover:text-red-500"
                    >
                      {t('shop.cart.remove')}
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Rs {(item.priceValue * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={onContinueShopping}
            className="w-full border border-gray-200 rounded-2xl py-3 text-sm text-gray-700 font-medium"
          >
            {t('shop.cart.addMore')}
          </button>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{t('shop.cart.subtotal')}</span>
              <span>Rs {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{t('shop.cart.deliveryFee')}</span>
              <span>Rs {deliveryFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">{t('shop.cart.total')}</span>
              <span className="text-lg font-semibold text-gray-900">
                Rs {total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <button
          onClick={onProceed}
          className="w-full bg-[#00A859] hover:bg-[#009950] text-white rounded-2xl py-4 text-sm font-semibold"
          disabled={cartItems.length === 0}
        >
          {t('shop.cart.confirmPayment')}
        </button>
      </div>

    </div>
  );
}

