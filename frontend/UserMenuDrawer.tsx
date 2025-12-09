import { Sheet, SheetContent } from './ui/sheet';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';
import { Phone, Globe, Info, Filter, Clock, Wallet, Bell, ChevronRight, Eye } from './ui/icons';
import { ColorblindType } from './colorTransformations';
import { useState } from 'react';

interface UserMenuDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHelpSupport: () => void;
}

export function UserMenuDrawer({ open, onOpenChange, onHelpSupport,}: UserMenuDrawerProps) {
  const { t, language, setLanguage } = useTranslation();
  const { mode, setMode, colorblindType, setColorblindType, voiceAnnouncementsEnabled, setVoiceAnnouncementsEnabled } = useAccessibility();
  const [showAccessibilityOptions, setShowAccessibilityOptions] = useState(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="bg-white p-0">
        {/* Header with avatar */}
        <div className="bg-[#00A859] text-white px-6 pt-10 pb-6 flex items-center gap-4 rounded-br-3xl">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-lg font-semibold">
            A
          </div>
          <div>
            <p className="text-sm opacity-80">Welcome back,</p>
            <p className="text-lg font-semibold">Azka Aqeel</p>
          </div>
        </div>

        {/* Menu items */}
        <div className="px-6 py-4 space-y-1 text-sm">
          <MenuItem icon={Wallet} label="My Wallet" />
          <MenuItem icon={Clock} label="History" />
          <MenuItem icon={Bell} label="Notifications" />
          <MenuItem icon={Phone} label="Call Bykea" />
          <button
            className="w-full flex items-center justify-between py-3"
            onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
          >
            <div className="flex items-center gap-3 text-gray-800">
              <Globe className="w-5 h-5 text-[#00A859]" />
              <span>Language</span>
            </div>
            <span className="text-xs text-gray-500">
              {language === 'en' ? 'English' : 'اردو'}
            </span>
          </button>
          <button
            className="w-full flex items-center justify-between py-3"
            onClick={() => setShowAccessibilityOptions(!showAccessibilityOptions)}
          >
            <div className="flex items-center gap-3 text-gray-800">
              <Eye className="w-5 h-5 text-[#00A859]" />
              <span>{t('menu.accessibility', 'Accessibility')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 capitalize">
                {mode === 'normal' ? 'Normal' : mode === 'colorblind' 
                  ? `Colorblind (${colorblindType === 'general' ? 'General' : colorblindType === 'protanopia' ? 'Protanopia' : colorblindType === 'deuteranopia' ? 'Deuteranopia' : 'Tritanopia'})`
                  : 'High Contrast'}
              </span>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showAccessibilityOptions ? 'rotate-90' : ''}`} />
            </div>
          </button>
          
          {/* Accessibility Options */}
          {showAccessibilityOptions && (
            <div className="ml-8 mr-4 mb-2 space-y-1 bg-gray-50 rounded-lg p-3">
              {/* Normal Mode */}
              <button
                onClick={() => {
                  setMode('normal');
                  setShowAccessibilityOptions(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-sm ${
                  mode === 'normal'
                    ? 'bg-[#00D47C] text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">👁️</span>
                  <span>{t('help.accessibility.normal', 'Normal')}</span>
                </div>
                {mode === 'normal' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Colorblind Mode */}
              <button
                onClick={() => {
                  setMode('colorblind');
                  setShowAccessibilityOptions(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-sm ${
                  mode === 'colorblind'
                    ? 'bg-[#00D47C] text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎨</span>
                  <span>{t('help.accessibility.colorblind', 'Colorblind Mode')}</span>
                </div>
                {mode === 'colorblind' && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Colorblind Type Selector (shown when colorblind mode is active) */}
              {mode === 'colorblind' && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#00D47C] pl-3">
                  <button
                    onClick={() => setColorblindType('general')}
                    className={`w-full flex items-center justify-between p-2 rounded transition-all text-xs ${
                      colorblindType === 'general'
                        ? 'text-[#00D47C] font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <span>General</span>
                    {colorblindType === 'general' && (
                      <div className="w-3 h-3 rounded-full bg-[#00D47C]"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setColorblindType('protanopia')}
                    className={`w-full flex items-center justify-between p-2 rounded transition-all text-xs ${
                      colorblindType === 'protanopia'
                        ? 'text-[#00D47C] font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <span>Protanopia</span>
                    {colorblindType === 'protanopia' && (
                      <div className="w-3 h-3 rounded-full bg-[#00D47C]"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setColorblindType('deuteranopia')}
                    className={`w-full flex items-center justify-between p-2 rounded transition-all text-xs ${
                      colorblindType === 'deuteranopia'
                        ? 'text-[#00D47C] font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <span>Deuteranopia</span>
                    {colorblindType === 'deuteranopia' && (
                      <div className="w-3 h-3 rounded-full bg-[#00D47C]"></div>
                    )}
                  </button>
                  <button
                    onClick={() => setColorblindType('tritanopia')}
                    className={`w-full flex items-center justify-between p-2 rounded transition-all text-xs ${
                      colorblindType === 'tritanopia'
                        ? 'text-[#00D47C] font-semibold'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <span>Tritanopia</span>
                    {colorblindType === 'tritanopia' && (
                      <div className="w-3 h-3 rounded-full bg-[#00D47C]"></div>
                    )}
                  </button>
                </div>
              )}

              {/* High Contrast Mode */}
              <button
                onClick={() => {
                  setMode('high-contrast');
                  setShowAccessibilityOptions(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-sm ${
                  mode === 'high-contrast'
                    ? 'bg-[#00D47C] text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔲</span>
                  <span>{t('help.accessibility.highContrast', 'High Contrast')}</span>
                </div>
                {mode === 'high-contrast' && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Voice Announcements Toggle */}
              <button
                onClick={() => {
                  setVoiceAnnouncementsEnabled(!voiceAnnouncementsEnabled);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-lg transition-all text-sm ${
                  voiceAnnouncementsEnabled
                    ? 'bg-[#00D47C] text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔊</span>
                  <span>{t('help.accessibility.voiceAnnouncements', 'Voice Announcements')}</span>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors flex items-center ${
                  voiceAnnouncementsEnabled ? 'bg-white/30' : 'bg-gray-300'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${
                    voiceAnnouncementsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                  }`}></div>
                </div>
              </button>
            </div>
          )}
          <MenuItem
  icon={Info}
  label="Help & Support"
  onClick={onHelpSupport}
/>
        </div>

        <div className="mt-auto px-6 pb-6 pt-2">
          <button className="w-full text-left text-sm text-red-500 font-semibold">
            Logout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MenuItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick?: () => void;               // 🔥 new
}

function MenuItem({ icon: Icon, label, onClick }: MenuItemProps) {
  return (
    <button
      className="w-full flex items-center gap-3 py-3 text-gray-800"
      onClick={onClick}
    >
      <Icon className="w-5 h-5 text-[#00A859]" />
      <span>{label}</span>
    </button>
  );
}


