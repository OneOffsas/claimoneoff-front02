// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css'; // Import global du CSS Bootstrap
import '@/styles/globals.css'; // si tu gardes Tailwind ou autres styles globaux
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }) {
  // Tu peux ajouter ici du code global, par ex. pour analytics, auth check, etc.
  // Exemple : gestion redirection si non authentifié, mais on gère ça dans chaque page.
  return <Component {...pageProps} />;
}
