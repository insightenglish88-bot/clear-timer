import type { CSSProperties } from 'react';

export type SkinId =
  | 'executive'
  | 'retro'
  | 'cyberpunk'
  | 'paper'
  | 'ocean'
  | 'sunset';

export interface SkinTokens {
  id: SkinId;
  name: string;
  tagline: string;
  previewColors: [string, string, string]; // Swatch dots: [canvas, primary, accent]
  isDark: boolean;

  // Viewport & Root Canvas
  canvas: {
    bg: string;
    text: string;
    style?: CSSProperties;
  };

  // Surface Layers (Timer Card, Panels, Modals)
  surface: {
    bg: string;
    border: string;
    shadow: string;
    rounded: string;
    backdrop?: string;
    gridPattern?: string;
  };

  // Typography & Numerals
  typography: {
    fontBody: string;
    fontDisplay: string;
    fontNumeric: string;
    tracking: string;
    weight: string;
  };

  numerals: {
    color: string;
    secondaryColor: string; // for hours or hundredths
    separatorColor: string;
    glow: string; // text-shadow / filter
    fontClass: string;
  };

  // Accent & Status Badges
  accent: {
    color: string;
    glow: string;
    ruleBg: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    progressFill: string;
  };

  // Button States & Styling
  buttons: {
    primaryStart: string; // Start/Resume button
    primaryStop: string; // Pause/Stop button
    primaryCountdown: string;
    coverActive: string;
    coverInactive: string;
    secondary: string; // Reset, Sound, Scoreboard, etc.
    bracketStyle?: boolean; // For Retro Terminal [ ACTION ]
    pillRounded: string;
  };

  // Retro CRT / Cyberpunk effects
  effects?: {
    scanlines?: boolean;
    crtFlicker?: boolean;
    glassGradientStroke?: boolean;
  };
}

