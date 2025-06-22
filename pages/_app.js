import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={2800} hideProgressBar newestOnTop />
    </>
  );
}
