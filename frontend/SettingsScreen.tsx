import { ArrowLeft, FileText, Shield, Type, Palette, ChevronRight } from './ui/icons';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';
import { useState } from 'react';

interface SettingsScreenProps {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { t } = useTranslation();
  const { isColorblindMode } = useAccessibility();
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light');

  const fontSizes = [
    { value: 'small', label: t('settings.fontSize.small', 'Small'), size: '14px' },
    { value: 'medium', label: t('settings.fontSize.medium', 'Medium'), size: '16px' },
    { value: 'large', label: t('settings.fontSize.large', 'Large'), size: '18px' },
  ];

  const themes = [
    { value: 'light', label: t('settings.theme.light', 'Light') },
    { value: 'dark', label: t('settings.theme.dark', 'Dark') },
    { value: 'auto', label: t('settings.theme.auto', 'Auto') },
  ];

  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-[#00D47C] px-4 pt-4 pb-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-semibold text-lg">{t('settings.title', 'Settings')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Appearance Section */}
        <div className="mb-6">
          <h2 className="text-gray-500 text-xs font-semibold uppercase mb-3 px-2">
            {t('settings.appearance', 'Appearance')}
          </h2>
          
          {/* Font Size */}
          <div className="bg-white rounded-2xl border border-gray-200 mb-3">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isColorblindMode ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  <Type className={`w-5 h-5 ${
                    isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{t('settings.fontSize.title', 'Font Size')}</p>
                  <p className="text-xs text-gray-500">{t('settings.fontSize.desc', 'Adjust text size for better readability')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value as 'small' | 'medium' | 'large')}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                      fontSize === size.value
                        ? (isColorblindMode 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-[#00D47C] text-white')
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Theme */}
          <div className="bg-white rounded-2xl border border-gray-200">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isColorblindMode ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  <Palette className={`w-5 h-5 ${
                    isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{t('settings.theme.title', 'Theme')}</p>
                  <p className="text-xs text-gray-500">{t('settings.theme.desc', 'Choose your preferred theme')}</p>
                </div>
              </div>
              <div className="space-y-2">
                {themes.map((th) => (
                  <button
                    key={th.value}
                    onClick={() => setTheme(th.value as 'light' | 'dark' | 'auto')}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                      theme === th.value
                        ? (isColorblindMode 
                            ? 'bg-blue-50 border-2 border-blue-500' 
                            : 'bg-green-50 border-2 border-[#00D47C]')
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">{th.label}</span>
                    {theme === th.value && (
                      <div className={`w-5 h-5 rounded-full ${
                        isColorblindMode ? 'bg-blue-500' : 'bg-[#00D47C]'
                      }`}></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div className="mb-6">
          <h2 className="text-gray-500 text-xs font-semibold uppercase mb-3 px-2">
            {t('settings.legal', 'Legal')}
          </h2>
          
          <div className="bg-white rounded-2xl border border-gray-200">
            <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isColorblindMode ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{t('settings.terms', 'Terms of Service')}</p>
                  <p className="text-xs text-gray-500">{t('settings.terms.desc', 'Read our terms and conditions')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isColorblindMode ? 'bg-blue-50' : 'bg-green-50'
                }`}>
                  <Shield className={`w-5 h-5 ${
                    isColorblindMode ? 'text-blue-600' : 'text-[#00D47C]'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{t('settings.privacy', 'Privacy Policy')}</p>
                  <p className="text-xs text-gray-500">{t('settings.privacy.desc', 'How we protect your data')}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400 mb-1">{t('settings.version', 'Version 1.0.0')}</p>
          <p className="text-xs text-gray-400">{t('settings.copyright', '© 2025 Bykea. All rights reserved.')}</p>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="pb-4 flex justify-center">
        <div className="w-32 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
}