export const SKINS: Record<SkinId, SkinTokens> = {
  executive: {
    id: 'executive',
    name: 'Executive Monochrome',
    tagline: 'Minimalist corporate high-contrast slate & white',
    previewColors: ['#0F172A', '#334155', '#FFFFFF'],
    isDark: true,

    canvas: {
      bg: 'bg-[#0F172A]',
      text: 'text-slate-100',
      style: { backgroundColor: '#0F172A' },
    },

    surface: {
      bg: 'bg-[#1E293B]',
      border: 'border-slate-700/80',
      shadow: 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
      rounded: 'rounded-2xl sm:rounded-3xl',
      backdrop: 'backdrop-blur-none',
      gridPattern: 'bg-[radial-gradient(#334155_1.5px,transparent_1.5px)]',
    },

    typography: {
      fontBody: 'font-sans',
      fontDisplay: 'font-sans',
      fontNumeric: 'font-sans',
      tracking: 'tracking-tight',
      weight: 'font-bold',
    },

    numerals: {
      color: 'text-white',
      secondaryColor: 'text-slate-300',
      separatorColor: 'text-slate-500',
      glow: 'none',
      fontClass: 'font-sans tracking-tight font-extrabold',
    },

    accent: {
      color: 'text-slate-200',
      glow: 'none',
      ruleBg: 'bg-slate-600',
      badgeBg: 'bg-slate-800',
      badgeText: 'text-slate-200',
      badgeBorder: 'border-slate-600',
      progressFill: 'bg-slate-100',
    },

    buttons: {
      primaryStart:
        'bg-white text-slate-900 hover:bg-slate-100 border border-slate-300 shadow-sm active:scale-[0.99]',
      primaryStop:
        'bg-slate-800 text-white hover:bg-slate-700 border border-slate-600 shadow-sm active:scale-[0.99]',
      primaryCountdown:
        'bg-slate-200 text-slate-900 motion-safe:animate-pulse border border-slate-300',
      coverActive:
        'bg-slate-700 text-white border border-slate-500 shadow-sm',
      coverInactive:
        'bg-slate-900/80 text-slate-200 hover:bg-slate-800 border border-slate-700 shadow-sm',
      secondary:
        'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-sm active:scale-[0.98]',
      pillRounded: 'rounded-xl',
    },
  },

  retro: {
    id: 'retro',
    name: 'Retro Terminal',
    tagline: 'Vintage monospace phosphor green on true black CRT',
    previewColors: ['#000000', '#15803D', '#22C55E'],
    isDark: true,

    canvas: {
      bg: 'bg-black',
      text: 'text-green-500',
      style: { backgroundColor: '#000000' },
    },

    surface: {
      bg: 'bg-black',
      border: 'border-green-500/80 shadow-[0_0_15px_rgba(34,197,94,0.25)]',
      shadow: 'shadow-[inset_0_0_20px_rgba(34,197,94,0.15)]',
      rounded: 'rounded-none',
      backdrop: 'backdrop-blur-none',
      gridPattern: 'bg-[radial-gradient(#15803d_1.5px,transparent_1.5px)]',
    },

    typography: {
      fontBody: 'font-numeric',
      fontDisplay: 'font-numeric',
      fontNumeric: 'font-numeric',
      tracking: 'tracking-widest',
      weight: 'font-mono font-bold',
    },

    numerals: {
      color: 'text-[#22C55E]',
      secondaryColor: 'text-[#16A34A]',
      separatorColor: 'text-[#15803D]',
      glow: 'drop-shadow-[0_0_12px_rgba(34,197,94,0.75)]',
      fontClass: 'font-numeric tracking-widest font-black',
    },

    accent: {
      color: 'text-[#22C55E]',
      glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]',
      ruleBg: 'bg-[#22C55E]',
      badgeBg: 'bg-black',
      badgeText: 'text-[#22C55E]',
      badgeBorder: 'border-[#22C55E]',
      progressFill: 'bg-[#22C55E]',
    },

    buttons: {
      primaryStart:
        'bg-black text-[#22C55E] hover:bg-green-950/40 border-2 border-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.4)] active:scale-[0.99]',
      primaryStop:
        'bg-black text-amber-400 hover:bg-amber-950/40 border-2 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)] active:scale-[0.99]',
      primaryCountdown:
        'bg-green-950 text-[#22C55E] border-2 border-[#22C55E] motion-safe:animate-pulse',
      coverActive:
        'bg-black text-[#22C55E] border-2 border-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.4)]',
      coverInactive:
        'bg-black text-green-600 hover:text-[#22C55E] border-2 border-green-800 hover:border-[#22C55E]',
      secondary:
        'bg-black text-[#22C55E] border border-green-700 hover:border-[#22C55E] hover:bg-green-950/30 active:scale-[0.98]',
      bracketStyle: true,
      pillRounded: 'rounded-none',
    },

    effects: {
      scanlines: true,
    },
  },

  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    tagline: 'Midnight obsidian with electric cyan & hot magenta glow',
    previewColors: ['#09090B', '#06B6D4', '#EC4899'],
    isDark: true,

    canvas: {
      bg: 'bg-[#09090B]',
      text: 'text-cyan-400',
      style: { backgroundColor: '#09090B' },
    },

    surface: {
      bg: 'bg-[#121218]/90',
      border:
        'border-cyan-500/80 shadow-[0_0_25px_rgba(6,182,212,0.3),inset_0_0_15px_rgba(236,72,153,0.15)]',
      shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
      rounded: 'rounded-xl sm:rounded-2xl',
      backdrop: 'backdrop-blur-md',
      gridPattern: 'bg-[radial-gradient(#06b6d4_1.5px,transparent_1.5px)]',
    },

    typography: {
      fontBody: 'font-numeric',
      fontDisplay: 'font-numeric',
      fontNumeric: 'font-numeric',
      tracking: 'tracking-tight',
      weight: 'font-extrabold',
    },

    numerals: {
      color: 'text-[#06B6D4]',
      secondaryColor: 'text-[#EC4899]',
      separatorColor: 'text-[#EC4899]',
      glow: 'drop-shadow-[0_0_18px_rgba(6,182,212,0.8)]',
      fontClass: 'font-numeric tracking-tight font-black',
    },

    accent: {
      color: 'text-[#EC4899]',
      glow: 'drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]',
      ruleBg: 'bg-gradient-to-r from-[#06B6D4] to-[#EC4899]',
      badgeBg: 'bg-[#181824]',
      badgeText: 'text-[#06B6D4]',
      badgeBorder: 'border-cyan-500/80',
      progressFill: 'bg-gradient-to-r from-[#06B6D4] to-[#EC4899]',
    },

    buttons: {
      primaryStart:
        'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black font-black border-2 border-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-[0.99]',
      primaryStop:
        'bg-gradient-to-r from-pink-600 to-pink-500 text-white font-black border-2 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.6)] hover:brightness-110 active:scale-[0.99]',
      primaryCountdown:
        'bg-pink-700 text-white border-2 border-pink-400 motion-safe:animate-pulse',
      coverActive:
        'bg-pink-600/90 text-white border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]',
      coverInactive:
        'bg-[#181824] text-cyan-400 hover:text-cyan-300 border-2 border-cyan-500/70 shadow-[0_0_10px_rgba(6,182,212,0.25)]',
      secondary:
        'bg-[#14141E] text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 hover:bg-[#1A1A28] shadow-[0_0_8px_rgba(6,182,212,0.2)] active:scale-[0.98]',
      pillRounded: 'rounded-xl',
    },
  },

  paper: {
    id: 'paper',
    name: 'Warm Studio / Paper',
    tagline: 'Soft cream parchment with rich espresso typography & terracotta',
    previewColors: ['#FBF9F5', '#292524', '#C2410C'],
    isDark: false,

    canvas: {
      bg: 'bg-[#FBF9F5]',
      text: 'text-[#292524]',
      style: { backgroundColor: '#FBF9F5' },
    },

    surface: {
      bg: 'bg-white',
      border: 'border-[#E7E2D7] shadow-[0_4px_16px_rgba(41,37,36,0.06)]',
      shadow: 'shadow-[0_2px_8px_rgba(41,37,36,0.04)]',
      rounded: 'rounded-3xl sm:rounded-[2rem]',
      backdrop: 'backdrop-blur-none',
      gridPattern: 'bg-[radial-gradient(#d6cebe_1.5px,transparent_1.5px)]',
    },

    typography: {
      fontBody: 'font-ui',
      fontDisplay: 'font-ui',
      fontNumeric: 'font-ui',
      tracking: 'tracking-tight',
      weight: 'font-bold',
    },

    numerals: {
      color: 'text-[#292524]',
      secondaryColor: 'text-[#78716C]',
      separatorColor: 'text-[#C2410C]',
      glow: 'none',
      fontClass: 'font-ui tracking-tighter font-extrabold',
    },

    accent: {
      color: 'text-[#C2410C]',
      glow: 'none',
      ruleBg: 'bg-[#C2410C]',
      badgeBg: 'bg-[#F5F2EB]',
      badgeText: 'text-[#292524]',
      badgeBorder: 'border-[#D7CFBF]',
      progressFill: 'bg-[#C2410C]',
    },

    buttons: {
      primaryStart:
        'bg-[#C2410C] text-white hover:bg-[#9A3412] border-2 border-[#9A3412] shadow-[0_4px_12px_rgba(194,65,12,0.25)] active:translate-y-0.5 active:shadow-none',
      primaryStop:
        'bg-[#292524] text-white hover:bg-[#1C1917] border-2 border-[#1C1917] shadow-[0_4px_12px_rgba(41,37,36,0.2)] active:translate-y-0.5 active:shadow-none',
      primaryCountdown:
        'bg-[#EA580C] text-white border-2 border-[#C2410C] motion-safe:animate-pulse',
      coverActive:
        'bg-[#C2410C] text-white border-2 border-[#9A3412] shadow-[0_3px_8px_rgba(194,65,12,0.25)]',
      coverInactive:
        'bg-white text-[#292524] hover:bg-[#F5F2EB] border-2 border-[#D7CFBF] shadow-sm',
      secondary:
        'bg-[#F5F2EB] text-[#292524] hover:bg-[#EAE4D7] border border-[#D7CFBF] shadow-sm active:translate-y-0.5',
      pillRounded: 'rounded-2xl',
    },
  },

  ocean: {
    id: 'ocean',
    name: 'Deep Ocean',
    tagline: 'Dark abyssal navy with layered deep teal & vibrant aqua display',
    previewColors: ['#030712', '#0F766E', '#14B8A6'],
    isDark: true,

    canvas: {
      bg: 'bg-[#030712]',
      text: 'text-teal-300',
      style: { backgroundColor: '#030712' },
    },

    surface: {
      bg: 'bg-[#061826]/90',
      border:
        'border-[#0F766E]/80 shadow-[0_0_30px_rgba(20,184,166,0.2),inset_0_0_20px_rgba(15,118,110,0.2)]',
      shadow: 'shadow-[0_4px_24px_rgba(3,7,18,0.6)]',
      rounded: 'rounded-2xl sm:rounded-3xl',
      backdrop: 'backdrop-blur-md',
      gridPattern: 'bg-[radial-gradient(#0f766e_1.5px,transparent_1.5px)]',
    },

    typography: {
      fontBody: 'font-numeric',
      fontDisplay: 'font-numeric',
      fontNumeric: 'font-numeric',
      tracking: 'tracking-tight',
      weight: 'font-bold',
    },

    numerals: {
      color: 'text-[#14B8A6]',
      secondaryColor: 'text-[#2DD4BF]',
      separatorColor: 'text-[#0D9488]',
      glow: 'drop-shadow-[0_0_20px_rgba(20,184,166,0.65)]',
      fontClass: 'font-numeric tracking-tight font-extrabold',
    },

    accent: {
      color: 'text-[#14B8A6]',
      glow: 'drop-shadow-[0_0_12px_rgba(20,184,166,0.6)]',
      ruleBg: 'bg-gradient-to-r from-[#0F766E] to-[#14B8A6]',
      badgeBg: 'bg-[#0A2533]',
      badgeText: 'text-[#14B8A6]',
      badgeBorder: 'border-[#0F766E]',
      progressFill: 'bg-gradient-to-r from-[#0F766E] to-[#14B8A6]',
    },

    buttons: {
      primaryStart:
        'bg-[#14B8A6] text-[#030712] font-extrabold hover:bg-[#2DD4BF] border-2 border-[#2DD4BF] shadow-[0_0_20px_rgba(20,184,166,0.5)] active:scale-[0.99]',
      primaryStop:
        'bg-[#0F766E] text-white font-extrabold hover:bg-[#115E59] border-2 border-[#14B8A6] shadow-[0_0_15px_rgba(15,118,110,0.5)] active:scale-[0.99]',
      primaryCountdown:
        'bg-[#0D9488] text-white border-2 border-[#2DD4BF] motion-safe:animate-pulse',
      coverActive:
        'bg-[#0F766E] text-teal-100 border-2 border-[#14B8A6] shadow-[0_0_15px_rgba(20,184,166,0.4)]',
      coverInactive:
        'bg-[#061826] text-teal-300 hover:text-teal-200 border-2 border-[#0F766E] hover:border-[#14B8A6]',
      secondary:
        'bg-[#0A2533] text-teal-300 border border-[#0F766E] hover:border-[#14B8A6] hover:bg-[#0E3244] shadow-[0_0_10px_rgba(15,118,110,0.25)] active:scale-[0.98]',
      pillRounded: 'rounded-full',
    },
  },

  sunset: {
    id: 'sunset',
    name: 'Solarized Sunset',
    tagline: 'Dusky plum-indigo glassmorphism with warm coral & gold highlights',
    previewColors: ['#1E1B4B', '#F97316', '#EAB308'],
    isDark: true,

    canvas: {
      bg: 'bg-[#1E1B4B]',
      text: 'text-amber-200',
      style: { backgroundColor: '#1E1B4B' },
    },

    surface: {
      bg: 'bg-[#2A2356]/80',
      border:
        'border-transparent shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative before:absolute before:inset-0 before:rounded-[inherit] before:p-[2px] before:bg-gradient-to-r before:from-[#F97316] before:via-[#EAB308] before:to-[#EC4899] before:-z-10 before:content-[""]',
      shadow: 'shadow-[0_8px_32px_rgba(249,115,22,0.15)]',
      rounded: 'rounded-2xl sm:rounded-3xl',
      backdrop: 'backdrop-blur-xl',
      gridPattern: 'bg-[radial-gradient(#f97316_1.5px,transparent_1.5px)]',
    },

    typography: {
      fontBody: 'font-ui',
      fontDisplay: 'font-ui',
      fontNumeric: 'font-ui',
      tracking: 'tracking-tight',
      weight: 'font-bold',
    },

    numerals: {
      color: 'text-[#FDE047]',
      secondaryColor: 'text-[#F97316]',
      separatorColor: 'text-[#F97316]',
      glow: 'drop-shadow-[0_0_20px_rgba(249,115,22,0.65)]',
      fontClass: 'font-ui tracking-tight font-black',
    },

    accent: {
      color: 'text-[#F97316]',
      glow: 'drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]',
      ruleBg: 'bg-gradient-to-r from-[#F97316] via-[#EAB308] to-[#EC4899]',
      badgeBg: 'bg-[#312B61]/80',
      badgeText: 'text-[#FDE047]',
      badgeBorder: 'border-orange-500/60',
      progressFill: 'bg-gradient-to-r from-[#F97316] to-[#EAB308]',
    },

    buttons: {
      primaryStart:
        'bg-gradient-to-r from-[#F97316] to-[#EAB308] text-slate-950 font-black hover:brightness-110 shadow-[0_4px_20px_rgba(249,115,22,0.5)] active:scale-[0.99]',
      primaryStop:
        'bg-[#3730A3] text-white font-bold hover:bg-[#312E81] border-2 border-indigo-400/50 shadow-[0_4px_15px_rgba(55,48,163,0.5)] active:scale-[0.99]',
      primaryCountdown:
        'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white motion-safe:animate-pulse',
      coverActive:
        'bg-gradient-to-r from-[#F97316] to-[#EAB308] text-slate-950 font-bold shadow-[0_4px_15px_rgba(249,115,22,0.4)]',
      coverInactive:
        'bg-[#2D265A] text-amber-200 hover:text-white border-2 border-orange-500/40 hover:border-orange-400',
      secondary:
        'bg-[#2A2356] text-amber-100 hover:bg-[#352D6C] border border-orange-500/30 hover:border-orange-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.2)] active:scale-[0.98]',
      pillRounded: 'rounded-xl',
    },

    effects: {
      glassGradientStroke: true,
    },
  },
};

export const DEFAULT_SKIN_ID: SkinId = 'executive';
