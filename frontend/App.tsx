import { useState, useEffect } from 'react';
import { RideTrackingScreen } from './RideTrackingScreen';
import { DeliveryPickFromScreen } from './DeliveryPickFromScreen';
import { DeliveryLocationScreen } from './DeliveryLocationScreen';
import { ParcelDetailsScreen, ParcelDetails } from './ParcelDetailsScreen';
import { OrderPlacedScreen } from './OrderPlacedScreen';
import { ShopsScreen } from './ShopsScreen';
import { ShopDetailScreen } from './ShopDetailScreen';
import { ShopCartScreen } from './ShopCartScreen';
import { ShopCheckoutScreen } from './ShopCheckoutScreen';
import { OrderScreen } from './OrderScreen';
import { MapPin, Menu } from './ui/icons';
import { MapView } from './MapView';
import { PromoBanner } from './PromoBanner';
import { LocationCard } from './LocationCard';
import { BottomNav } from './BottomNav';
import { LocationSelectionScreen } from './LocationSelectionScreen';
import { LocationConfirmationScreen } from './LocationConfirmationScreen';
import { BookingScreen } from './BookingScreen';
import { SearchingDriversScreen } from './SearchingDriversScreen';
import { DriverOffersScreen } from './DriverOffersScreen';
import { HelpSupportScreen } from './HelpSupportScreen';
import { ShopCartItem } from './types';
import { useTranslation } from './i18n';
import { LanguageSelectionModal } from './LanguageSelectionModal';
import { SignInScreen } from './SignInScreen';
import { VerifyOtpScreen } from './VerifyOtpScreen';
import { UserMenuDrawer } from './UserMenuDrawer';
import { LiveChatScreen } from './LiveChatScreen';
import { CallSupportScreen } from './CallSupportScreen';



type ScreenType =
  | 'home'
  | 'location-selection'
  | 'location-confirmation'
  | 'booking'
  | 'help-support'
  | 'live-chat'
  | 'searching-drivers'
  | 'driver-offers'
  | 'ride-tracking'
  | 'delivery-pick-from'
  | 'delivery-location'
  | 'parcel-details'
  | 'order-placed'
  | 'shops'
  | 'shop-detail'
  | 'shop-cart'
  | 'shop-checkout'
  | 'order'
  |'call-Support';

