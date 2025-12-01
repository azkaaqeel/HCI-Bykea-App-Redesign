import { ArrowLeft, Package } from './ui/icons';
import { useState } from 'react';
import { useTranslation } from './i18n';

interface ParcelDetailsScreenProps {
  onBack: () => void;
  onSubmit: (details: ParcelDetails) => void;
  pickupAddress: string;
  deliveryAddress: string;
}

export interface ParcelDetails {
  weight: string;
  dimensions: string;
  description: string;
  recipientName: string;
  recipientPhone: string;
  cashOnDelivery: boolean;
  codAmount?: string;
}

export function ParcelDetailsScreen({
  onBack,
  onSubmit,
  pickupAddress,
  deliveryAddress,
}: ParcelDetailsScreenProps) {
  const { t } = useTranslation();
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [description, setDescription] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const [codAmount, setCodAmount] = useState('');

  const handleSubmit = () => {
    if (!weight || !recipientName || !recipientPhone) {
      alert(t('parcel.required'));
      return;
    }

    onSubmit({
      weight,
      dimensions,
      description,
      recipientName,
      recipientPhone,
      cashOnDelivery,
      codAmount: cashOnDelivery ? codAmount : undefined,
    });
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white z-50 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl text-black">{t('parcel.title')}</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 space-y-4">
          {/* Route Summary */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-[#00D47C]" />
              <span className="text-black">{t('parcel.deliveryRoute')}</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00D47C] mt-2" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">{t('location.from')}</div>
                  <div className="text-sm text-black">{pickupAddress}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                <div className="flex-1">
                  <div className="text-xs text-gray-500">{t('location.to')}</div>
                  <div className="text-sm text-black">{deliveryAddress}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Parcel Information */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-black mb-4">{t('parcel.parcelInfo')}</h2>
            
            <div className="space-y-4">
              {/* Weight */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  {t('parcel.weight')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('parcel.weightPlaceholder')}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-black placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#00D47C] focus:ring-1 focus:ring-[#00D47C]"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  {t('parcel.dimensions')}
                </label>
                <input
                  type="text"
                  placeholder={t('parcel.dimensionsPlaceholder')}
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-black placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#00D47C] focus:ring-1 focus:ring-[#00D47C]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  {t('parcel.description')}
                </label>
                <textarea
                  placeholder={t('parcel.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-black placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#00D47C] focus:ring-1 focus:ring-[#00D47C] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Recipient Details */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="text-black mb-4">{t('parcel.recipientDetails')}</h2>
            
            <div className="space-y-4">
              {/* Recipient Name */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  {t('parcel.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('parcel.namePlaceholder')}
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-black placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#00D47C] focus:ring-1 focus:ring-[#00D47C]"
                />
              </div>

              {/* Recipient Phone */}
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  {t('parcel.phone')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder={t('parcel.phonePlaceholder')}
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-black placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#00D47C] focus:ring-1 focus:ring-[#00D47C]"
                />
              </div>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-black">{t('parcel.cod')}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {t('parcel.codDesc')}
                </p>
              </div>
              <button
                onClick={() => setCashOnDelivery(!cashOnDelivery)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  cashOnDelivery ? 'bg-[#00D47C]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    cashOnDelivery ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {cashOnDelivery && (
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  {t('parcel.codAmount')}
                </label>
                <input
                  type="text"
                  placeholder={t('parcel.codAmountPlaceholder')}
                  value={codAmount}
                  onChange={(e) => setCodAmount(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl px-4 py-3 text-black placeholder-gray-400 border border-gray-200 focus:outline-none focus:border-[#00D47C] focus:ring-1 focus:ring-[#00D47C]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-full bg-[#00D47C] hover:bg-[#00bd6e] text-white rounded-2xl py-4 transition-colors"
          >
            {t('parcel.placeOrder')}
          </button>
        </div>

        {/* Home Indicator */}
        <div className="pt-4 flex justify-center">
          <div className="w-32 h-1 bg-black rounded-full" />
        </div>
      </div>
    </div>
  );
}
