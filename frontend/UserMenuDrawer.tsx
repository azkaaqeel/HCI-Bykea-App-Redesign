import { Sheet, SheetContent } from './ui/sheet';
import { useTranslation } from './i18n';
import { useAccessibility } from './accessibility';
import { Phone, Globe, Info, Filter, Clock, Wallet, Bell } from './ui/icons';

interface UserMenuDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHelpSupport: () => void;
}

export function UserMenuDrawer({ open, onOpenChange, onHelpSupport,}: UserMenuDrawerProps) {
  const { t, language, setLanguage } = useTranslation();
  const { mode, setMode } = useAccessibility();

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
            onClick={() =>
              setMode(mode === 'high-contrast' ? 'normal' : 'high-contrast')
            }
          >
            <div className="flex items-center gap-3 text-gray-800">
              <Filter className="w-5 h-5 text-[#00A859]" />
              <span>Accessibility</span>
            </div>
            <span className="text-xs text-gray-500 capitalize">{mode}</span>
          </button>
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


