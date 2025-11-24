import { ArrowLeft, MapPin, Info } from './ui/icons';
import { useTranslation } from './i18n';

interface ShopCheckoutScreenProps {
  onBack: () => void;
  onPlaceOrder: () => void;
  shopName?: string | null;
  total: number;
  deliveryAddress: string;
  selectedTip: number;
  onTipChange: (value: number) => void;
}

const tipOptions = [0, 50, 100];

export function ShopCheckoutScreen({
  onBack,
  onPlaceOrder,
  shopName,
  total,
  deliveryAddress,
  selectedTip,
  onTipChange,
}: ShopCheckoutScreenProps) {
  const { t } = useTranslation();
  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-2 pb-1 bg-white shadow-sm">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-base font-medium text-gray-900">{t('shop.checkout.title')}</h1>
        <div className="w-5" />
      </div>

      <div className="h-full overflow-y-auto pt-20 pb-32">
        <div className="px-4 space-y-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex-1 h-1 bg-pink-500 rounded-full" />
            <div className="flex-1 h-1 bg-pink-500 rounded-full mx-2" />
            <div className="flex-1 h-1 bg-pink-200 rounded-full" />
          </div>
          <div className="text-xs text-gray-500 flex items-center justify-between">
            <span>{t('shop.checkout.menu')}</span>
            <span>{t('shop.checkout.cart')}</span>
            <span className="text-pink-500 font-medium">{t('shop.checkout.title')}</span>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-500" />
              <div>
                <p className="text-xs text-gray-500">{t('shop.checkout.deliveryAddress')}</p>
                <p className="text-sm font-semibold text-gray-900">{deliveryAddress}</p>
              </div>
            </div>
            <button className="text-xs text-pink-500 font-medium">{t('shop.checkout.addInstruction')}</button>
            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs text-gray-500">{t('shop.checkout.contactless')}</span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-pink-500 transition-colors" />
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
              </label>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">{t('shop.checkout.tipRider')}</p>
                <p className="text-xs text-gray-500">{t('shop.checkout.tipInfo')}</p>
              </div>
              <Info className="w-4 h-4 text-gray-300" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {tipOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onTipChange(option)}
                  className={`rounded-2xl py-2 text-sm border ${
                    selectedTip === option
                      ? 'border-pink-500 text-pink-500 bg-pink-50'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {option === 0 ? t('shop.checkout.notNow') : `Rs ${option}`}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{t('shop.checkout.orderTotal')}</span>
              <span>Rs {total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{t('shop.checkout.tip')}</span>
              <span>Rs {selectedTip.toLocaleString()}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">{t('shop.checkout.totalPayable')}</span>
              <span className="text-lg font-semibold text-gray-900">
                Rs {(total + selectedTip).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">{t('shop.checkout.paying')}</p>
            <p className="text-lg font-semibold text-gray-900">
              Rs {(total + selectedTip).toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-gray-500 text-right">{shopName || 'Selected shop'}</p>
        </div>
        <button
          onClick={onPlaceOrder}
          className="w-full bg-[#00A859] hover:bg-[#009950] text-white rounded-2xl py-4 text-sm font-semibold"
        >
          {t('shop.checkout.placeOrder')}
        </button>
      </div>

    </div>
  );
}