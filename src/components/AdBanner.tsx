import { useEffect, useRef, useState } from 'react';
import { SkinTokens } from '../theme/skins';

interface AdBannerProps {
  tokens: SkinTokens;
  slotId?: string;
  clientId?: string;
  className?: string;
}

// Global declaration for AdSense window queue
declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdBanner({
  tokens,
  slotId,
  clientId,
  className = '',
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);
  const [adFailed, setAdFailed] = useState<boolean>(false);

  const effectiveClientId =
    clientId ||
    (import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined)?.trim() ||
    'ca-pub-6159012230081663';
  const effectiveSlotId =
    slotId ||
    (import.meta.env.VITE_ADSENSE_SLOT_FOOTER as string | undefined)?.trim() ||
    '';

  const isConfigured = Boolean(effectiveClientId && effectiveClientId.startsWith('ca-pub-'));

  // Dynamically load AdSense script if client ID is configured
  useEffect(() => {
    if (!isConfigured) return;

    const scriptId = 'google-adsense-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${effectiveClientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [isConfigured, effectiveClientId]);

  // Safely push ad onto queue once rendered
  useEffect(() => {
    if (!isConfigured || adLoaded || adFailed) return;

    try {
      if (typeof window !== 'undefined' && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (err) {
      // Gracefully swallow ad-blocker or duplicate request errors
      console.debug('AdSense init notice:', err);
      setAdFailed(true);
    }
  }, [isConfigured, adLoaded, adFailed]);

  const pillRounded = tokens.buttons.pillRounded;
  const isBracket = !!tokens.buttons.bracketStyle;

  return (
    <div
      className={`w-full max-w-4xl mx-auto flex flex-col items-center justify-center select-none overflow-hidden transition-all ${className}`}
      aria-label="Sponsor Advertisement"
    >
      {/* Policy-mandated advertisement identifier */}
      <div className="w-full flex items-center justify-between px-2 pb-0.5 text-[9px] uppercase tracking-wider opacity-50 font-bold">
        <span>{isBracket ? '[ ADVERTISEMENT ]' : 'ADVERTISEMENT'}</span>
        <span className="text-[8px] opacity-75">Google Ads</span>
      </div>

      <div
        className={`w-full min-h-[50px] sm:min-h-[60px] max-h-[80px] flex items-center justify-center p-1 border ${tokens.surface.border} ${tokens.surface.bg} ${pillRounded} overflow-hidden`}
      >
        {isConfigured && !adFailed ? (
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '100%', height: '60px' }}
            data-ad-client={effectiveClientId}
            data-ad-slot={effectiveSlotId || '0000000000'}
            data-ad-format="horizontal"
            data-full-width-responsive="true"
          />
        ) : (
          /* Unobtrusive placeholder when AdSense client ID is pending configuration */
          <div className="flex items-center justify-center gap-2 text-center py-2 px-3 text-xs opacity-60">
            <span className="font-semibold tracking-wide">
              {isBracket ? '[ SPONSOR SPACE ]' : 'Sponsor Space'}
            </span>
            <span aria-hidden="true" className="opacity-40">
              &bull;
            </span>
            <span className="text-[11px] opacity-75 hidden sm:inline">
              Light Web Ads Slot (Google AdSense Ready)
            </span>
            <span className="text-[11px] opacity-75 sm:hidden">
              AdSlot Ready
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
