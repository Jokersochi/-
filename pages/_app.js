import '../styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthProvider } from '../contexts/AuthContext';
import { LocaleProvider } from '../contexts/LocaleContext';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { initGA, trackPageView, initYM } from '../lib/analytics';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Initialize analytics
  useEffect(() => {
    initGA();
    initYM();
  }, []);

  // Track page views
  useEffect(() => {
    const handleRouteChange = (url) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ErrorBoundary>
      <LocaleProvider defaultLocale="ru">
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
}

export default MyApp;
