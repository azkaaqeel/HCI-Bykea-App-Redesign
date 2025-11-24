import { ArrowLeft, Search, Phone, MessageCircle, Book, Mail, Globe, ChevronRight } from './ui/icons';
import { useState } from 'react';
import { useTranslation } from './i18n';

interface HelpSupportScreenProps {
  onBack: () => void;
}

const commonIssues = [
  'How to track my ride/parcel?',
  'Change or cancel booking',
  'Payment and billing questions',
  'Report a safety concern',
  'App not working properly',
];

export function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage, t } = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const filteredIssues = commonIssues.filter(issue =>
    issue.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h1 className="text-gray-900">Help & Support</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Bar */}
        <div className="px-4 pt-4 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D47C] focus:bg-white transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Emergency Support Section */}
        <div className="px-4 py-3">
          <div className="bg-gradient-to-br from-[#00D47C] to-[#00be6f] rounded-2xl p-5 shadow-lg">
            <button className="w-full">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">CALL SUPPORT (24/7)</span>
              </div>
              <p className="text-white/90 text-sm text-center">Average wait: 30 seconds</p>
            </button>
          </div>
        </div>

        {/* Live Chat Support */}
        <div className="px-4 pb-3">
          <button className="w-full bg-white border-2 border-[#00D47C] rounded-2xl p-5 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#00D47C]/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#00D47C]" />
              </div>
              <span className="text-[#00D47C]">Live Chat Support</span>
            </div>
            <p className="text-gray-600 text-sm text-center">Average response: 2 minutes</p>
          </button>
        </div>

        {/* Common Issues Section */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Book className="w-5 h-5 text-gray-600" />
            <h2 className="text-gray-900">Common Issues</h2>
          </div>
          
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            {filteredIssues.map((issue, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 hover:bg-white transition-colors text-left border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700">{issue}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Email Support */}
        <div className="px-4 pb-3">
          <button className="w-full bg-white border border-gray-200 rounded-2xl p-5 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-gray-900">Email Support</span>
            </div>
            <p className="text-gray-600 text-sm text-center">Response time: Within 2 hours</p>
          </button>
        </div>

        {/* Language Settings */}
        <div className="px-4 py-4">
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowLanguageSelector(!showLanguageSelector)}
              className="w-full flex items-center justify-between p-4 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-gray-900 font-medium">Language / زبان</p>
                  <p className="text-sm text-gray-500">
                    Current: {language === 'en' ? 'English' : 'اردو'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showLanguageSelector ? 'rotate-90' : ''}`} />
            </button>
            
            {showLanguageSelector && (
              <div className="border-t border-gray-200 p-4 space-y-2">
                <button
                  onClick={() => {
                    setLanguage('en');
                    setShowLanguageSelector(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    language === 'en'
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇬🇧</span>
                    <span className="text-gray-900 font-medium">English</span>
                  </div>
                  {language === 'en' && (
                    <div className="w-5 h-5 rounded-full bg-[#00D47C] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setLanguage('ur');
                    setShowLanguageSelector(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    language === 'ur'
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇵🇰</span>
                    <span className="text-gray-900 font-medium">اردو</span>
                  </div>
                  {language === 'ur' && (
                    <div className="w-5 h-5 rounded-full bg-[#00D47C] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Visit Full Help Center */}
        <div className="px-4 pb-6">
          <button className="w-full flex items-center justify-center gap-2 py-4 text-[#00D47C] hover:text-[#00be6f] transition-colors">
            <Globe className="w-5 h-5" />
            <span>Visit Full Help Center</span>
          </button>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}