import Head from "next/head";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"; // Pour les icônes stylées !
function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        {/* Ajoute ta couleur principale, favicon, meta… */}
        <style>
          {`
            body { background: linear-gradient(120deg, #7356fa 0%, #0a3d91 100%) !important; }
            .sidebar-custom {
              background: #fff;
              min-height: 100vh;
              box-shadow: 0 0 20px #0001;
              border-radius: 20px 0 0 20px;
            }
            .brand { font-weight: bold; color: #7356fa; letter-spacing: 2px; }
            .menu-item-active { background: #eee !important; border-radius: 10px; }
          `}
        </style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
