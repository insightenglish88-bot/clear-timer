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
  const [adPushed, setAdPushed] = useState<boolean>(false);
  const [adStatus, setAdStatus] = useState<'loading' | 'filled' | 'unfilled' | 'blocked'>('loading');

  const effectiveClientId =
    clientId ||
    (import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined)?.trim() ||
    'ca-pub-6159012230081663';
  const effectiveSlotId =
    slotId ||
    (import.meta.env.VITE_ADSENSE_SLOT_FOOTER as string | undefined)?.trim() ||
    '';

  const isConfigured = Boolean(effectiveClientId && effectiveClientId.startsWith('ca-pub-'));
  const hasSlot = Boolean(effectiveSlotId && /^\d+$/.test(effectiveSlotId));

  // Dynamically ensure AdSense script exists if configured
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

  // Safely push ad onto queue once rendered and monitor ad fill status
  useEffect(() => {
    if (!isConfigured || adPushed) return;

    const el = adRef.current;
    if (!el || typeof window === 'undefined') return;

    // Monitor for AdSense status mutations (data-ad-status="filled" | "unfilled")
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-ad-status') {
          const status = el.getAttribute('data-ad-status');
          if (status === 'filled') {
            setAdStatus('filled');
          } else if (status === 'unfilled') {
            setAdStatus('unfilled');
          }
        }
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-ad-status'] });

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdPushed(true);
    } catch (err) {
      // Gracefully handle ad-blocker or script load failures
      console.debug('AdSense init notice:', err);
      setAdStatus('blocked');
    }

    // Safety fallback: if after 3.5s no status has been resolved
    const fallbackTimer = setTimeout(() => {
      const status = el.getAttribute('data-ad-status');
      if (status === 'filled' || el.children.length > 0) {
        setAdStatus('filled');
      } else if (status === 'unfilled' || !hasSlot) {
        setAdStatus('unfilled');
      }
    }, 3500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [isConfigured, adPushed, hasSlot]);

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
        <span className="text-[8px] opacity-75">Google AdSense</span>
      </div>

      <div
        className={`w-full min-h-[52px] flex items-center justify-center p-1.5 border ${tokens.surface.border} ${tokens.surface.bg} ${pillRounded} overflow-hidden`}
      >
        {isConfigured && adStatus !== 'blocked' ? (
          <>
            {/* The Google AdSense tag (must stay in DOM for adsbygoogle queue) */}
            <div className={`w-full ${adStatus === 'unfilled' ? 'hidden' : 'block'}`}>
              <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', minHeight: '50px' }}
                data-ad-client={effectiveClientId}
                {...(hasSlot ? { 'data-ad-slot': effectiveSlotId } : {})}
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
            </div>

            {/* Clean, informative status placeholder when Google has not yet filled the slot */}
            {adStatus === 'unfilled' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center py-2 px-3 text-xs opacity-70">
                <span className="font-semibold tracking-wide text-[10px] sm:text-xs">
                  {isBracket ? '[ ADSENSE CONNECTED ]' : 'AdSense Connected'}
                </span>
                <span aria-hidden="true" className="opacity-40 hidden sm:inline">
                  &bull;
                </span>
                <span className="text-[10px] sm:text-[11px] opacity-80">
                  Awaiting Google Site Review / Ad Slot ID ({effectiveClientId})
                </span>
              </div>
            )}
          </>
        ) : (
          /* Graceful notice when AdBlocker is active or client is not configured */
          <div className="flex items-center justify-center gap-2 text-center py-2 px-3 text-xs opacity-60">
            <span className="font-semibold tracking-wide">
              {isBracket ? '[ SPONSOR SPACE ]' : 'Sponsor Space'}
            </span>
            <span aria-hidden="true" className="opacity-40">
              &bull;
            </span>
            <span className="text-[11px] opacity-75">
              {adStatus === 'blocked' ? 'AdBlocker Active' : 'AdSlot Ready'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
