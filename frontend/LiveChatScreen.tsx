import { ArrowLeft, Phone } from './ui/icons';

interface LiveChatScreenProps {
  onBack: () => void;
}

export function LiveChatScreen({ onBack }: LiveChatScreenProps) {
  return (
    <div className="relative h-screen w-full max-w-md mx-auto bg-white flex flex-col overflow-hidden rounded-[40px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-4 bg-[#00A859] text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm font-semibold text-[#00A859]">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Live Support</span>
              <span className="text-[11px] text-white/80">Online</span>
            </div>
          </div>
        </div>

        <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
          <Phone className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 bg-[#f9fafb] px-4 pt-6 pb-2 overflow-y-auto">
        {/* Example incoming bubble */}
        <div className="max-w-[75%] rounded-2xl rounded-tl-none bg-white shadow-sm px-4 py-3">
          <p className="text-sm text-gray-800">Hello! How can I help you today?</p>
          <p className="mt-1 text-[11px] text-gray-400">06:04 PM</p>
        </div>
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
        <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500">
          <span className="text-lg">📎</span>
        </button>

        <div className="flex-1">
          <input
            className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00A859] focus:border-[#00A859]"
            placeholder="Type a message..."
          />
        </div>

        <button className="w-9 h-9 rounded-full bg-[#00A859] flex items-center justify-center">
          <span className="text-white text-lg">▲</span>
        </button>
      </div>
    </div>
  );
}
