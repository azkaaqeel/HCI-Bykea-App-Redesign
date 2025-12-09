import { ArrowLeft, Search, Phone, MessageCircle, Book, Mail, Globe, ChevronRight, Eye, Play } from './ui/icons';
import { useState } from 'react';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';
import { usePageAnnouncement } from './useVoiceAnnouncements';

interface HelpSupportScreenProps {
  onBack: () => void;
  onStartLiveChat?: () => void;
  onStartCall?: () => void;
}

const commonIssuesKeys = [
  'help.issue.track',
  'help.issue.changeBooking',
  'help.issue.payment',
  'help.issue.safety',
  'help.issue.app',
];

export function HelpSupportScreen({
  onBack,
  onStartLiveChat,
  onStartCall,
}: HelpSupportScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { language, setLanguage, t } = useTranslation();
  usePageAnnouncement(t('help.title', 'Help & Support'));
  const { mode, setMode, colorblindType, setColorblindType, isColorblindMode, isHighContrast, voiceAnnouncementsEnabled, setVoiceAnnouncementsEnabled } = useAccessibility();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showAccessibilitySelector, setShowAccessibilitySelector] = useState(false);
  const [showColorblindTypeSelector, setShowColorblindTypeSelector] = useState(false);

  const filteredIssues = commonIssuesKeys.filter((issueKey) =>
    t(issueKey).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-gray-100">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-gray-900">{t('help.title', 'Help & Support')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Bar */}
        <div className="px-4 pt-4 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('help.searchPlaceholder', 'Search for help...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00D47C] focus:bg-white transition-colors text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* App Tutorial Section */}
        <div className="px-4 py-3">
          <button
            onClick={() => {
              onBack(); // Go back to home first
              // Tutorial will be started from App.tsx
              setTimeout(() => {
                const event = new CustomEvent('start-tutorial');
                window.dispatchEvent(event);
              }, 300);
            }}
            className="w-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">
                {t('help.startTutorial', 'Start App Tutorial')}
              </span>
            </div>
            <p className="text-white/90 text-sm text-center">
              {t('help.tutorialDesc', 'Learn how to use the app with interactive guide')}
            </p>
          </button>
        </div>

        {/* Emergency Support Section */}
        <div className="px-4 py-3">
          <div className="bg-gradient-to-br from-[#00D47C] to-[#00be6f] rounded-2xl p-5 shadow-lg">
            <button
              className="w-full"
              onClick={() => onStartCall?.()}  // navigate to Call AIR screen
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="text-white">
                  {t('help.callSupport', 'CALL SUPPORT (24/7)')}
                </span>
              </div>
              <p className="text-white/90 text-sm text-center">
                {t('help.callWait', 'Average wait: 30 seconds')}
              </p>
            </button>
          </div>
        </div>


        {/* Live Chat Support */}
        <div className="px-4 pb-3">
          <button
  className="w-full bg-white border-2 border-[#00D47C] rounded-2xl p-5 shadow-sm hover:bg-gray-50 transition-colors"
  onClick={() => onStartLiveChat?.()}   // ✅ tell parent to open chat screen
>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#00D47C]/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#00D47C]" />
              </div>
              <span className="text-[#00D47C]">{t('help.liveChat', 'Live Chat Support')}</span>
            </div>
            <p className="text-gray-600 text-sm text-center">
              {t('help.chatWait', 'Average response: 2 minutes')}
            </p>
          </button>
        </div>

        {/* Common Issues Section */}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            <Book className="w-5 h-5 text-gray-600" />
            <h2 className="text-gray-900">{t('help.commonIssues', 'Common Issues')}</h2>
          </div>
          
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
            {filteredIssues.map((issueKey, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 hover:bg-white transition-colors text-left border-b border-gray-100 last:border-b-0"
              >
                <span className="text-gray-700">{t(issueKey)}</span>
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
              <span className="text-gray-900">{t('help.email', 'Email Support')}</span>
            </div>
            <p className="text-gray-600 text-sm text-center">
              {t('help.emailWait', 'Response time: Within 2 hours')}
            </p>
          </button>
        </div>

        {/* Accessibility Settings */}
        <div className="px-4 py-4">
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowAccessibilitySelector(!showAccessibilitySelector)}
              className="w-full flex items-center justify-between p-4 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-600" />
                <div className="text-left">
                  <p className="text-gray-900 font-medium">{t('help.accessibility', 'Accessibility / رسائی')}</p>
                  <p className="text-sm text-gray-500">
                    {mode === 'normal' ? 'Normal' : mode === 'colorblind' ? 'Colorblind Mode' : 'High Contrast'}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showAccessibilitySelector ? 'rotate-90' : ''}`} />
            </button>
            
            {showAccessibilitySelector && (
              <div className="border-t border-gray-200 p-4 space-y-2">
                <button
                  onClick={() => {
                    setMode('normal');
                    setShowAccessibilitySelector(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    mode === 'normal'
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👁️</span>
                    <div className="text-left">
                      <span className="text-gray-900 font-medium block">{t('help.accessibility.normal', 'Normal')}</span>
                      <span className="text-xs text-gray-500">{t('help.accessibility.normalDesc', 'Standard view')}</span>
                    </div>
                  </div>
                  {mode === 'normal' && (
                    <div className="w-5 h-5 rounded-full bg-[#00D47C] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setMode('colorblind');
                    setShowAccessibilitySelector(false);
                    if (mode !== 'colorblind') {
                      setShowColorblindTypeSelector(true);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    mode === 'colorblind'
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎨</span>
                    <div className="text-left">
                      <span className="text-gray-900 font-medium block">
                        {t('help.accessibility.colorblind', 'Colorblind Mode')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {mode === 'colorblind' 
                          ? t('help.accessibility.colorblindType', `Type: ${colorblindType === 'general' ? 'General' : colorblindType === 'protanopia' ? 'Protanopia' : colorblindType === 'deuteranopia' ? 'Deuteranopia' : 'Tritanopia'}`)
                          : t('help.accessibility.colorblindDesc', 'Icons, patterns & labels')
                        }
                      </span>
                    </div>
                  </div>
                  {mode === 'colorblind' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowColorblindTypeSelector(!showColorblindTypeSelector);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight 
                          className={`w-4 h-4 text-gray-400 transition-transform ${showColorblindTypeSelector ? 'rotate-90' : ''}`}
                        />
                      </button>
                      <div className="w-5 h-5 rounded-full bg-[#00D47C] flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
                
                {/* Colorblind Type Selector */}
                {mode === 'colorblind' && showColorblindTypeSelector && (
                  <div className="border-t border-gray-200 p-4 space-y-2 bg-gray-50">
                    <p className="text-xs text-gray-600 mb-2 font-medium">
                      {t('help.accessibility.selectType', 'Select Colorblind Type:')}
                    </p>
                    <button
                      onClick={() => {
                        setColorblindType('general');
                        setShowColorblindTypeSelector(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border-2 transition-all text-sm ${
                        colorblindType === 'general'
                          ? 'border-[#00D47C] bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-gray-900">General</span>
                      {colorblindType === 'general' && (
                        <div className="w-4 h-4 rounded-full bg-[#00D47C] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setColorblindType('protanopia');
                        setShowColorblindTypeSelector(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border-2 transition-all text-sm ${
                        colorblindType === 'protanopia'
                          ? 'border-[#00D47C] bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-gray-900">Protanopia (Red-blind)</span>
                      {colorblindType === 'protanopia' && (
                        <div className="w-4 h-4 rounded-full bg-[#00D47C] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setColorblindType('deuteranopia');
                        setShowColorblindTypeSelector(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border-2 transition-all text-sm ${
                        colorblindType === 'deuteranopia'
                          ? 'border-[#00D47C] bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-gray-900">Deuteranopia (Green-blind)</span>
                      {colorblindType === 'deuteranopia' && (
                        <div className="w-4 h-4 rounded-full bg-[#00D47C] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setColorblindType('tritanopia');
                        setShowColorblindTypeSelector(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg border-2 transition-all text-sm ${
                        colorblindType === 'tritanopia'
                          ? 'border-[#00D47C] bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-gray-900">Tritanopia (Blue-yellow blind)</span>
                      {colorblindType === 'tritanopia' && (
                        <div className="w-4 h-4 rounded-full bg-[#00D47C] flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setMode('high-contrast');
                    setShowAccessibilitySelector(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    mode === 'high-contrast'
                      ? 'border-[#00D47C] bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔲</span>
                    <div className="text-left">
                      <span className="text-gray-900 font-medium block">
                        {t('help.accessibility.highContrast', 'High Contrast')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {t('help.accessibility.highContrastDesc', 'Enhanced visibility')}
                      </span>
                    </div>
                  </div>
                  {mode === 'high-contrast' && (
                    <div className="w-5 h-5 rounded-full bg-[#00D47C] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Voice Announcements Toggle */}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <button
                    onClick={() => setVoiceAnnouncementsEnabled(!voiceAnnouncementsEnabled)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                      voiceAnnouncementsEnabled
                        ? 'border-[#00D47C] bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔊</span>
                      <div className="text-left flex-1">
                        <span className="text-gray-900 font-medium block">
                          {t('help.accessibility.voiceAnnouncements', 'Voice Announcements')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {voiceAnnouncementsEnabled 
                            ? t('help.accessibility.voiceEnabled', 'Enabled - Screen reader and speech announcements active')
                            : t('help.accessibility.voiceDisabled', 'Disabled - No voice announcements')}
                        </span>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      voiceAnnouncementsEnabled ? 'bg-[#00D47C]' : 'bg-gray-300'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                        voiceAnnouncementsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      } mt-0.5`}></div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
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
                  <p className="text-gray-900 font-medium">{t('help.language', 'Language / زبان')}</p>
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
            <span>{t('help.fullCenter', 'Visit Full Help Center')}</span>
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