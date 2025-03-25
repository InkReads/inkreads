import { DM_Sans, ABeeZee, Inter } from 'next/font/google';

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const abeezee = ABeeZee({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true,
}); 