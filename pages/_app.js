import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/global.css";
import NotificationProvider from "../components/NotificationProvider";

export default function App({ Component, pageProps }) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}
