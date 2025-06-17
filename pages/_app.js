// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'; // ou retire si tu n'as pas ce fichier

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
