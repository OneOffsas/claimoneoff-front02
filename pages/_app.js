// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
