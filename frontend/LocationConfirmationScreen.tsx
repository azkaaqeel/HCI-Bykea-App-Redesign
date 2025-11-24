import { ArrowLeft, MapPin, Building, Edit3 } from './ui/icons';
import { useState } from 'react';
import { MapView } from './MapView';
import { useTranslation } from './i18n';

interface LocationConfirmationScreenProps {
  onBack: () => void;
  onConfirm: (instructions: string) => void;
  address?: string;
  area?: string;
  landmark?: string;
  landmarkDistance?: string;
}

export function LocationConfirmationScreen({
  onBack,
  onConfirm,
  address = 'House 23, Street 5',
  area = 'F-7/2, Islamabad',
  landmark = 'Jinnah Super Market',
  landmarkDistance = '50 meters away'
}: LocationConfirmationScreenProps) {
  const { t } = useTranslation();
  const [instructions, setInstructions] = useState('');

  const handleConfirm = () => {
    onConfirm(instructions);
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <div className="text-black">9:55</div>
        <div className="flex items-center gap-1">
          <div className="text-black">56</div>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="flex items-center gap-2 text-gray-900">
          <span className="text-[#00D47C]">✓</span>
          {t('location.confirm.title')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Map Preview */}
        <div className="px-4 pt-4 pb-6">
          <div className="w-full h-48 rounded-2xl overflow-hidden relative">
            <MapView />
            
            {/* Location Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
              <div className="relative">
                {/* Pin shadow */}
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black/20 rounded-full blur-sm"></div>
                
                {/* Pin */}
                <div className="w-12 h-12 bg-[#00D47C] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Display */}
        <div className="px-4 pb-4">
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            {/* Main Address */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#00D47C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#00D47C]" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900">{address}</p>
                <p className="text-gray-500">{area}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Nearby Landmark */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <Building className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">{t('location.confirm.near')}</p>
                <p className="text-gray-900">{landmark}</p>
                <p className="text-gray-500 text-sm">({landmarkDistance})</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Instructions Input */}
        <div className="px-4 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Edit3 className="w-4 h-4 text-gray-400" />
              <label className="text-gray-600 text-sm">{t('location.confirm.instructions')}</label>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder={t('location.confirm.instructionsPlaceholder')}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D47C] focus:bg-white transition-colors resize-none text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-4 pb-6 pt-2 bg-white border-t border-gray-100 space-y-3">
        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-[#00D47C] text-white py-4 rounded-xl shadow-lg hover:bg-[#00c070] transition-colors active:scale-[0.98] flex items-center justify-center"
        >
          <span>{t('location.confirm.confirmButton')}</span>
        </button>

        {/* Change Location Link */}
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 text-gray-600 py-2 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('location.confirm.changeLocation')}</span>
        </button>
      </div>

      {/* Home Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}