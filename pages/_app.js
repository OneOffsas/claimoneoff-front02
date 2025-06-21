import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css'; // Ton CSS custom si tu veux
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  // Fix bug Bootstrap SSR sur Next.js
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return <Component {...pageProps} />;
}
