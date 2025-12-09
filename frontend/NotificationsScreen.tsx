import { ArrowLeft, Bell, X } from './ui/icons';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';
import { useState } from 'react';

interface NotificationsScreenProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'promo' | 'order' | 'system';
  read: boolean;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { t } = useTranslation();
  const { isColorblindMode } = useAccessibility();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: t('notif.promo.title', '50% OFF at Fresh Mart!'),
      message: t('notif.promo.message', 'Use code FRESH50 to get 50% off on your first order. Valid until tomorrow!'),
      time: '2 hours ago',
      type: 'promo',
      read: false,
    },
    {
      id: '2',
      title: t('notif.order.title', 'Your order is on the way!'),
      message: t('notif.order.message', 'Your order from Al-Fatah will arrive in 15 minutes. Track your delivery.'),
      time: '5 hours ago',
      type: 'order',
      read: false,
    },
    {
      id: '3',
      title: t('notif.promo2.title', 'Special Discount: Burger Point'),
      message: t('notif.promo2.message', 'Get 30% off on all burgers. Use code BURGER30 at checkout. Limited time offer!'),
      time: '1 day ago',
      type: 'promo',
      read: true,
    },
    {
      id: '4',
      title: t('notif.system.title', 'Payment Successful'),
      message: t('notif.system.message', 'Your payment of Rs. 250 has been processed successfully.'),
      time: '2 days ago',
      type: 'system',
      read: true,
    },
    {
      id: '5',
      title: t('notif.promo3.title', 'New Shop Added: Qasim Samosa'),
      message: t('notif.promo3.message', 'Check out our new partner! Order now and get free delivery on orders above Rs. 500.'),
      time: '3 days ago',
      type: 'promo',
      read: true,
    },
  ]);

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'promo':
        return '🎉';
      case 'order':
        return '📦';
      case 'system':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'promo':
        return isColorblindMode ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200';
      case 'order':
        return 'bg-blue-50 border-blue-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#00D47C] px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-semibold text-lg">{t('notif.title', 'Notifications')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bell className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500">{t('notif.empty', 'No notifications')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkRead(notif.id)}
                className={`rounded-2xl p-4 border-2 transition-all cursor-pointer ${
                  notif.read 
                    ? getNotificationColor(notif.type) + ' opacity-75'
                    : getNotificationColor(notif.type) + ' shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${
                        notif.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                          isColorblindMode ? 'bg-blue-500' : 'bg-[#00D47C]'
                        }`}></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">{notif.time}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(notif.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Home Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}

