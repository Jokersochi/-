/**
 * App Component
 * Wraps all pages with providers and global styles
 */

import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { TranslationProvider } from '../hooks/useTranslation';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Track page views
    const handleRouteChange = (url) => {
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: url,
        });
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <TranslationProvider defaultLocale="ru">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </TranslationProvider>
  );
}

export default MyApp;