export default function App() {
  const { language, toggleLanguage, t } = useTranslation();
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['home']);
  const currentScreen = screenHistory[screenHistory.length - 1];
  const [showLanguageModal, setShowLanguageModal] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasSeenLanguagePrompt = window.localStorage.getItem('hci-language-prompt-seen');
    return hasSeenLanguagePrompt !== 'true';
  });
  const [locationType, setLocationType] = useState<'pickup' | 'dropoff'>('pickup');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('bike');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedDriverName, setSelectedDriverName] = useState('Muhammad Ali');
  const [selectedDriverRating, setSelectedDriverRating] = useState(4.9);
  const [selectedFare, setSelectedFare] = useState(320);
  const [selectedShop, setSelectedShop] = useState<{ name: string; branch?: string } | null>(null);
  const [shopCart, setShopCart] = useState<ShopCartItem[]>([]);
  const [shopTip, setShopTip] = useState(0);
  const [activeBottomTab, setActiveBottomTab] = useState('ride');
  const [orderShop, setOrderShop] = useState<{ name: string; branch?: string } | null>(null);
  const [locationSelectionSource, setLocationSelectionSource] = useState<ScreenType | null>(null);
  
  // Unified location state - used across all flows
  const [currentDropoffLocation, setCurrentDropoffLocation] = useState('');
  const [currentPickupLocation, setCurrentPickupLocation] = useState('');
  
  // Delivery flow states
  const [deliveryPickupAddress, setDeliveryPickupAddress] = useState('');
  const [deliveryDropoffAddress, setDeliveryDropoffAddress] = useState('');
  const [deliveryLocationType, setDeliveryLocationType] = useState<'pickup' | 'delivery'>('pickup');
  const [parcelDetails, setParcelDetails] = useState<ParcelDetails | null>(null);
  const [trackingId, setTrackingId] = useState('');
  const [authStep, setAuthStep] = useState<'sign-in' | 'verify' | 'done'>('sign-in');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigateTo = (screen: ScreenType) => {
    setScreenHistory((prev) => [...prev, screen]);
  };

  // Keep default pickup/dropoff in the active language until user picks something
  useEffect(() => {
    const defaultPickupEn = 'Surjani Town';
    const defaultDropoffEn = 'Millennium Mall';
    const defaultPickupUr = 'سرجانی ٹاؤن';
    const defaultDropoffUr = 'ملینیم مال';

    if (!pickupLocation || pickupLocation === defaultPickupEn || pickupLocation === defaultPickupUr) {
      const defaultPickup = language === 'en' ? defaultPickupEn : defaultPickupUr;
      setPickupLocation(defaultPickup);
      if (!currentPickupLocation) setCurrentPickupLocation(defaultPickup);
    }
    if (!dropoffLocation || dropoffLocation === defaultDropoffEn || dropoffLocation === defaultDropoffUr) {
      const defaultDropoff = language === 'en' ? defaultDropoffEn : defaultDropoffUr;
      setDropoffLocation(defaultDropoff);
      if (!currentDropoffLocation) setCurrentDropoffLocation(defaultDropoff);
    }
  }, [language]);

  const goBack = () => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.slice(0, -1);
    });
  };

  const handleOpenLocationSelection = (type: 'pickup' | 'dropoff') => {
    setLocationType(type);
    setLocationSelectionSource(currentScreen);
    navigateTo('location-selection');
  };

  const handleSelectLocation = (location: string) => {
    if (locationType === 'pickup') {
      setPickupLocation(location);
      setCurrentPickupLocation(location); // Update unified state
      goBack();
    } else {
      setDropoffLocation(location);
      setCurrentDropoffLocation(location); // Update unified state
      // If coming from order screen, go back to it; otherwise go to confirmation
      if (locationSelectionSource === 'order') {
        setLocationSelectionSource(null);
        goBack();
      } else {
        navigateTo('location-confirmation');
      }
    }
  };

  const handleConfirmLocation = (instructions: string) => {
    // You can store the instructions if needed
    console.log('Delivery instructions:', instructions);
    navigateTo('booking');
  };

  const handleOpenHelpSupport = () => {
    setIsUserMenuOpen(true);
  };

  const handleConfirmBooking = (vehicleType: string, paymentMethod: string) => {
    setSelectedVehicle(vehicleType);
    setSelectedPayment(paymentMethod);
    navigateTo('searching-drivers');
  };

  const handleDriversFound = () => {
    navigateTo('driver-offers');
  };

  const handleAcceptOffer = (driverId: string) => {
    console.log('Accepted offer from driver:', driverId);
    setSelectedDriverId(driverId);
    // Set driver details based on driverId (in real app, this would come from API)
    setSelectedDriverName('Muhammad Ali');
    setSelectedDriverRating(4.9);
    setSelectedFare(320);
    navigateTo('ride-tracking');
  };

  const handleCancelRide = () => {
    navigateTo('home');
  };

  // Delivery flow handlers
  const handleBottomTabChange = (tab: string) => {
    setActiveBottomTab(tab);
    if (tab === 'delivery') {
      navigateTo('delivery-pick-from');
    } else if (tab === 'ride') {
      navigateTo('home');
    } else if (tab === 'shops') {
      navigateTo('shops');
    }
  };

  const handleDeliveryEnterPickupAddress = () => {
    setDeliveryLocationType('pickup');
    navigateTo('delivery-location');
  };

  const handleDeliveryEnterDeliveryAddress = () => {
    setDeliveryLocationType('delivery');
    navigateTo('delivery-location');
  };

  const handleDeliverySelectLocation = (location: string) => {
    if (deliveryLocationType === 'pickup') {
      setDeliveryPickupAddress(location);
      setCurrentPickupLocation(location); // Update unified state
    } else {
      setDeliveryDropoffAddress(location);
      setCurrentDropoffLocation(location); // Update unified state
    }
    navigateTo('delivery-pick-from');
  };

  const handleDeliveryBook = () => {
    if (deliveryPickupAddress && deliveryDropoffAddress) {
      navigateTo('parcel-details');
    }
  };

  const handleParcelDetailsSubmit = (details: ParcelDetails) => {
    setParcelDetails(details);
    // Generate tracking ID
    const newTrackingId = `PKG${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setTrackingId(newTrackingId);
    navigateTo('order-placed');
  };

  const handleOrderDone = () => {
    // Reset delivery flow
    setDeliveryPickupAddress('');
    setDeliveryDropoffAddress('');
    setParcelDetails(null);
    setActiveBottomTab('ride');
    navigateTo('home');
  };
  const handleUpdateDropoffLocation = (location: string) => {
    // update all the “source of truth” states that use dropoff
    setDropoffLocation(location);
    setCurrentDropoffLocation(location);
    setDeliveryDropoffAddress(location); // optional, remove if you don’t want to touch delivery flow
  };


  const handleAddItemToCart = (item: Omit<ShopCartItem, 'quantity'>) => {
    setShopCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateCartItemQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      setShopCart((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    setShopCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const handleClearCart = () => setShopCart([]);

  const handleShopOrderComplete = () => {
    alert('Order placed successfully!');
    handleClearCart();
    setShopTip(0);
    setActiveBottomTab('shops');
    navigateTo('shops');
  };

  const shopCartSubtotal = shopCart.reduce(
    (sum, item) => sum + item.priceValue * item.quantity,
    0
  );
  const shopDeliveryFee = 50;

  // ✅ Auth flow screens (NOW WRAPPED IN MOBILE FRAME)
if (authStep === 'sign-in') {
  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-gray-100 overflow-hidden">
      <SignInScreen onContinue={() => setAuthStep('verify')} />
    </div>
  );
}

if (authStep === 'verify') {
  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gray-100 overflow-y-auto">
      <VerifyOtpScreen
        onBack={() => setAuthStep('sign-in')}
        onVerified={() => setAuthStep('done')}
      />
    </div>
  );
}


  // Delivery flow screens
  if (currentScreen === 'order-placed') {
    return (
      <OrderPlacedScreen
        onDone={handleOrderDone}
        trackingId={trackingId}
        pickupAddress={deliveryPickupAddress}
        deliveryAddress={deliveryDropoffAddress}
        driverName="Ahmed Khan"
        estimatedTime="25 mins"
      />
    );
  }

  if (currentScreen === 'parcel-details') {
    return (
      <ParcelDetailsScreen
        onBack={goBack}
        onSubmit={handleParcelDetailsSubmit}
        pickupAddress={deliveryPickupAddress}
        deliveryAddress={deliveryDropoffAddress}
      />
    );
  }

  if (currentScreen === 'delivery-location') {
    return (
      <DeliveryLocationScreen
        onBack={goBack}
        onSelectLocation={handleDeliverySelectLocation}
        type={deliveryLocationType}
      />
    );
  }

  if (currentScreen === 'delivery-pick-from') {
    return (
      <DeliveryPickFromScreen
        onBack={() => {
          setActiveBottomTab('ride');
          navigateTo('home');
        }}
        onEnterPickupAddress={handleDeliveryEnterPickupAddress}
        onEnterDeliveryAddress={handleDeliveryEnterDeliveryAddress}
        onBook={handleDeliveryBook}
        pickupAddress={deliveryPickupAddress}
        deliveryAddress={deliveryDropoffAddress}
      />
    );
  }

  if (currentScreen === 'ride-tracking') {
    return (
      <RideTrackingScreen
        onBack={goBack}
        onCancelRide={handleCancelRide}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        fare={selectedFare}
        driverName={selectedDriverName}
        driverRating={selectedDriverRating}
        vehicleDetails="🏍️ Honda 125 • Black • ABC-123"
      />
    );
  }

  if (currentScreen === 'driver-offers') {
    return (
      <DriverOffersScreen
        onBack={goBack}
        onAcceptOffer={handleAcceptOffer}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
      />
    );
  }

  if (currentScreen === 'searching-drivers') {
    return (
      <SearchingDriversScreen
        onBack={goBack}
        onDriversFound={handleDriversFound}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        vehicleType={selectedVehicle}
      />
    );
  }

  if (currentScreen === 'booking') {
    return (
      <BookingScreen
        onBack={goBack}
        onConfirm={handleConfirmBooking}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
      />
    );
  }

  if (currentScreen === 'location-confirmation') {
    return (
      <LocationConfirmationScreen
        onBack={goBack}
        onConfirm={handleConfirmLocation}
        address={pickupLocation}
        area={language === 'en' ? 'Karachi' : 'کراچی'}
        landmark={dropoffLocation}
      />
    );
  }

  if (currentScreen === 'location-selection') {
    return (
      <LocationSelectionScreen
        onBack={goBack}
        onSelectLocation={handleSelectLocation}
        type={locationType}
      />
    );
  }

  if (currentScreen === 'help-support') {
  return (
    <HelpSupportScreen
      onBack={goBack}
      onStartLiveChat={() => navigateTo('live-chat')} 
       onStartCall={() => navigateTo('call-Support')}  // ✅ THIS LINE ADDED
    />
  );
}
if (currentScreen === 'live-chat') {
  return <LiveChatScreen onBack={goBack} />;
}
if (currentScreen === 'call-Support') {
  return <CallSupportScreen onBack={goBack} />;
}




  if (currentScreen === 'shops') {
    return (
      <ShopsScreen 
        onBack={goBack}
        onShopClick={(shop) => {
          setSelectedShop({ name: shop.name, branch: shop.branch });
          navigateTo('shop-detail');
        }}
        onOrderClick={(shop) => {
          setOrderShop({ name: shop.name, branch: shop.branch });
          navigateTo('order');
        }}
      />
    );
  }

  if (currentScreen === 'order') {
    // Get the most recent dropoff location from any source
    const activeDropoffLocation = currentDropoffLocation || dropoffLocation || deliveryDropoffAddress || '75270 KU Circular Rd University Of';
    
    return (
      <OrderScreen
        onBack={goBack}
        shopName={orderShop?.name}
        dropAddress={activeDropoffLocation}
        onUpdateLocation={(location) => {
          handleUpdateDropoffLocation(location);
        }}
        onOpenLocationSelection={() => {
          setLocationType('dropoff');
          setLocationSelectionSource('order');
          navigateTo('location-selection');
        }}
        onPlaceOrder={(orderDetails) => {
          console.log('Order placed:', orderDetails);
          // Navigate to order placed screen or handle order
          navigateTo('order-placed');
        }}
      />
    );
  }

  if (currentScreen === 'shop-detail') {
    return (
      <ShopDetailScreen 
        onBack={goBack} 
        shopName={selectedShop?.name}
        shopBranch={selectedShop?.branch}
        cartItems={shopCart}
        onAddToCart={handleAddItemToCart}
        onCheckout={() => {
          if (shopCart.length > 0) {
            navigateTo('shop-cart');
          }
        }}
      />
    );
  }

  if (currentScreen === 'shop-cart') {
    return (
      <ShopCartScreen
        onBack={goBack}
        onContinueShopping={() => navigateTo('shop-detail')}
        onProceed={() => navigateTo('shop-checkout')}
        cartItems={shopCart}
        shopName={selectedShop?.name}
        deliveryFee={shopDeliveryFee}
        onUpdateQuantity={handleUpdateCartItemQuantity}
        onRemoveItem={(id) => handleUpdateCartItemQuantity(id, 0)}
      />
    );
  }

  if (currentScreen === 'shop-checkout') {
    return (
      <ShopCheckoutScreen
        onBack={goBack}
        onPlaceOrder={handleShopOrderComplete}
        shopName={selectedShop?.name}
        total={shopCartSubtotal + shopDeliveryFee}
        deliveryAddress={dropoffLocation}
        selectedTip={shopTip}
        onTipChange={setShopTip}
      />
    );
  }

  const handleCloseLanguageModal = () => {
    setShowLanguageModal(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('hci-language-prompt-seen', 'true');
    }
  };

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-gray-100 overflow-hidden">
      {showLanguageModal && (
        <LanguageSelectionModal onClose={handleCloseLanguageModal} />
      )}
      
      {/* Language Toggle Button - without extra English in Urdu mode */}
      <button
        onClick={() => setShowLanguageModal(true)}
        className="absolute top-6 right-4 z-50 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 shadow-sm hover:bg-[#00D47C] hover:text-white hover:border-[#00D47C] transition-colors"
      >
        {language === 'en' ? 'اردو' : 'EN'}
      </button>

      {/* Menu Button - stacked below language toggle on the right */}
      <button 
        onClick={handleOpenHelpSupport}
        className="absolute top-20 right-4 z-40 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center border border-gray-200 shadow-sm hover:bg-[#00D47C] hover:text-white hover:border-[#00D47C] transition-colors"
        aria-label={t('help.title', 'Help & Support')}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Map - home view, just show user + nearby vehicles */}
      <MapView showRoute={false} />

      {/* User Menu Drawer */}
      <UserMenuDrawer
  open={isUserMenuOpen}
  onOpenChange={setIsUserMenuOpen}
  onHelpSupport={() => {
    // close the side menu
    setIsUserMenuOpen(false);
    // navigate to the Help & Support screen
    navigateTo('help-support');
  }}
/>

      {/* Promo Banner and Location Card Container */}
      <div className="absolute bottom-40 left-0 right-0 z-30 px-3 flex flex-col gap-4 pb-4">
        <PromoBanner />
        <LocationCard 
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onOpenLocationSelection={handleOpenLocationSelection}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeBottomTab} onTabChange={handleBottomTabChange} />

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>
    </div>
  );
}