import { ArrowLeft, Wallet, ArrowRight, CreditCard } from './ui/icons';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';
import { useState } from 'react';

interface WalletScreenProps {
  onBack: () => void;
}

export function WalletScreen({ onBack }: WalletScreenProps) {
  const { t } = useTranslation();
  const { isColorblindMode } = useAccessibility();
  const [walletBalance] = useState(1250);

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-gray-50 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#00D47C] px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-semibold text-lg">{t('wallet.title', 'My Wallet')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Balance Card */}
        <div className={`mx-4 mt-6 rounded-3xl p-6 shadow-lg ${
          isColorblindMode 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-gradient-to-br from-[#00D47C] to-[#00be6f]'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm">{t('wallet.balance', 'Wallet Balance')}</p>
                <p className="text-white text-3xl font-bold">Rs. {walletBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <p className="text-white/90 text-xs">{t('wallet.available', 'Available for rides, deliveries & shopping')}</p>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-6 grid grid-cols-2 gap-3">
          <button className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all ${
            isColorblindMode ? 'hover:border-blue-500' : 'hover:border-[#00D47C]'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isColorblindMode ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <CreditCard className={`w-5 h-5 ${
                  isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'
                }`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{t('wallet.addMoney', 'Add Money')}</p>
                <p className="text-xs text-gray-500">{t('wallet.topUp', 'Top up wallet')}</p>
              </div>
            </div>
          </button>

          <button className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all ${
            isColorblindMode ? 'hover:border-blue-500' : 'hover:border-[#00D47C]'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isColorblindMode ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <ArrowRight className={`w-5 h-5 ${
                  isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'
                }`} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{t('wallet.transfer', 'Transfer')}</p>
                <p className="text-xs text-gray-500">{t('wallet.fromBank', 'From bank account')}</p>
              </div>
            </div>
          </button>
        </div>

        {/* Transfer from Bank Section */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-gray-900 font-semibold mb-4">{t('wallet.transferFromBank', 'Transfer from Bank Account')}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {t('wallet.transferDesc', 'Securely transfer money from your linked bank account to your Bykea wallet.')}
            </p>
            <button className={`w-full py-3 rounded-xl font-medium text-white transition-colors ${
              isColorblindMode 
                ? 'bg-blue-500 hover:bg-blue-600' 
                : 'bg-[#00D47C] hover:bg-[#00be6f]'
            }`}>
              {t('wallet.transferNow', 'Transfer Now')}
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4 mt-6 mb-6">
          <h3 className="text-gray-900 font-semibold mb-3">{t('wallet.recent', 'Recent Transactions')}</h3>
          <div className="space-y-2">
            {[
              { type: 'credit', amount: 500, desc: t('wallet.added', 'Added via bank transfer'), date: 'Today' },
              { type: 'debit', amount: -120, desc: t('wallet.ride', 'Ride payment'), date: 'Yesterday' },
              { type: 'credit', amount: 1000, desc: t('wallet.added', 'Added via bank transfer'), date: '2 days ago' },
            ].map((txn, idx) => (
              <div key={idx} className="bg-white rounded-xl p-3 flex items-center justify-between border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    txn.type === 'credit' 
                      ? (isColorblindMode ? 'bg-blue-50' : 'bg-green-50')
                      : 'bg-red-50'
                  }`}>
                    {txn.type === 'credit' ? (
                      <span className="text-lg">+</span>
                    ) : (
                      <span className="text-lg">-</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{txn.desc}</p>
                    <p className="text-xs text-gray-500">{txn.date}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${
                  txn.type === 'credit' 
                    ? (isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]')
                    : 'text-red-500'
                }`}>
                  {txn.type === 'credit' ? '+' : ''}Rs. {Math.abs(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}

