import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { SupportedLanguage } from '../types/upi';

interface OfflineIndicatorProps {
  lang: SupportedLanguage;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ lang }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xl animate-bounce">
      <WifiOff className="w-4 h-4" />
      <span>
        {lang === 'te'
          ? 'ఆఫ్‌లైన్ మోడ్ — కాలిక్యులేటర్ పూర్తిగా మీ పరికరంలో పనిచేస్తుంది.'
          : 'Offline Mode — Calculator works locally without internet.'}
      </span>
    </div>
  );
};
