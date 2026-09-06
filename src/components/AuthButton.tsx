import { useState, useRef, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { LogOut, Cloud, CloudCheck, Loader2 } from 'lucide-react';
import { SkinTokens } from '../theme/skins';

interface AuthButtonProps {
  user: User | null;
  isSyncing?: boolean;
  tokens: SkinTokens;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function AuthButton({
  user,
  isSyncing = false,
  tokens,
  onSignIn,
  onSignOut,
}: AuthButtonProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isBracket = !!tokens.buttons.bracketStyle;
  const pillRounded = tokens.buttons.pillRounded;

  // Render Google Sign-in button when signed out
  if (!user) {
    return (
      <button
        type="button"
        onClick={onSignIn}
        title="Sign in with Google to sync your classes and scoreboards"
        className={`inline-flex items-center gap-2 px-3 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${tokens.buttons.secondary} shadow-xs hover:shadow-sm active:scale-98`}
      >
        {/* Google 4-Color SVG Icon */}
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
        <span className="hidden sm:inline">
          {isBracket ? '[ GOOGLE SIGN IN ]' : 'Sign in with Google'}
        </span>
        <span className="sm:hidden">
          {isBracket ? '[ SIGN IN ]' : 'Sign In'}
        </span>
      </button>
    );
  }

  // Render User Profile & Sync Popover when signed in
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="User account menu"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${tokens.buttons.secondary} shadow-xs hover:shadow-sm active:scale-98`}
      >
        {/* User Avatar */}
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="w-5 h-5 rounded-full object-cover border border-black/20 dark:border-white/20"
          />
        ) : (
          <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-bold flex items-center justify-center text-[10px]">
            {initial}
          </span>
        )}

        {/* User First Name */}
        <span className="max-w-[80px] sm:max-w-[120px] truncate">
          {displayName.split(' ')[0]}
        </span>

        {/* Cloud Sync Icon Indicator */}
        {isSyncing ? (
          <Loader2 className="w-3 h-3 text-amber-400 animate-spin shrink-0" />
        ) : (
          <Cloud className="w-3 h-3 text-emerald-400 shrink-0" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          className={`absolute right-0 mt-2 w-64 ${pillRounded} border ${tokens.surface.border} ${tokens.surface.bg} ${tokens.canvas.text} shadow-xl p-3 z-50 flex flex-col gap-2.5 backdrop-blur-md`}
        >
          {/* User Info Header */}
          <div className="flex items-center gap-2.5 pb-2 border-b border-black/10 dark:border-white/10">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-black/20 dark:border-white/20"
              />
            ) : (
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-bold flex items-center justify-center text-xs">
                {initial}
              </span>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs truncate">{displayName}</span>
              <span className="text-[11px] opacity-60 truncate">
                {user.email}
              </span>
            </div>
          </div>

          {/* Cloud Sync Status */}
          <div className="flex items-center gap-2 px-1 text-xs">
            {isSyncing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
                <span className="text-amber-400 font-medium">
                  Syncing classes to cloud...
                </span>
              </>
            ) : (
              <>
                <Cloud className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-emerald-500 font-medium">
                  Classes synced to your account
                </span>
              </>
            )}
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onSignOut();
            }}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 ${pillRounded} text-xs font-bold transition-all cursor-pointer hover:bg-rose-500/10 hover:text-rose-400 text-inherit border border-black/10 dark:border-white/10`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
