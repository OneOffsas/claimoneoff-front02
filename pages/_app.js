// pages/_app.js
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import NotificationProvider from "../components/NotificationProvider";
import Script from "next/script";

export default function App({ Component, pageProps }) {
  return (
    <NotificationProvider>
      {/* On charge js-sha256 AVANT toute page */}
      <Script
        src="https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/build/sha256.min.js"
        strategy="beforeInteractive"
        onLoad={() => { console.log("SHA256 loaded"); }}
      />
      <Component {...pageProps} />
    </NotificationProvider>
  );
}
