import { ArrowLeft, Phone, Star, Send } from './ui/icons';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from './i18n';
import { usePageAnnouncement, useVoiceAnnouncements } from './useVoiceAnnouncements';

interface LiveChatScreenProps {
  onBack: () => void;
  driver?: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    totalTrips: number;
    vehicleType: string;
    vehicleModel: string;
    vehicleColor: string;
    vehiclePlate: string;
    isVerified: boolean;
  };
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'driver';
  timestamp: Date;
}

export function LiveChatScreen({ onBack, driver }: LiveChatScreenProps) {
  const { t } = useTranslation();
  const { announceAction } = useVoiceAnnouncements();
  usePageAnnouncement(
    driver 
      ? t('voice.chatWithDriver', `Chat with ${driver.name}`)
      : t('voice.liveChat', 'Live Chat Support')
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: driver 
        ? `Hi! I'm ${driver.name}, your driver. I'm on my way to pick you up.`
        : 'Hello! How can I help you today?',
      sender: driver ? 'driver' : 'driver',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    announceAction('Message sent');

    // Simulate driver response after 1-2 seconds
    setTimeout(() => {
      const driverResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: driver 
          ? 'Got it! See you soon.'
          : 'Thank you for your message. How else can I assist you?',
        sender: 'driver',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, driverResponse]);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const driverInitial = driver ? driver.name.charAt(0).toUpperCase() : 'S';
  const displayName = driver ? driver.name : 'Live Support';
  const displaySubtitle = driver 
    ? `${driver.rating} ⭐ • ${driver.totalTrips} trips`
    : 'Online';

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-[#00D47C] text-white">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-semibold text-[#00D47C] flex-shrink-0">
              <span>{driver?.photo || driverInitial}</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold truncate">{displayName}</span>
                {driver && driver.isVerified && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {driver && (
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                )}
                <span className="text-[11px] text-white/80 truncate">{displaySubtitle}</span>
              </div>
            </div>
          </div>
        </div>

        {driver && (
          <button 
            className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 ml-2"
            onClick={() => {
              const phoneNumber = '+923001234567'; // Default phone number
              window.location.href = `tel:${phoneNumber}`;
            }}
            aria-label="Call driver"
          >
            <Phone className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 bg-[#f9fafb] px-4 pt-4 pb-2 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-[#00D47C] text-white rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                <p
                  className={`mt-1 text-[11px] ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar - Keyboard safe */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 safe-area-bottom">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D47C] focus:border-[#00D47C]"
              placeholder="Type a message..."
              autoFocus
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={inputText.trim() === ''}
            className="w-10 h-10 rounded-full bg-[#00D47C] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00bd6e] transition-colors flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
