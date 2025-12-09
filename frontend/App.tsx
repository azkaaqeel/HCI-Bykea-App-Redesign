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
import { MapPin, Menu, Volume2, VolumeX } from './ui/icons';
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
import { RentalScreen } from './RentalScreen';
import { RentalBookingScreen } from './RentalBookingScreen';
import { HistoryScreen } from './HistoryScreen';
import { WalletScreen } from './WalletScreen';
import { NotificationsScreen } from './NotificationsScreen';
import { SettingsScreen } from './SettingsScreen';
import { useTutorial } from './TutorialProvider';
import { TutorialStep } from './TutorialOverlay';
import { usePageAnnouncement } from './useVoiceAnnouncements';
import { useAccessibility } from './accessibility';



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
  | 'call-Support'
  | 'rental'
  | 'rental-booking'
  | 'history'
  | 'wallet'
  | 'notifications'
  | 'settings';

export default function App() {
  const { language, toggleLanguage, t } = useTranslation();
  const { startTutorial, goToStep, showSelectionScreen } = useTutorial();
  const { voiceAnnouncementsEnabled, setVoiceAnnouncementsEnabled } = useAccessibility();
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['home']);
  const currentScreen = screenHistory[screenHistory.length - 1];
  
  // Announce home screen when on home
  usePageAnnouncement(
    currentScreen === 'home' ? t('voice.homeScreen', 'Home Screen') : '',
    [currentScreen]
  );
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
  const [selectedDriver, setSelectedDriver] = useState<{
    id: string;
    name: string;
    photo: string;
    rating: number;
    totalTrips: number;
    vehicleType: string;
    vehicleModel: string;
    vehicleColor: string;
    vehiclePlate: string;
    price: number;
    isVerified: boolean;
  } | null>(null);
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
  
  // Rental flow states
  const [rentalPickupLocation, setRentalPickupLocation] = useState('');
  const [rentalHours, setRentalHours] = useState(2);
  const [rentalVehicle, setRentalVehicle] = useState('motorcycle');
  const [rentalPayment, setRentalPayment] = useState('cash');

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

  // Tutorial flows configuration
  const rideTutorialSteps: TutorialStep[] = [
    {
      id: 'ride-home-location',
      screen: 'home',
      target: '[data-tutorial="location-card"]',
      position: 'top',
      title: 'tutorial.ride.location',
      description: 'tutorial.ride.locationDesc',
      action: () => {
        navigateTo('home');
        setActiveBottomTab('ride');
      },
    },
    {
      id: 'ride-location-selection',
      screen: 'location-selection',
      position: 'center',
      title: 'tutorial.ride.selectLocation',
      description: 'tutorial.ride.selectLocationDesc',
      action: () => {
        navigateTo('location-selection');
        setLocationType('pickup');
      },
    },
    {
      id: 'ride-location-confirmation',
      screen: 'location-confirmation',
      position: 'center',
      title: 'tutorial.ride.confirmLocation',
      description: 'tutorial.ride.confirmLocationDesc',
      action: () => {
        navigateTo('location-confirmation');
      },
    },
    {
      id: 'ride-booking-vehicle',
      screen: 'booking',
      target: '[data-tutorial="vehicle-selection"]',
      position: 'top',
      title: 'tutorial.ride.vehicle',
      description: 'tutorial.ride.vehicleDesc',
      action: () => {
        navigateTo('booking');
      },
    },
    {
      id: 'ride-booking-payment',
      screen: 'booking',
      target: '[data-tutorial="payment-selection"]',
      position: 'top',
      title: 'tutorial.ride.payment',
      description: 'tutorial.ride.paymentDesc',
      action: () => {
        navigateTo('booking');
      },
    },
    {
      id: 'ride-driver-search',
      screen: 'searching-drivers',
      position: 'center',
      title: 'tutorial.ride.driverSearch',
      description: 'tutorial.ride.driverSearchDesc',
      action: () => {
        navigateTo('searching-drivers');
      },
    },
    {
      id: 'ride-driver-offers',
      screen: 'driver-offers',
      target: '[data-tutorial="driver-offers"]',
      position: 'top',
      title: 'tutorial.ride.driverOffers',
      description: 'tutorial.ride.driverOffersDesc',
      action: () => {
        navigateTo('driver-offers');
      },
    },
    {
      id: 'ride-tracking',
      screen: 'ride-tracking',
      position: 'center',
      title: 'tutorial.ride.tracking',
      description: 'tutorial.ride.trackingDesc',
      action: () => {
        navigateTo('ride-tracking');
        setSelectedDriver({
          id: '1',
          name: 'Muhammad Ali',
          photo: '👨',
          rating: 4.9,
          totalTrips: 234,
          vehicleType: 'Bike',
          vehicleModel: 'Honda 125',
          vehicleColor: 'Black',
          vehiclePlate: 'ABC-123',
          price: 320,
          isVerified: true,
        });
        setSelectedFare(320);
      },
    },
    {
      id: 'ride-cancel',
      screen: 'ride-tracking',
      target: '[data-tutorial="cancel-ride"]',
      position: 'top',
      title: 'tutorial.ride.cancel',
      description: 'tutorial.ride.cancelDesc',
      action: () => {
        navigateTo('ride-tracking');
        setSelectedDriver({
          id: '1',
          name: 'Muhammad Ali',
          photo: '👨',
          rating: 4.9,
          totalTrips: 234,
          vehicleType: 'Bike',
          vehicleModel: 'Honda 125',
          vehicleColor: 'Black',
          vehiclePlate: 'ABC-123',
          price: 320,
          isVerified: true,
        });
        setSelectedFare(320);
      },
    },
    {
      id: 'ride-emergency',
      screen: 'ride-tracking',
      target: '[data-tutorial="emergency-sos"]',
      position: 'top',
      title: 'tutorial.ride.emergency',
      description: 'tutorial.ride.emergencyDesc',
      action: () => {
        navigateTo('ride-tracking');
        setSelectedDriver({
          id: '1',
          name: 'Muhammad Ali',
          photo: '👨',
          rating: 4.9,
          totalTrips: 234,
          vehicleType: 'Bike',
          vehicleModel: 'Honda 125',
          vehicleColor: 'Black',
          vehiclePlate: 'ABC-123',
          price: 320,
          isVerified: true,
        });
        setSelectedFare(320);
      },
    },
  ];

  const deliveryTutorialSteps: TutorialStep[] = [
    {
      id: 'delivery-home',
      screen: 'home',
      target: '[data-tutorial="bottom-nav"]',
      position: 'top',
      title: 'tutorial.delivery.switchTab',
      description: 'tutorial.delivery.switchTabDesc',
      action: () => {
        navigateTo('home');
        setActiveBottomTab('delivery');
      },
    },
    {
      id: 'delivery-pick-from',
      screen: 'delivery-pick-from',
      position: 'center',
      title: 'tutorial.delivery.pickFrom',
      description: 'tutorial.delivery.pickFromDesc',
      action: () => {
        navigateTo('delivery-pick-from');
        setActiveBottomTab('delivery');
      },
    },
    {
      id: 'delivery-location-pickup',
      screen: 'delivery-location',
      position: 'center',
      title: 'tutorial.delivery.enterPickup',
      description: 'tutorial.delivery.enterPickupDesc',
      action: () => {
        navigateTo('delivery-location');
        setDeliveryLocationType('pickup');
      },
    },
    {
      id: 'delivery-location-delivery',
      screen: 'delivery-location',
      position: 'center',
      title: 'tutorial.delivery.enterDelivery',
      description: 'tutorial.delivery.enterDeliveryDesc',
      action: () => {
        navigateTo('delivery-location');
        setDeliveryLocationType('delivery');
      },
    },
    {
      id: 'delivery-parcel-details',
      screen: 'parcel-details',
      position: 'center',
      title: 'tutorial.delivery.parcelDetails',
      description: 'tutorial.delivery.parcelDetailsDesc',
      action: () => {
        navigateTo('parcel-details');
      },
    },
    {
      id: 'delivery-order-placed',
      screen: 'order-placed',
      position: 'center',
      title: 'tutorial.delivery.orderPlaced',
      description: 'tutorial.delivery.orderPlacedDesc',
      action: () => {
        navigateTo('order-placed');
      },
    },
  ];

  const shopsTutorialSteps: TutorialStep[] = [
    {
      id: 'shops-home',
      screen: 'home',
      target: '[data-tutorial="bottom-nav"]',
      position: 'top',
      title: 'tutorial.shops.switchTab',
      description: 'tutorial.shops.switchTabDesc',
      action: () => {
        navigateTo('home');
        setActiveBottomTab('shops');
      },
    },
    {
      id: 'shops-browse',
      screen: 'shops',
      position: 'center',
      title: 'tutorial.shops.browse',
      description: 'tutorial.shops.browseDesc',
      action: () => {
        navigateTo('shops');
        setActiveBottomTab('shops');
      },
    },
    {
      id: 'shops-detail',
      screen: 'shop-detail',
      position: 'center',
      title: 'tutorial.shops.detail',
      description: 'tutorial.shops.detailDesc',
      action: () => {
        setSelectedShop({ name: 'Fresh Mart', branch: 'Gulshan' });
        navigateTo('shop-detail');
      },
    },
    {
      id: 'shops-cart',
      screen: 'shop-cart',
      position: 'center',
      title: 'tutorial.shops.cart',
      description: 'tutorial.shops.cartDesc',
      action: () => {
        navigateTo('shop-cart');
      },
    },
    {
      id: 'shops-checkout',
      screen: 'shop-checkout',
      position: 'center',
      title: 'tutorial.shops.checkout',
      description: 'tutorial.shops.checkoutDesc',
      action: () => {
        navigateTo('shop-checkout');
      },
    },
  ];

  // Listen for tutorial start event
  useEffect(() => {
    const handleStartTutorial = () => {
      // Show selection screen first
      showSelectionScreen();
    };

    const handleSelectFlow = (event: CustomEvent<{ flow: 'ride' | 'delivery' | 'shops' }>) => {
      const { flow } = event.detail;
      let steps: TutorialStep[] = [];
      
      if (flow === 'ride') {
        steps = rideTutorialSteps;
      } else if (flow === 'delivery') {
        steps = deliveryTutorialSteps;
      } else if (flow === 'shops') {
        steps = shopsTutorialSteps;
      }

      if (steps.length > 0) {
        // When flow finishes, show selection screen again
        // When tutorial is closed, navigate to help-support
        startTutorial(steps, () => {
          showSelectionScreen();
        });
        // Navigate to first step's screen
        if (steps[0]?.action) {
          steps[0].action();
        }
      }
    };

    const handleCloseToHelp = () => {
      navigateTo('help-support');
    };

    window.addEventListener('start-tutorial', handleStartTutorial);
    window.addEventListener('tutorial-select-flow', handleSelectFlow as EventListener);
    window.addEventListener('tutorial-close-to-help', handleCloseToHelp);
    return () => {
      window.removeEventListener('start-tutorial', handleStartTutorial);
      window.removeEventListener('tutorial-select-flow', handleSelectFlow as EventListener);
      window.removeEventListener('tutorial-close-to-help', handleCloseToHelp);
    };
  }, [startTutorial, showSelectionScreen, rideTutorialSteps, deliveryTutorialSteps, shopsTutorialSteps]);

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
      // If coming from rental screens, update rental location
      if (locationSelectionSource === 'rental' || locationSelectionSource === 'rental-booking') {
        setRentalPickupLocation(location);
      }
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

  const handleAcceptOffer = (driverId: string, driverData?: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    totalTrips: number;
    vehicleType: string;
    vehicleModel: string;
    vehicleColor: string;
    vehiclePlate: string;
    price: number;
    isVerified: boolean;
  }) => {
    console.log('Accepted offer from driver:', driverId);
    setSelectedDriverId(driverId);
    if (driverData) {
      setSelectedDriver(driverData);
      setSelectedFare(driverData.price);
    } else {
      // Fallback for backward compatibility
      setSelectedDriver({
        id: driverId,
        name: 'Muhammad Ali',
        photo: '👨',
        rating: 4.9,
        totalTrips: 234,
        vehicleType: 'Bike',
        vehicleModel: 'Honda 125',
        vehicleColor: 'Black',
        vehiclePlate: 'ABC-123',
        price: 320,
        isVerified: true,
      });
      setSelectedFare(320);
    }
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
    } else if (tab === 'rentals') {
      navigateTo('rental');
    }
  };

  // Rental flow handlers
  const handleRentalSelectPickupLocation = (location: string) => {
    setRentalPickupLocation(location);
    navigateTo('rental-booking');
  };

  const handleRentalConfirm = (hours: number, vehicleType: string, paymentMethod: string) => {
    setRentalHours(hours);
    setRentalVehicle(vehicleType);
    setRentalPayment(paymentMethod);
    // Navigate to searching drivers or confirmation screen
    navigateTo('searching-drivers');
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

  // Rental flow screens
  if (currentScreen === 'rental-booking') {
    return (
      <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden">
        <RentalBookingScreen
          onBack={goBack}
          onConfirm={handleRentalConfirm}
          pickupLocation={rentalPickupLocation}
          onOpenLocationSelection={() => {
            setLocationType('pickup');
            setLocationSelectionSource('rental-booking');
            navigateTo('location-selection');
          }}
        />
        <BottomNav activeTab={activeBottomTab} onTabChange={handleBottomTabChange} />
      </div>
    );
  }

  if (currentScreen === 'rental') {
    return (
      <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden">
        <RentalScreen
          onBack={() => {
            setActiveBottomTab('ride');
            navigateTo('home');
          }}
          onSelectPickupLocation={handleRentalSelectPickupLocation}
          pickupLocation={rentalPickupLocation}
          onOpenLocationSelection={() => {
            setLocationType('pickup');
            setLocationSelectionSource('rental');
            navigateTo('location-selection');
          }}
        />
        <BottomNav activeTab={activeBottomTab} onTabChange={handleBottomTabChange} />
      </div>
    );
  }

  if (currentScreen === 'ride-tracking') {
    const currentDriver = selectedDriver || {
      id: selectedDriverId || '1',
      name: 'Muhammad Ali',
      photo: '👨',
      rating: 4.9,
      totalTrips: 234,
      vehicleType: 'Bike',
      vehicleModel: 'Honda 125',
      vehicleColor: 'Black',
      vehiclePlate: 'ABC-123',
      price: selectedFare,
      isVerified: true,
    };
    
    return (
      <RideTrackingScreen
        onCancelRide={handleCancelRide}
        onOpenChat={() => navigateTo('live-chat')}
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        fare={selectedFare}
        driver={currentDriver}
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
    // Check if this is a rental flow
    const isRentalFlow = Boolean(rentalPickupLocation && rentalHours > 0);
    
    return (
      <SearchingDriversScreen
        onBack={goBack}
        onDriversFound={handleDriversFound}
        pickupLocation={isRentalFlow ? rentalPickupLocation : pickupLocation}
        dropoffLocation={isRentalFlow ? undefined : dropoffLocation}
        vehicleType={isRentalFlow ? rentalVehicle : selectedVehicle}
        isRental={isRentalFlow}
        rentalHours={isRentalFlow ? rentalHours : undefined}
        rentalType="Hourly Rental"
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
  // If we have a selected driver (from ride-tracking), show driver chat
  // Otherwise, show support chat
  const driverForChat = selectedDriver ? {
    id: selectedDriver.id,
    name: selectedDriver.name,
    photo: selectedDriver.photo,
    rating: selectedDriver.rating,
    totalTrips: selectedDriver.totalTrips,
    vehicleType: selectedDriver.vehicleType,
    vehicleModel: selectedDriver.vehicleModel,
    vehicleColor: selectedDriver.vehicleColor,
    vehiclePlate: selectedDriver.vehiclePlate,
    isVerified: selectedDriver.isVerified,
  } : undefined;
  
  return <LiveChatScreen onBack={goBack} driver={driverForChat} />;
}
if (currentScreen === 'call-Support') {
  return <CallSupportScreen onBack={goBack} />;
}

if (currentScreen === 'history') {
  return <HistoryScreen onBack={goBack} />;
}

if (currentScreen === 'wallet') {
  return <WalletScreen onBack={goBack} />;
}

if (currentScreen === 'notifications') {
  return <NotificationsScreen onBack={goBack} />;
}

if (currentScreen === 'settings') {
  return <SettingsScreen onBack={goBack} />;
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
      
      {/* Top-right FAB Stack - All floating controls */}
      <div className="absolute top-6 right-4 z-50 flex flex-col gap-3">
        {/* Menu Button - Top */}
        <button 
          onClick={handleOpenHelpSupport}
          className="rounded-full w-10 h-10 flex items-center justify-center border border-[#00D47C] shadow-sm bg-[#00D47C] text-white transition-colors"
          aria-label={t('help.title', 'Help & Support')}
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Language Toggle Button */}
        <button
          onClick={() => setShowLanguageModal(true)}
          className="rounded-full bg-[#00D47C] px-4 py-2 text-sm font-semibold text-white border border-[#00D47C] shadow-sm transition-colors"
        >
          {language === 'en' ? 'اردو' : 'EN'}
        </button>

        {/* Voice Announcements Toggle Button */}
        {currentScreen === 'home' && (
          <button
            onClick={() => setVoiceAnnouncementsEnabled(!voiceAnnouncementsEnabled)}
            className="rounded-full w-10 h-10 flex items-center justify-center border border-[#00D47C] shadow-sm bg-[#00D47C] text-white transition-colors"
            aria-label={voiceAnnouncementsEnabled ? t('voice.disabled', 'Disable voice announcements') : t('voice.enabled', 'Enable voice announcements')}
            title={voiceAnnouncementsEnabled ? t('voice.disabled', 'Voice announcements enabled') : t('voice.enabled', 'Voice announcements disabled')}
          >
            {voiceAnnouncementsEnabled ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-white" />
            )}
          </button>
        )}

        {/* Location / Locate-me Button - Bottom */}
        {currentScreen === 'home' && (
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
                    // MapView will handle the location update via its internal state
                  },
                  () => {}
                );
              }
            }}
            className="rounded-full w-10 h-10 flex items-center justify-center border border-[#00D47C] shadow-sm bg-[#00D47C] text-white transition-colors"
            aria-label={t('home.locateMe', 'Locate me')}
          >
            <MapPin className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Map - home view, just show user + nearby vehicles */}
      <MapView showRoute={false} hideLocateButton={currentScreen === 'home'} />

      {/* User Menu Drawer */}
      <UserMenuDrawer
  open={isUserMenuOpen}
  onOpenChange={setIsUserMenuOpen}
  onHelpSupport={() => {
    setIsUserMenuOpen(false);
    navigateTo('help-support');
  }}
  onHistory={() => navigateTo('history')}
  onWallet={() => navigateTo('wallet')}
  onNotifications={() => navigateTo('notifications')}
  onCallBykea={() => navigateTo('call-Support')}
  onSettings={() => navigateTo('settings')}
/>

      {/* Promo Banner and Location Card Container */}
      <div className="absolute bottom-40 left-0 right-0 z-30 px-3 flex flex-col gap-4 pb-4">
        <PromoBanner />
        <div data-tutorial="location-card">
          <LocationCard 
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            onOpenLocationSelection={handleOpenLocationSelection}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div data-tutorial="bottom-nav">
        <BottomNav activeTab={activeBottomTab} onTabChange={handleBottomTabChange} />
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black rounded-full"></div>
    </div>
  );
}