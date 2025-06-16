// pages/_app.js

import 'bootstrap/dist/css/bootstrap.min.css'; // Import du CSS Bootstrap
import '../styles/globals.css';               // Import de vos styles globaux

import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * MyApp est le wrapper de toutes les pages.
 * Nous importons Bootstrap ici, ainsi que le CSS global.
 */
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Exemple : si vous souhaitez forcer une logique d'authentification globale,
  // vous pourriez écouter les changements de route ici.
  // Mais pour un début, on laisse simple.
  useEffect(() => {
    // Par exemple, on peut configurer un listener pour les messages globales,
    // ou initialiser une bibliothèque JS de Bootstrap si besoin.
    // Ici, on n’a pas de code supplémentaire.
  }, [router]);

  return <Component {...pageProps} />;
}
