// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';  // Chemin relatif depuis pages/_app.js

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
